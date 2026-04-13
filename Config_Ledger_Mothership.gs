/******************************************************************************
 * CONFIG LEDGER - Mothership Module
 * Repo: Ma_Golide_Mothership
 *
 * PURPOSE:
 *   Reads the `dominant_stamp` and `stamp_purity` columns from the two
 *   Assayer mother-contract sheets (ASSAYER_EDGES, ASSAYER_LEAGUE_PURITY)
 *   and exposes a clean API so the Mothership can:
 *
 *     1. FILTER  - only build accas from rows stamped with a known-good config
 *     2. SEGMENT - compare gold rates across different config versions
 *     3. REPORT  - surface config drift warnings before betting decisions
 *
 * INTEGRATION:
 *   Call ConfigLedger_Mothership.init(assayerSpreadsheetId) once when the
 *   Mothership loads data from the Assayer.
 *
 *   Then use:
 *     .filterByStamp(rows, options)
 *     .segmentByStamp(rows)
 *     .getDriftReport(rows)
 *     .isSafeToAcca(leagueKey, options)
 *
 * DESIGN INVARIANT:
 *   - Read-only. Never writes to any sheet.
 *   - Works from in-memory data; no repeated API calls after first load.
 *   - Gracefully degrades: if stamps are absent, filtering passes all rows
 *     (preserves existing Mothership behaviour).
 ******************************************************************************/

// ============================================================================
// Public API
// ============================================================================
const ConfigLedger_Mothership = {

  _ledgerRows: null,   // Array of ledger row objects from Config_Ledger
  _assayerId: null,    // Assayer spreadsheet ID
  _log: null,

  // --------------------------------------------------------------------------
  // init
  //   assayerSpreadsheetId - Google Sheet ID of the Ma_Assayer workbook.
  //   Loads the Config_Ledger and caches it for the session.
  // --------------------------------------------------------------------------
  init(assayerSpreadsheetId) {
    this._assayerId  = assayerSpreadsheetId || null;
    this._ledgerRows = null;
    this._log = (typeof Log_ !== "undefined") ? Log_.module("CFG_MOTHERSHIP") : {
      info: console.log, warn: console.warn, error: console.error
    };
    this._loadLedger();
    this._log.info("ConfigLedger_Mothership ready.");
  },

  // --------------------------------------------------------------------------
  // filterByStamp
  //   Returns only the rows that match an allowed stamp policy.
  //
  //   options:
  //     allowedVersions  - string[]  e.g. ["MULTI-LEAGUE-STRICT-2.0"]
  //                        If omitted / empty, all stamped versions pass.
  //     minStampPurity   - number 0-100 (default 70)
  //                        Rows with stamp_purity below this are excluded.
  //     includeUnstamped - boolean (default false)
  //                        Whether to include rows with no config_stamp.
  //
  //   `rows` - array of objects from ASSAYER_LEAGUE_PURITY or ASSAYER_EDGES.
  // --------------------------------------------------------------------------
  filterByStamp(rows, options) {
    if (!Array.isArray(rows)) return [];

    const opts = {
      allowedVersions:  [],
      minStampPurity:   70,
      includeUnstamped: false,
      ...options
    };

    return rows.filter(row => {
      const stamp   = this._resolveField(row, ["dominant_stamp", "stamp_id", "stampId"]);
      const purity  = this._resolvePct(row, ["stamp_purity", "stampPurity"]);
      const version = this._resolveField(row, ["dominant_version", "version"]) ||
                      this._versionForStamp(stamp);

      // Unstamped rows
      if (!stamp) return opts.includeUnstamped;

      // Purity gate
      if (purity !== null && purity < opts.minStampPurity) return false;

      // Version whitelist (skip check if list is empty = allow all)
      if (opts.allowedVersions.length > 0 &&
          !opts.allowedVersions.includes(version)) return false;

      return true;
    });
  },

  // --------------------------------------------------------------------------
  // segmentByStamp
  //   Groups `rows` by dominant_stamp and returns a segment map:
  //   {
  //     [stampId]: {
  //       stampId, version, builtAt, count,
  //       goldPct, avgWinRate, rows: [...]
  //     }
  //   }
  //   Useful for comparing how GOLD rates differ between config versions.
  // --------------------------------------------------------------------------
  segmentByStamp(rows) {
    if (!Array.isArray(rows)) return {};

    const segments = {};

    for (const row of rows) {
      const stamp = this._resolveField(row, ["dominant_stamp", "stamp_id"]) || "__UNSTAMPED__";

      if (!segments[stamp]) {
        const meta = this._metaForStamp(stamp);
        segments[stamp] = {
          stampId:  stamp,
          version:  meta ? meta.version  : (stamp === "__UNSTAMPED__" ? null : "unknown"),
          builtAt:  meta ? meta.built_at : null,
          count:    0,
          goldCount: 0,
          winRateSum: 0,
          rows:     []
        };
      }

      const seg = segments[stamp];
      seg.count++;
      seg.rows.push(row);

      const grade = this._resolveField(row, ["grade"]);
      if (grade === "GOLD" || grade === "PLATINUM") seg.goldCount++;

      const wr = this._resolveFloat(row, ["win_rate", "winRate", "shrunkRate"]);
      if (wr !== null) seg.winRateSum += wr;
    }

    // Post-process percentages
    for (const seg of Object.values(segments)) {
      seg.goldPct    = seg.count > 0 ? (seg.goldCount / seg.count) : 0;
      seg.avgWinRate = seg.count > 0 ? (seg.winRateSum / seg.count) : 0;
      delete seg.winRateSum;
    }

    return segments;
  },

  // --------------------------------------------------------------------------
  // getDriftReport
  //   Detects config drift across the rows - situations where the same
  //   league/source/tier combination has results from multiple config stamps.
  //
  //   Returns an array of drift warnings, sorted by severity (desc):
  //   [{ key, stamps, stampCount, maxWinRateDelta, severity, warning }]
  // --------------------------------------------------------------------------
  getDriftReport(rows) {
    if (!Array.isArray(rows)) return [];

    // Group by a natural key (league + source + gender + tier)
    const byKey = {};

    for (const row of rows) {
      const key = [
        this._resolveField(row, ["league"])  || "?",
        this._resolveField(row, ["source"])  || "?",
        this._resolveField(row, ["gender"])  || "?",
        this._resolveField(row, ["tier"])    || "?",
      ].join("|");

      const stamp = this._resolveField(row, ["dominant_stamp"]);
      const wr    = this._resolveFloat(row, ["win_rate", "shrunkRate"]);
      const q     = this._resolveField(row, ["quarter"]) || "All";

      // Only examine all-quarter rows to avoid per-Q noise
      if (q !== "All" && q !== "all" && q !== "") continue;

      if (!byKey[key]) byKey[key] = {};
      if (stamp) {
        if (!byKey[key][stamp]) byKey[key][stamp] = [];
        if (wr !== null) byKey[key][stamp].push(wr);
      }
    }

    const warnings = [];

    for (const [key, stampMap] of Object.entries(byKey)) {
      const stamps = Object.keys(stampMap);
      if (stamps.length < 2) continue; // no drift - only one config

      // Compute max win-rate delta across configs for this key
      const avgRates = stamps.map(sid => {
        const rates = stampMap[sid];
        return rates.length > 0
          ? rates.reduce((a, b) => a + b, 0) / rates.length
          : null;
      }).filter(v => v !== null);

      const maxDelta = avgRates.length > 1
        ? Math.max(...avgRates) - Math.min(...avgRates)
        : 0;

      const severity = maxDelta >= 0.10 ? "HIGH"
                     : maxDelta >= 0.05 ? "MEDIUM"
                     : "LOW";

      warnings.push({
        key,
        stamps,
        stampCount:      stamps.length,
        maxWinRateDelta: maxDelta,
        severity,
        warning: `${key}: ${stamps.length} config versions, max = ` +
                 `${(maxDelta * 100).toFixed(1)}% win rate`
      });
    }

    warnings.sort((a, b) => b.maxWinRateDelta - a.maxWinRateDelta);
    return warnings;
  },

  // --------------------------------------------------------------------------
  // isSafeToAcca
  //   Convenience check before building an acca leg from a league/source/tier.
  //   Returns { safe: boolean, reason: string, stamp: string|null }.
  //
  //   options:
  //     allowedVersions - same as filterByStamp
  //     minPurity       - 0-100 (default 80 - stricter than filtering)
  //     minN            - minimum decisive bets required (default 30)
  // --------------------------------------------------------------------------
  isSafeToAcca(purityRow, options) {
    const opts = {
      allowedVersions: [],
      minPurity:       80,
      minN:            30,
      ...options
    };

    const stamp   = this._resolveField(purityRow, ["dominant_stamp"]);
    const purity  = this._resolvePct(purityRow, ["stamp_purity"]);
    const version = this._versionForStamp(stamp);
    const n       = this._resolveFloat(purityRow, ["n"]) || 0;

    if (!stamp) {
      return { safe: false, reason: "No config stamp - prediction provenance unknown", stamp: null };
    }
    if (purity !== null && purity < opts.minPurity) {
      return {
        safe:   false,
        reason: `Stamp purity ${purity.toFixed(0)}% < required ${opts.minPurity}% - mixed config data`,
        stamp
      };
    }
    if (opts.allowedVersions.length > 0 && !opts.allowedVersions.includes(version)) {
      return {
        safe:   false,
        reason: `Config version "${version}" not in allowed list`,
        stamp
      };
    }
    if (n < opts.minN) {
      return {
        safe:   false,
        reason: `Insufficient sample N=${n} (need ${opts.minN}) for this config slice`,
        stamp
      };
    }

    return { safe: true, reason: "OK", stamp, version };
  },

  // --------------------------------------------------------------------------
  // writeConfigLedgerSummary
  //   Writes a human-readable Config Ledger summary section into an
  //   existing Google Sheet (e.g. the Mothership's MA_Summary tab).
  //   startRow - 1-based row to begin writing (appended below existing data).
  // --------------------------------------------------------------------------
  writeConfigLedgerSummary(sheet, allPurityRows, startRow) {
    if (!sheet) return;

    const segments   = this.segmentByStamp(allPurityRows || []);
    const driftWarns = this.getDriftReport(allPurityRows || []);
    const row        = startRow || (sheet.getLastRow() + 2);
    const data       = [];

    data.push([""]);
    data.push(["CONFIG LEDGER SUMMARY"]);
    data.push([""]);
    data.push(["Stamp ID", "Version", "Built At", "Rows", "Gold%", "Avg Win Rate"]);

    for (const seg of Object.values(segments)) {
      data.push([
        seg.stampId   || " ",
        seg.version   || "unknown",
        seg.builtAt   || " ",
        seg.count,
        (seg.goldPct * 100).toFixed(1) + "%",
        (seg.avgWinRate * 100).toFixed(1) + "%"
      ]);
    }

    data.push([""]);

    if (driftWarns.length > 0) {
      data.push([" CONFIG DRIFT DETECTED"]);
      data.push(["Key", "Severity", "Configs", "Max WR ", "Warning"]);
      driftWarns.slice(0, 10).forEach(w => {
        data.push([w.key, w.severity, w.stampCount, (w.maxWinRateDelta * 100).toFixed(1) + "%", w.warning]);
      });
    } else {
      data.push([" No config drift detected"]);
    }

    const padded = data.map(r => {
      while (r.length < 6) r.push("");
      return r.slice(0, 6);
    });

    sheet.getRange(row, 1, padded.length, 6).setValues(padded);
    sheet.getRange(row, 1).setFontSize(12).setFontWeight("bold");
  },

  // ============================================================================
  // Internal helpers
  // ============================================================================

  _loadLedger() {
    this._ledgerRows = [];
    try {
      const ss = this._assayerId
        ? SpreadsheetApp.openById(this._assayerId)
        : SpreadsheetApp.getActiveSpreadsheet();

      const sheet = ss.getSheetByName("Config_Ledger");
      if (!sheet) {
        this._log.warn("Config_Ledger not found in Assayer sheet - drift detection disabled");
        return;
      }

      const data    = sheet.getDataRange().getValues();
      const headers = data[0].map(h => String(h).trim().toLowerCase().replace(/\s+/g, "_"));

      for (let i = 1; i < data.length; i++) {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = data[i][idx]; });
        this._ledgerRows.push(obj);
      }
      this._log.info(`Config_Ledger loaded: ${this._ledgerRows.length} entries`);

    } catch (err) {
      this._log.warn(`Config_Ledger load error: ${err.message}`);
    }
  },

  _metaForStamp(stampId) {
    if (!stampId || !Array.isArray(this._ledgerRows)) return null;
    return this._ledgerRows.find(r => r.stamp_id === stampId) || null;
  },

  _versionForStamp(stampId) {
    const meta = this._metaForStamp(stampId);
    return meta ? (meta.version || null) : null;
  },

  _resolveField(obj, keys) {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return null;
  },

  _resolvePct(obj, keys) {
    const raw = this._resolveField(obj, keys);
    if (raw === null) return null;
    const s = String(raw).replace("%", "").trim();
    const n = parseFloat(s);
    return isNaN(n) ? null : (n > 1 ? n : n * 100); // normalise to 0-100
  },

  _resolveFloat(obj, keys) {
    const raw = this._resolveField(obj, keys);
    if (raw === null) return null;
    const n = parseFloat(String(raw).replace("%", ""));
    return isNaN(n) ? null : n;
  }
};
