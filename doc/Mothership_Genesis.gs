/**
 * ======================================================================
 * FILE: Mothership_Genesis.gs
 * PROJECT: Ma Golide - MOTHERSHIP
 * PURPOSE: One-click setup for Central Command structure
 * AUTHOR: AI Council (GPT-5.1, The Architect)
 * VERSION: 2.1 (Aligned with AccaEngine)
 * USAGE: Run setupMothership() once when creating a new Mothership file
 * ======================================================================
 */

/**
 * WHY: To establish a standardized, repeatable structure for the central hub
 * WHAT: Creates and formats all required Mothership sheets
 * HOW: Uses SpreadsheetApp to create Config, Sync_Temp, Acca_Portfolio, Acca_Results, Master_Dashboard
 * WHERE: This script runs ONLY inside the 'Ma Golide - MOTHERSHIP' Google Sheet
 */
function setupMothership() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  // Confirmation dialog
  const confirm = ui.alert(
    '🚀 Ma Golide Mothership Setup',
    'This will create/reset the following sheets:\n\n' +
    '• Config - Satellite registry\n' +
    '• Sync_Temp - Bet staging area\n' +
    '• Acca_Portfolio - Accumulator display\n' +
    '• Acca_Results - Results tracker\n' +
    '• Master_Dashboard - KPI overview\n\n' +
    'Continue with setup?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) {
    ss.toast('❌ Setup cancelled', 'Ma Golide', 3);
    return;
  }
  
  ss.toast(' Constructing Central Command...', 'Ma Golide Mothership', 5);

  try {
    ss.toast('Creating Config sheet...', 'Step 1/12', 3);
    _createConfigSheet(ss);
    
    ss.toast('Creating Satellite_Registry sheet...', 'Step 2/12', 3);
    _createSatelliteRegistrySheet(ss);
    
    ss.toast('Creating Sync_Temp sheet...', 'Step 3/12', 3);
    _createSyncTempSheet(ss);
    
    ss.toast('Creating Acca_Portfolio sheet...', 'Step 4/12', 3);
    _createAccaPortfolioSheet(ss);
    
    ss.toast('Creating Acca_Results sheet...', 'Step 5/12', 3);
    _createAccaResultsSheet(ss);
    
    ss.toast('Creating Master_Dashboard sheet...', 'Step 6/12', 3);
    _createDashboardSheet(ss);
    
    ss.toast('Creating Config_Ledger sheet...', 'Step 7/12', 3);
    _createConfigLedgerSheet(ss);
    
    ss.toast('Creating Vault sheets...', 'Step 8/12', 3);
    _createVaultSheets(ss);
    
    ss.toast('Creating Analysis sheets...', 'Step 9/12', 3);
    _createAnalysisSheets(ss);
    
    ss.toast('Creating Performance sheets...', 'Step 10/12', 3);
    _createPerformanceSheets(ss);
    
    ss.toast('Creating Risky Analysis sheets...', 'Step 11/12', 3);
    _createRiskySheets(ss);
    
    ss.toast('Creating Historical sheets...', 'Step 12/12', 3);
    _createHistoricalSheets(ss);
    
    _cleanupDefaultSheet(ss);

    ss.toast('✅ Mothership Construction Complete!', 'Success', 5);
    ui.alert(
      '🎉 Mothership Ready!',
      'Successfully created all 12 sheets:\n\n' +
      '✅ Config - Register your satellite leagues here\n' +
      '✅ Satellite_Registry - Satellite URL management\n' +
      '✅ Sync_Temp - Staging area for synced bets\n' +
      '✅ Acca_Portfolio - Your accumulator display\n' +
      '✅ Acca_Results - Track wins/losses\n' +
      '✅ Master_Dashboard - KPI overview\n' +
      '✅ Config_Ledger - Configuration with dominant_stamp\n' +
      '✅ Vault & MA_Vault - Bet vault with purity tracking\n' +
      '✅ Analysis_Tier1 & MA_Discovery - Analysis sheets\n' +
      '✅ Performance sheets - League & Bet performance\n' +
      '✅ Risky analysis sheets - Risky accumulator analysis\n' +
      '✅ Historical sheets - Results archive & performance log\n\n' +
      '📌 NEXT STEPS:\n' +
      '1. Go to Config sheet\n' +
      '2. Add your satellite spreadsheet URLs\n' +
      '3. Run "Sync All Leagues" from the menu',
      ui.ButtonSet.OK
    );
  } catch (e) {
    Logger.log(`[Genesis] ERROR: ${e.message}\n${e.stack}`);
    ui.alert('❌ Setup Error', `Failed to complete setup:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * WHY: Config sheet stores all satellite league connections
 * WHAT: Creates the registry for satellite spreadsheets
 * HOW: Sets up headers and example row
 */
function _createConfigSheet(ss) {
  let sheet = ss.getSheetByName('Config');
  if (!sheet) {
    sheet = ss.insertSheet('Config', 0);
  }
  sheet.clear();

  // PHASE 1: add assayer_sheet_id column (H)
  const headers = [[
    'League ID', 'League Name', 'File URL', 'Sport Type', 'Status', 'Quarters', 'Last Sync',
    'assayer_sheet_id'
  ]];

  sheet.getRange('A1:H1').setValues(headers)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  sheet.getRange('A2:H2').setValues([[
    'NBA_2025',
    'NBA',
    'PASTE_SATELLITE_URL_HERE',
    'Basketball',
    'Active',
    4,
    '',
    'PASTE_ASSAYER_SHEET_ID_HERE'
  ]]);

  sheet.getRange('A3:H3').setValues([[
    'EURO_2025',
    'Euroleague',
    'PASTE_ANOTHER_URL_HERE',
    'Basketball',
    'Active',
    4,
    '',
    'PASTE_ASSAYER_SHEET_ID_HERE'
  ]]).setFontColor('#999999');

  sheet.setColumnWidth(3, 400);
  sheet.setColumnWidth(8, 320);
  sheet.autoResizeColumns(1, 2);
  sheet.autoResizeColumns(4, 7);

  sheet.getRange('I1').setValue('📌 Instructions:')
    .setFontWeight('bold')
    .setFontSize(11);
  sheet.getRange('I2').setValue('1. Replace URLs with your satellite spreadsheet URLs')
    .setFontColor('#666666');
  sheet.getRange('I3').setValue('2. Set Status to "Active" or "Inactive"')
    .setFontColor('#666666');
  sheet.getRange('I4').setValue('3. Run "Sync All Leagues" from the menu')
    .setFontColor('#666666');
  sheet.getRange('I5').setValue('4. Quarters = number of periods (4 for NBA, 2 for soccer)')
    .setFontColor('#666666');
  sheet.getRange('I6').setValue('5. Set assayer_sheet_id to enable Assayer edges + league purity routing')
    .setFontColor('#666666');

  Logger.log('[Genesis] Config sheet created (with assayer_sheet_id)');
}

/**
 * WHY: Satellite_Registry sheet manages satellite spreadsheet URLs and status
 * WHAT: Creates the registry for satellite connections with user-friendly interface
 * HOW: Sets up headers for satellite management
 */
function _createSatelliteRegistrySheet(ss) {
  let sheet = ss.getSheetByName('Satellite_Registry');
  if (!sheet) {
    sheet = ss.insertSheet('Satellite_Registry', 1);
  }
  sheet.clear();

  const headers = [[
    'satellite_id', 'spreadsheet_url', 'satellite_name', 'status', 'last_sync', 'config_version', 'notes'
  ]];

  sheet.getRange('A1:G1').setValues(headers)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  // Add example row
  sheet.getRange('A2:G2').setValues([[
    'SAT_001',
    'https://docs.google.com/spreadsheets/d/YOUR_SATELLITE_ID_HERE',
    'Example Satellite',
    'ACTIVE',
    new Date().toISOString(),
    'v1.0',
    'Paste satellite URLs in column B'
  ]]);

  // Set column widths
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 400);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 300);

  // Add instructions
  sheet.getRange('I1').setValue('Satellite Registry Instructions:')
    .setFontWeight('bold')
    .setFontSize(11);
  sheet.getRange('I2').setValue('1. Paste satellite spreadsheet URLs in column B')
    .setFontColor('#666666');
  sheet.getRange('I3').setValue('2. Status: ACTIVE, INACTIVE, UNKNOWN, ERROR')
    .setFontColor('#666666');
  sheet.getRange('I4').setValue('3. Run sync functions to update last_sync')
    .setFontColor('#666666');

  Logger.log('[Genesis] Satellite_Registry sheet created');
}

/**
 * WHY: Sync_Temp is the staging area for synced bets before portfolio building
 * WHAT: Creates the canonical schema for bet data
 * HOW: Sets up headers matching AccaEngine expectations
 */
function _createSyncTempSheet(ss) {
  let sheet = ss.getSheetByName('Sync_Temp');
  if (!sheet) {
    sheet = ss.insertSheet('Sync_Temp', 1);
  }
  sheet.clear();
  
  const headers = [['League', 'Time', 'Match', 'Pick', 'Type', 'Odds', 'Confidence', 'EV']];
  sheet.getRange('A1:H1').setValues(headers)
    .setFontWeight('bold')
    .setBackground('#ff9900')
    .setFontColor('#ffffff');

  sheet.getRange('A2').setValue('⏳ Run "Sync All Leagues" to populate this sheet');
  sheet.getRange('A2:H2').merge().setFontColor('#999999').setFontStyle('italic');

  sheet.autoResizeColumns(1, 8);

  Logger.log('[Genesis] Sync_Temp sheet created');
}

/**
 * WHY: Acca_Portfolio displays the built accumulators
 * WHAT: Creates the display sheet for accumulator portfolios
 * HOW: Sets up structure for AccaEngine output
 */
function _createAccaPortfolioSheet(ss) {
  let sheet = ss.getSheetByName('Acca_Portfolio');
  if (!sheet) {
    sheet = ss.insertSheet('Acca_Portfolio', 2);
  }
  sheet.clear();
  
  sheet.getRange('A1:I1').merge()
    .setValue('🎰 MA GOLIDE - ACCUMULATOR PORTFOLIO')
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  sheet.getRange('A3').setValue('⏳ Run "Build Portfolio" after syncing leagues');
  sheet.getRange('A3:I3').merge().setFontColor('#999999').setFontStyle('italic');

  Logger.log('[Genesis] Acca_Portfolio sheet created');
}

/**
 * WHY: Acca_Results tracks accumulator outcomes
 * WHAT: Creates the results tracking sheet
 * HOW: Sets up headers for result monitoring
 */
function _createAccaResultsSheet(ss) {
  let sheet = ss.getSheetByName('Acca_Results');
  if (!sheet) {
    sheet = ss.insertSheet('Acca_Results', 3);
  }
  sheet.clear();
  
  const headers = [[
    'Acca ID', 'Type', 'Legs', 'Total Odds', 'Avg Conf%',
    'Created', 'Window Start', 'Window End',
    'Status', 'Legs Won', 'Legs Lost', 'Legs Pending', 'Result'
  ]];
  sheet.getRange('A1:M1').setValues(headers)
    .setFontWeight('bold')
    .setBackground('#38761d')
    .setFontColor('#ffffff');

  sheet.getRange('A2').setValue('⏳ Results will appear here after building and checking accumulators');
  sheet.getRange('A2:M2').merge().setFontColor('#999999').setFontStyle('italic');

  sheet.autoResizeColumns(1, 13);

  Logger.log('[Genesis] Acca_Results sheet created');
}

/**
 * WHY: Master_Dashboard provides KPI overview
 * WHAT: Creates the dashboard for performance metrics
 * HOW: Sets up structure for HiveMind updates
 */
function _createDashboardSheet(ss) {
  let sheet = ss.getSheetByName('Master_Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Master_Dashboard', 4);
  }
  sheet.clear();
  
  sheet.getRange('A1:D1').merge()
    .setValue('🏀 MA GOLIDE - HIVE MIND DASHBOARD')
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#674ea7')
    .setFontColor('#ffffff');

  const kpiData = [
    ['', ''],
    ['📊 SYNC STATUS', ''],
    ['Total Leagues:', '0'],
    ['Active Leagues:', '0'],
    ['Last Sync:', 'Never'],
    ['', ''],
    ['📈 BET STATISTICS', ''],
    ['Total Bets Synced:', '0'],
    ['Bankers:', '0'],
    ['Snipers:', '0'],
    ['', ''],
    ['🎰 ACCUMULATOR STATS', ''],
    ['Total Accas Built:', '0'],
    ['Accas Won:', '0'],
    ['Accas Lost:', '0'],
    ['Accas Pending:', '0'],
    ['Win Rate:', 'N/A'],
    ['', ''],
    ['💰 PERFORMANCE', ''],
    ['Best Acca Type:', 'N/A'],
    ['Total ROI:', 'N/A']
  ];

  sheet.getRange(2, 1, kpiData.length, 2).setValues(kpiData);

  [3, 8, 13, 20].forEach(row => {
    sheet.getRange(row, 1, 1, 2).setFontWeight('bold').setBackground('#e8e8e8');
  });

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);

  Logger.log('[Genesis] Master_Dashboard sheet created');
}

/**
 * WHY: Clean up default Sheet1
 * WHAT: Removes the auto-created Sheet1
 * HOW: Tries to delete, ignores if doesn't exist
 */
function _cleanupDefaultSheet(ss) {
  try {
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet) {
      ss.deleteSheet(defaultSheet);
      Logger.log('[Genesis] Removed default Sheet1');
    }
  } catch (e) {
    // Ignore - sheet might not exist or can't be deleted
  }
}



/**
 * Analyze SNIPER DIR performance specifically
 * Shows win rate and ROI for directional O/U picks
 */
function analyzeSniperDirPerformance() {
  const FUNC_NAME = 'analyzeSniperDirPerformance';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  
  Logger.log(`[${FUNC_NAME}] ╔══════════════════════════════════════════════════════════════╗`);
  Logger.log(`[${FUNC_NAME}] ║              SNIPER DIR PERFORMANCE ANALYSIS                 ║`);
  Logger.log(`[${FUNC_NAME}] ╚══════════════════════════════════════════════════════════════╝`);
  
  ss.toast('🎯 Analyzing SNIPER DIR performance...', 'Analysis', 10);
  
  try {
    const perfSheet = ss.getSheetByName('Bet_Performance');
    if (!perfSheet) {
      throw new Error('Bet_Performance sheet not found. Run "Analyze Bet Performance" first.');
    }
    
    const data = perfSheet.getDataRange().getValues();
    
    // Find data rows
    let dataStartRow = 0;
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === 'League') {
        dataStartRow = i + 1;
        break;
      }
    }
    
    if (dataStartRow === 0) {
      throw new Error('Could not find data section in Bet_Performance');
    }
    
    // Collect SNIPER DIR stats
    const dirStats = {
      total: 0, won: 0, lost: 0, pending: 0,
      byQuarter: { q1: { won: 0, lost: 0 }, q2: { won: 0, lost: 0 }, q3: { won: 0, lost: 0 }, q4: { won: 0, lost: 0 } },
      byDirection: { over: { won: 0, lost: 0 }, under: { won: 0, lost: 0 } },
      byLeague: {}
    };
    
    for (let i = dataStartRow; i < data.length; i++) {
      const row = data[i];
      const league = String(row[0] || '').trim();
      const pick = String(row[2] || '').toUpperCase();
      const betType = String(row[3] || '').toUpperCase();
      const grade = String(row[4] || '').toUpperCase();
      
      // Check if this is a SNIPER DIR bet
      const isDirType = betType.includes('DIR');
      const isDirPick = /Q[1-4]\s*(OVER|UNDER)\s*[\d.]+/i.test(pick);
      
      if (!isDirType && !isDirPick) continue;
      
      dirStats.total++;
      
      if (grade === 'WON') dirStats.won++;
      else if (grade === 'LOST') dirStats.lost++;
      else dirStats.pending++;
      
      // Extract quarter and direction
      const match = pick.match(/Q([1-4])\s*(OVER|UNDER)/i);
      if (match) {
        const qKey = `q${match[1]}`;
        const dir = match[2].toLowerCase();
        
        if (grade === 'WON') {
          dirStats.byQuarter[qKey].won++;
          dirStats.byDirection[dir].won++;
        } else if (grade === 'LOST') {
          dirStats.byQuarter[qKey].lost++;
          dirStats.byDirection[dir].lost++;
        }
      }
      
      // By league
      if (!dirStats.byLeague[league]) {
        dirStats.byLeague[league] = { won: 0, lost: 0 };
      }
      if (grade === 'WON') dirStats.byLeague[league].won++;
      else if (grade === 'LOST') dirStats.byLeague[league].lost++;
    }
    
    // Calculate win rates
    const graded = dirStats.won + dirStats.lost;
    const overallRate = graded > 0 ? ((dirStats.won / graded) * 100).toFixed(1) : 'N/A';
    
    // Build report
    let report = `🎯 SNIPER DIR PERFORMANCE REPORT\n\n`;
    report += `Total DIR bets: ${dirStats.total}\n`;
    report += `Graded: ${graded} (Won: ${dirStats.won}, Lost: ${dirStats.lost})\n`;
    report += `Win Rate: ${overallRate}%\n`;
    report += `Pending: ${dirStats.pending}\n\n`;
    
    report += `📊 BY QUARTER:\n`;
    ['q1', 'q2', 'q3', 'q4'].forEach(q => {
      const qData = dirStats.byQuarter[q];
      const qGraded = qData.won + qData.lost;
      const qRate = qGraded > 0 ? ((qData.won / qGraded) * 100).toFixed(1) : 'N/A';
      report += `   ${q.toUpperCase()}: ${qData.won}W/${qData.lost}L (${qRate}%)\n`;
    });
    
    report += `\n📊 BY DIRECTION:\n`;
    ['over', 'under'].forEach(dir => {
      const dData = dirStats.byDirection[dir];
      const dGraded = dData.won + dData.lost;
      const dRate = dGraded > 0 ? ((dData.won / dGraded) * 100).toFixed(1) : 'N/A';
      report += `   ${dir.toUpperCase()}: ${dData.won}W/${dData.lost}L (${dRate}%)\n`;
    });
    
    // Top/bottom leagues
    const leagueRankings = Object.entries(dirStats.byLeague)
      .map(([league, stats]) => {
        const g = stats.won + stats.lost;
        return { league, ...stats, graded: g, rate: g > 0 ? (stats.won / g) * 100 : null };
      })
      .filter(l => l.graded >= 3)
      .sort((a, b) => (b.rate || 0) - (a.rate || 0));
    
    if (leagueRankings.length > 0) {
      report += `\n🏆 TOP LEAGUES (3+ bets):\n`;
      leagueRankings.slice(0, 3).forEach((l, i) => {
        report += `   ${i + 1}. ${l.league}: ${l.rate?.toFixed(1)}% (${l.won}W/${l.lost}L)\n`;
      });
      
      const poorLeagues = leagueRankings.filter(l => l.rate !== null && l.rate < 45);
      if (poorLeagues.length > 0) {
        report += `\n❌ NEEDS IMPROVEMENT:\n`;
        poorLeagues.slice(0, 3).forEach(l => {
          report += `   • ${l.league}: ${l.rate?.toFixed(1)}%\n`;
        });
      }
    }
    
    Logger.log(`[${FUNC_NAME}] ✅ Analysis complete`);
    Logger.log(report);
    
    if (ui) {
      ui.alert('🎯 SNIPER DIR Performance', report, ui.ButtonSet.OK);
    }
    
  } catch (e) {
    Logger.log(`[${FUNC_NAME}] ❌ ERROR: ${e.message}`);
    if (ui) ui.alert('❌ Error', e.message, ui.ButtonSet.OK);
  }
}

/**
 * Debug SNIPER DIR detection
 * Logs all bets and their type detection results
 */
function debugSniperDirDetection() {
  const FUNC_NAME = 'debugSniperDirDetection';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Logger.log(`[${FUNC_NAME}] ╔══════════════════════════════════════════════════════════════╗`);
  Logger.log(`[${FUNC_NAME}] ║              DEBUG: SNIPER DIR DETECTION                     ║`);
  Logger.log(`[${FUNC_NAME}] ╚══════════════════════════════════════════════════════════════╝`);
  
  const syncSheet = ss.getSheetByName('Sync_Temp');
  if (!syncSheet) {
    Logger.log(`[${FUNC_NAME}] ❌ Sync_Temp not found`);
    return;
  }
  
  const bets = _loadBets(syncSheet);
  
  const dirBets = bets.filter(b => b.isSniperDir);
  const marginBets = bets.filter(b => b.isSniperMargin);
  const ouBets = bets.filter(b => b.isSniperOU);
  
  Logger.log(`[${FUNC_NAME}] ═══════════════════════════════════════════════════════`);
  Logger.log(`[${FUNC_NAME}] DETECTION RESULTS:`);
  Logger.log(`[${FUNC_NAME}]   Total bets: ${bets.length}`);
  Logger.log(`[${FUNC_NAME}]   SNIPER DIR: ${dirBets.length}`);
  Logger.log(`[${FUNC_NAME}]   SNIPER Margin: ${marginBets.length}`);
  Logger.log(`[${FUNC_NAME}]   SNIPER O/U: ${ouBets.length}`);
  Logger.log(`[${FUNC_NAME}] ═══════════════════════════════════════════════════════`);
  
  if (dirBets.length > 0) {
    Logger.log(`[${FUNC_NAME}] SNIPER DIR SAMPLES:`);
    dirBets.slice(0, 5).forEach((b, i) => {
      Logger.log(`[${FUNC_NAME}]   ${i + 1}. Type: "${b.type}" | Pick: "${b.pick}" | Conf: ${(b.confidence * 100).toFixed(0)}%`);
    });
  }
  
  try {
    const ui = SpreadsheetApp.getUi();
    ui.alert('🔍 SNIPER DIR Detection Debug',
      `Total bets: ${bets.length}\n\n` +
      `🎯 SNIPER DIR: ${dirBets.length}\n` +
      `📊 SNIPER Margin: ${marginBets.length}\n` +
      `📈 SNIPER O/U: ${ouBets.length}\n\n` +
      `Check View → Logs for sample details.`,
      ui.ButtonSet.OK);
  } catch (e) {}
}


/**
 * Debug result matching logic
 */
function debugResultMatching() {
  const FUNC_NAME = 'debugResultMatching';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  
  Logger.log(`[${FUNC_NAME}] ═══════════════════════════════════════`);
  Logger.log(`[${FUNC_NAME}] DEBUGGING RESULT MATCHING`);
  
  const resultsMap = _loadResultsTempForGrading(ss);
  const keyCount = Object.keys(resultsMap).length;
  
  let report = `RESULT MATCHING DEBUG\n\n`;
  report += `Total lookup keys: ${keyCount}\n\n`;
  
  // Show sample keys
  const sampleKeys = Object.keys(resultsMap).slice(0, 20);
  report += `Sample keys:\n`;
  sampleKeys.forEach(k => {
    const r = resultsMap[k];
    report += `  ${k} → ${r.isFinished ? 'FT' : 'PENDING'} ${r.homeScore}-${r.awayScore}\n`;
  });
  
  // Check portfolio matches
  const portfolioSheet = ss.getSheetByName('Acca_Portfolio');
  if (portfolioSheet) {
    const pData = portfolioSheet.getDataRange().getValues();
    report += `\nPortfolio matches:\n`;
    
    let checked = 0;
    for (let r = 0; r < pData.length && checked < 10; r++) {
      const matchStr = String(pData[r][3] || '');
      if (!matchStr.toLowerCase().includes(' vs ')) continue;
      
      const { home, away } = _parseMatchString(matchStr);
      if (!home) continue;
      
      const keys = _generateAllMatchKeys(home, away);
      let found = false;
      let foundKey = '';
      
      for (const k of keys) {
        if (resultsMap[k]) {
          found = true;
          foundKey = k;
          break;
        }
      }
      
      report += `  ${matchStr}\n`;
      report += `    Keys: ${keys.slice(0, 2).join(', ')}\n`;
      report += `    Match: ${found ? `YES (${foundKey})` : 'NO'}\n`;
      
      if (found) {
        const res = resultsMap[foundKey];
        report += `    Result: ${res.isFinished ? 'Finished' : 'Pending'} ${res.homeScore}-${res.awayScore}\n`;
      }
      
      checked++;
    }
  }
  
  Logger.log(report);
  
  if (ui) ui.alert('Debug Results', report.substring(0, 2000), ui.ButtonSet.OK);
}

/**
 * Force update Acca_Results from graded portfolio
 */
function forceUpdateAccaResults() {
  const FUNC_NAME = 'forceUpdateAccaResults';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  
  ss.toast('🔄 Force updating Acca_Results...', 'Processing', 10);
  
  try {
    // Load results
    const resultsMap = _loadResultsTempForGrading(ss);
    
    if (Object.keys(resultsMap).length === 0) {
      if (ui) ui.alert('❌ Error', 'No results in Results_Temp. Run "Sync All Results" first.', ui.ButtonSet.OK);
      return;
    }
    
    // Grade portfolio
    const report = _gradePortfolioLegs(ss, resultsMap);
    
    // Sync to Acca_Results
    const count = _syncAccaResultsFromPortfolio(ss);
    
    ss.toast(`✅ Updated ${count} accumulators`, 'Complete', 5);
    
    if (ui) ui.alert('✅ Update Complete', `${report}\n\nUpdated ${count} rows in Acca_Results.`, ui.ButtonSet.OK);
    
  } catch (e) {
    Logger.log(`[${FUNC_NAME}] ❌ Error: ${e.message}`);
    if (ui) ui.alert('❌ Error', e.message, ui.ButtonSet.OK);
  }
}

/**
 * Debug accuracy metrics fetching
 */
function debugAccuracyMetrics() {
  const FUNC_NAME = 'debugAccuracyMetrics';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  
  Logger.log(`[${FUNC_NAME}] ═══════════════════════════════════════`);
  Logger.log(`[${FUNC_NAME}] DEBUGGING ACCURACY METRICS`);
  Logger.log(`[${FUNC_NAME}] ═══════════════════════════════════════`);
  
  const metrics = fetchLeagueAccuracyMetrics();
  
  let report = 'ACCURACY METRICS DEBUG\n\n';
  
  for (const [league, data] of Object.entries(metrics)) {
    report += `${league}:\n`;
    report += `  BANKER: ${data.bankerAccuracy.toFixed(1)}% (Tier1: ${data.hasTier1 ? 'Yes' : 'No'})\n`;
    report += `  SNIPER: ${data.sniperAccuracy.toFixed(1)}% (Tier2: ${data.hasTier2 ? 'Yes' : 'No'})\n`;
    if (data.tier1Source) report += `  Source1: ${data.tier1Source}\n`;
    if (data.tier2Source) report += `  Source2: ${data.tier2Source}\n`;
    report += '\n';
  }
  
  Logger.log(report);
  
  if (ui) ui.alert('Debug Results', report.substring(0, 2000), ui.ButtonSet.OK);
}

/**
 * WHY: Wipe Bet_Performance when changing strategies
 * WHAT: Clears all data and recreates clean structure
 * HOW: Confirmation dialog → Clear → Rebuild headers
 */
function resetBetPerformance() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const confirm = ui.alert(
    '🔄 Reset Bet Performance',
    'This will PERMANENTLY DELETE all bet performance history.\n\n' +
    '• All win/loss records will be erased\n' +
    '• All graded bets will be removed\n' +
    '• Statistics will reset to zero\n\n' +
    'This cannot be undone. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) {
    ss.toast('❌ Reset cancelled', 'Bet Performance', 3);
    return;
  }
  
  try {
    let sheet = ss.getSheetByName('Bet_Performance');
    
    if (!sheet) {
      sheet = ss.insertSheet('Bet_Performance');
      Logger.log('[Reset] Created new Bet_Performance sheet');
    }
    
    // Clear everything
    sheet.clear();
    sheet.clearFormats();
    sheet.clearNotes();
    
    // Rebuild structure - Summary section
    const summaryRows = [
      ['BET PERFORMANCE REPORT', '', '', '', '', '', ''],
      ['Generated: Awaiting first analysis', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['OVERALL', '', 'BANKERS', '', 'SNIPERS', '', ''],
      ['Total Bets', 0, 'Total', 0, 'Total', 0, ''],
      ['Won', 0, 'Won', 0, 'Won', 0, ''],
      ['Lost', 0, 'Lost', 0, 'Lost', 0, ''],
      ['Win Rate', 'N/A', 'Win Rate', 'N/A', 'Win Rate', 'N/A', ''],
      ['', '', '', '', '', '', ''],
      ['League', 'Match', 'Pick', 'Type', 'Grade', 'Score', 'Details']
    ];
    
    sheet.getRange(1, 1, summaryRows.length, 7).setValues(summaryRows);
    
    // Apply formatting
    // Title
    sheet.getRange(1, 1, 1, 7)
      .merge()
      .setFontWeight('bold')
      .setFontSize(16)
      .setBackground('#2d3436')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
    sheet.setRowHeight(1, 40);
    
    // Generated row
    sheet.getRange(2, 1, 1, 7)
      .merge()
      .setFontStyle('italic')
      .setFontColor('#636e72')
      .setHorizontalAlignment('center');
    
    // Section headers
    sheet.getRange(4, 1).setFontWeight('bold').setBackground('#dfe6e9');
    sheet.getRange(4, 3).setFontWeight('bold').setBackground('#d4edda');
    sheet.getRange(4, 5).setFontWeight('bold').setBackground('#fff3cd');
    
    // Data header
    sheet.getRange(10, 1, 1, 7)
      .setFontWeight('bold')
      .setBackground('#74b9ff')
      .setFontColor('#2d3436')
      .setHorizontalAlignment('center');
    
    // Column widths
    sheet.setColumnWidth(1, 80);
    sheet.setColumnWidth(2, 280);
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidth(4, 100);
    sheet.setColumnWidth(5, 90);
    sheet.setColumnWidth(6, 80);
    sheet.setColumnWidth(7, 180);
    
    sheet.setFrozenRows(10);
    
    // Add instructions in row 11
    sheet.getRange(11, 1).setValue('⏳ Run "Analyze Bet Performance" to populate this sheet');
    sheet.getRange(11, 1, 1, 7).merge().setFontStyle('italic').setFontColor('#999999');
    
    ss.toast('✅ Bet Performance reset complete - fresh start ready!', 'Success', 5);
    Logger.log('[Reset] Bet_Performance sheet reset successfully');
    
  } catch (e) {
    Logger.log(`[Reset] ERROR: ${e.message}\n${e.stack}`);
    ui.alert('❌ Reset Error', `Failed to reset:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * WHY: Reset Master_Dashboard when starting fresh
 * WHAT: Clears all KPI values back to zero/initial state
 * HOW: Preserves structure, resets values
 */
function resetMasterDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const confirm = ui.alert(
    '🔄 Reset Master Dashboard',
    'This will reset all dashboard metrics to zero.\n\n' +
    '• Sync counts → 0\n' +
    '• Bet statistics → 0\n' +
    '• Acca results → 0\n' +
    '• Win rates → N/A\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) {
    ss.toast('❌ Reset cancelled', 'Master Dashboard', 3);
    return;
  }
  
  try {
    let sheet = ss.getSheetByName('Master_Dashboard');
    
    if (!sheet) {
      // Recreate from scratch
      sheet = ss.insertSheet('Master_Dashboard');
    }
    
    sheet.clear();
    
    // Rebuild entire dashboard structure
    sheet.getRange('A1:D1').merge()
      .setValue('🏀 MA GOLIDE - HIVE MIND DASHBOARD')
      .setFontWeight('bold')
      .setFontSize(14)
      .setBackground('#674ea7')
      .setFontColor('#ffffff');
    
    const kpiData = [
      ['', ''],
      ['📊 SYNC STATUS', ''],
      ['Total Leagues:', 0],
      ['Active Leagues:', 0],
      ['Last Sync:', 'Never'],
      ['', ''],
      ['📈 BET STATISTICS', ''],
      ['Total Bets Synced:', 0],
      ['Bankers:', 0],
      ['Snipers:', 0],
      ['Total Games:', 0],
      ['Finished Games:', 0],
      ['', ''],
      ['🎰 ACCUMULATOR STATS', ''],
      ['Total Accas Built:', 0],
      ['Accas Won:', 0],
      ['Accas Lost:', 0],
      ['Accas Pending:', 0],
      ['Win Rate:', 'N/A'],
      ['', ''],
      ['💰 PERFORMANCE', ''],
      ['Overall Win Rate:', 'N/A'],
      ['Banker Win Rate:', 'N/A'],
      ['Sniper Win Rate:', 'N/A'],
      ['ROI:', 'N/A']
    ];
    
    sheet.getRange(2, 1, kpiData.length, 2).setValues(kpiData);
    
    // Format section headers
    const sectionRows = [3, 8, 14, 21];
    sectionRows.forEach(row => {
      sheet.getRange(row, 1, 1, 2)
        .setFontWeight('bold')
        .setBackground('#e8e8e8');
    });
    
    // Set column widths
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 120);
    
    ss.toast('✅ Dashboard reset complete!', 'Success', 5);
    Logger.log('[Reset] Master_Dashboard reset successfully');
    
  } catch (e) {
    Logger.log(`[Reset] ERROR: ${e.message}\n${e.stack}`);
    ui.alert('❌ Reset Error', `Failed to reset:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * WHY: Nuclear option - reset EVERYTHING for a completely fresh start
 * WHAT: Resets all output sheets while preserving Config
 */
function resetAllOutputSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const confirm = ui.alert(
    '⚠️ FULL RESET - All Output Sheets',
    'This will reset:\n\n' +
    '• Sync_Temp (synced bets)\n' +
    '• Results_Temp (synced results)\n' +
    '• Acca_Portfolio (accumulators)\n' +
    '• Acca_Results (acca tracking)\n' +
    '• Bet_Performance (performance history)\n' +
    '• Master_Dashboard (all KPIs)\n\n' +
    '⚠️ Config sheet will be PRESERVED.\n\n' +
    'This is a COMPLETE FRESH START. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) {
    ss.toast('❌ Full reset cancelled', 'Reset', 3);
    return;
  }
  
  try {
    ss.toast('🔄 Resetting all sheets...', 'Full Reset', 10);
    
    // Reset Sync_Temp
    let syncSheet = ss.getSheetByName('Sync_Temp');
    if (syncSheet) {
      syncSheet.clear();
      const canonicalHeaders = ['League', 'Date', 'Time', 'Match', 'Pick', 'Type', 'Odds', 'Confidence', 'EV'];
      syncSheet.getRange(1, 1, 1, canonicalHeaders.length).setValues([canonicalHeaders])
        .setFontWeight('bold')
        .setBackground('#ff9900')
        .setFontColor('#ffffff');
      syncSheet.getRange('A2').setValue('⏳ Run "Sync All Leagues" to populate');
      syncSheet.getRange('A2:I2').merge().setFontStyle('italic').setFontColor('#999999');
    }
    
    // Reset Results_Temp
    let resultsSheet = ss.getSheetByName('Results_Temp');
    if (resultsSheet) {
      resultsSheet.clear();
      const resultsHeaders = ['League', 'Game Type', 'Home', 'Away', 'Date', 'Time', 'Prob %', 'Pred', 'Pred Score', 'Avg', 'Odds', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', 'Status', 'FT Score'];
      resultsSheet.getRange(1, 1, 1, resultsHeaders.length).setValues([resultsHeaders])
        .setFontWeight('bold')
        .setBackground('#38761d')
        .setFontColor('#ffffff');
    }
    
    // Reset Acca_Portfolio
    let accaSheet = ss.getSheetByName('Acca_Portfolio');
    if (accaSheet) {
      accaSheet.clear();
      accaSheet.getRange('A1:J1').merge()
        .setValue('🎰 MA GOLIDE - ACCUMULATOR PORTFOLIO')
        .setFontWeight('bold')
        .setFontSize(14)
        .setBackground('#4a86e8')
        .setFontColor('#ffffff');
      accaSheet.getRange('A3').setValue('⏳ Run "Build Portfolio" to create accumulators');
      accaSheet.getRange('A3:J3').merge().setFontStyle('italic').setFontColor('#999999');
    }
    
    // Reset Acca_Results
    let accaResultsSheet = ss.getSheetByName('Acca_Results');
    if (accaResultsSheet) {
      accaResultsSheet.clear();
      const headers = ['Acca ID', 'Type', 'Legs', 'Total Odds', 'Avg Conf%', 'Created', 'Window Start', 'Window End', 'Status', 'Legs Won', 'Legs Lost', 'Legs Pending', 'Result'];
      accaResultsSheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setFontWeight('bold')
        .setBackground('#38761d')
        .setFontColor('#ffffff');
    }
    
    // Use the dedicated reset functions for complex sheets
    // Suppress their confirmation dialogs by directly doing the work
    _resetBetPerformanceSilent(ss);
    _resetDashboardSilent(ss);
    
    ss.toast('✅ All output sheets reset! Ready for fresh start.', 'Success', 5);
    
    ui.alert('✅ Full Reset Complete',
      'All output sheets have been reset.\n\n' +
      'Your Config sheet with satellite URLs is preserved.\n\n' +
      'Next steps:\n' +
      '1. Run "Sync Everything" to pull fresh data\n' +
      '2. Run "Build Portfolio" to create new accumulators\n' +
      '3. Run "Analyze Bet Performance" after games finish',
      ui.ButtonSet.OK);
    
  } catch (e) {
    Logger.log(`[Reset] ERROR: ${e.message}\n${e.stack}`);
    ui.alert('❌ Reset Error', e.message, ui.ButtonSet.OK);
  }
}

// Silent helpers (no confirmation dialogs)
function _resetBetPerformanceSilent(ss) {
  let sheet = ss.getSheetByName('Bet_Performance');
  if (!sheet) sheet = ss.insertSheet('Bet_Performance');
  sheet.clear();
  
  const summaryRows = [
    ['BET PERFORMANCE REPORT', '', '', '', '', '', ''],
    ['Generated: Awaiting first analysis', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['OVERALL', '', 'BANKERS', '', 'SNIPERS', '', ''],
    ['Total Bets', 0, 'Total', 0, 'Total', 0, ''],
    ['Won', 0, 'Won', 0, 'Won', 0, ''],
    ['Lost', 0, 'Lost', 0, 'Lost', 0, ''],
    ['Win Rate', 'N/A', 'Win Rate', 'N/A', 'Win Rate', 'N/A', ''],
    ['', '', '', '', '', '', ''],
    ['League', 'Match', 'Pick', 'Type', 'Grade', 'Score', 'Details']
  ];
  sheet.getRange(1, 1, summaryRows.length, 7).setValues(summaryRows);
  sheet.getRange(1, 1, 1, 7).merge().setFontWeight('bold').setFontSize(16).setBackground('#2d3436').setFontColor('#ffffff');
  sheet.getRange(10, 1, 1, 7).setFontWeight('bold').setBackground('#74b9ff');
}

function _resetDashboardSilent(ss) {
  let sheet = ss.getSheetByName('Master_Dashboard');
  if (!sheet) sheet = ss.insertSheet('Master_Dashboard');
  sheet.clear();
  
  sheet.getRange('A1:D1').merge()
    .setValue('🏀 MA GOLIDE - HIVE MIND DASHBOARD')
    .setFontWeight('bold').setFontSize(14).setBackground('#674ea7').setFontColor('#ffffff');
  
  const kpiData = [
    ['', ''], ['📊 SYNC STATUS', ''], ['Total Leagues:', 0], ['Active Leagues:', 0], ['Last Sync:', 'Never'],
    ['', ''], ['📈 BET STATISTICS', ''], ['Total Bets Synced:', 0], ['Bankers:', 0], ['Snipers:', 0],
    ['', ''], ['🎰 ACCUMULATOR STATS', ''], ['Total Accas Built:', 0], ['Accas Won:', 0], ['Accas Lost:', 0],
    ['Accas Pending:', 0], ['Win Rate:', 'N/A'], ['', ''], ['💰 PERFORMANCE', ''], ['ROI:', 'N/A']
  ];
  sheet.getRange(2, 1, kpiData.length, 2).setValues(kpiData);
}



/**
 * WHY: Reset Master_Dashboard when starting fresh
 * FIX: Template includes "Risky Bets:" row and "PERFORMANCE" anchor label
 */
function resetMasterDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    'Reset Master Dashboard',
    'This will reset all dashboard metrics to zero.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  try {
    var sheet = ss.getSheetByName('Master_Dashboard');
    if (!sheet) sheet = ss.insertSheet('Master_Dashboard');
    sheet.clear();

    sheet.getRange('A1:D1').merge()
      .setValue('MA GOLIDE - HIVE MIND DASHBOARD')
      .setFontWeight('bold')
      .setFontSize(14)
      .setBackground('#674ea7')
      .setFontColor('#ffffff');

    var kpiData = [
      ['', ''],
      ['SYNC STATUS', ''],
      ['Total Leagues:', 0],
      ['Active Leagues:', 0],
      ['Last Sync:', 'Never'],
      ['', ''],
      ['BET STATISTICS', ''],
      ['Total Bets Synced:', 0],
      ['Bankers:', 0],
      ['Snipers:', 0],
      ['Risky Bets:', 0],
      ['Total Games:', 0],
      ['Finished Games:', 0],
      ['', ''],
      ['ACCUMULATOR STATS', ''],
      ['Total Accas Built:', 0],
      ['Accas Won:', 0],
      ['Accas Lost:', 0],
      ['Accas Pending:', 0],
      ['Win Rate:', 'N/A'],
      ['', ''],
      ['PERFORMANCE', '']
    ];

    sheet.getRange(2, 1, kpiData.length, 2).setValues(kpiData);

    var sectionRows = [3, 8, 16, 23];
    sectionRows.forEach(function(r) {
      try { sheet.getRange(r, 1, 1, 2).setFontWeight('bold').setBackground('#e8e8e8'); } catch (e) {}
    });

    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 140);

    ss.toast('Dashboard reset complete!', 'Success', 5);
  } catch (e) {
    ui.alert('Reset Error', 'Failed to reset:\n\n' + e.message, ui.ButtonSet.OK);
  }
}



function _resetDashboardSilent(ss) {
  var sheet = ss.getSheetByName('Master_Dashboard');
  if (!sheet) sheet = ss.insertSheet('Master_Dashboard');
  sheet.clear();

  sheet.getRange('A1:D1').merge()
    .setValue('MA GOLIDE - HIVE MIND DASHBOARD')
    .setFontWeight('bold').setFontSize(14).setBackground('#674ea7').setFontColor('#ffffff');

  var kpiData = [
    ['', ''],
    ['SYNC STATUS', ''],
    ['Total Leagues:', 0],
    ['Active Leagues:', 0],
    ['Last Sync:', 'Never'],
    ['', ''],
    ['BET STATISTICS', ''],
    ['Total Bets Synced:', 0],
    ['Bankers:', 0],
    ['Snipers:', 0],
    ['Risky Bets:', 0],
    ['Total Games:', 0],
    ['Finished Games:', 0],
    ['', ''],
    ['ACCUMULATOR STATS', ''],
    ['Total Accas Built:', 0],
    ['Accas Won:', 0],
    ['Accas Lost:', 0],
    ['Accas Pending:', 0],
    ['Win Rate:', 'N/A'],
    ['', ''],
    ['PERFORMANCE', '']
  ];

  sheet.getRange(2, 1, kpiData.length, 2).setValues(kpiData);
}

// ============================================================================
// PHASE 3 PATCH 5 + 5B: CONFIG HARDENING - MOTHERSHIP INTEGRATION
// ============================================================================

/**
 * ConfigManager_Mothership - Mothership configuration management
 * Integrates with Satellite Config Managers for centralized control
 */
const ConfigManager_Mothership = {
  
  // --------------------------------------------------------------------------
  // loadMothershipConfig - Load Mothership configuration from satellite configs
  // --------------------------------------------------------------------------
  loadMothershipConfig() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const config = {
      version: "MOTHERSHIP-3.0",
      lastUpdated: new Date().toISOString(),
      satellites: [],
      globalSettings: {}
    };
    
    // Load satellite registry
    try {
      const registrySheet = ss.getSheetByName("Satellite_Registry");
      if (registrySheet) {
        const registryData = registrySheet.getDataRange().getValues();
        for (let i = 1; i < registryData.length; i++) {
          const row = registryData[i];
          if (row[1]) { // URL in column B
            const satellite = {
              id: row[0] || 'SAT_' + i,
              url: row[1],
              name: row[2] || 'Unknown Satellite',
              status: row[3] || 'UNKNOWN',
              lastSync: row[4] || null,
              configVersion: row[5] || null
            };
            config.satellites.push(satellite);
          }
        }
      }
    } catch (err) {
      Logger.log('[ConfigManager_Mothership] Registry load failed: ' + err.message);
    }
    
    // Load global settings from Config sheet
    try {
      const configSheet = ss.getSheetByName("Config");
      if (configSheet) {
        const configData = configSheet.getDataRange().getValues();
        for (let i = 1; i < configData.length; i++) {
          const row = configData[i];
          if (row[0]) { // setting_key
            config.globalSettings[String(row[0]).trim()] = this.parseConfigValue(row[1]);
          }
        }
      }
    } catch (err) {
      Logger.log('[ConfigManager_Mothership] Config load failed: ' + err.message);
    }
    
    return config;
  },
  
  // --------------------------------------------------------------------------
  // parseConfigValue - Parse configuration value (same as Assayer)
  // --------------------------------------------------------------------------
  parseConfigValue(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    
    const str = String(value).trim();
    
    // Boolean values
    if (str.toLowerCase() === "true") return true;
    if (str.toLowerCase() === "false") return false;
    
    // JSON values
    if (str.startsWith("[") || str.startsWith("{")) {
      try {
        return JSON.parse(str);
      } catch (e) {
        Logger.log('[ConfigManager_Mothership] Failed to parse JSON value: ' + str);
        return str;
      }
    }
    
    // Numeric values
    const num = parseFloat(str);
    if (!isNaN(num)) {
      return num;
    }
    
    // String values
    return str;
  },
  
  // --------------------------------------------------------------------------
  // validateMothershipConfig - Validate Mothership configuration
  // --------------------------------------------------------------------------
  validateMothershipConfig(config) {
    try {
      // Check required fields
      if (!config.version || !config.satellites) {
        Logger.log('[ConfigManager_Mothership] Missing required fields');
        return false;
      }
      
      // Validate satellite URLs
      for (const satellite of config.satellites) {
        if (!satellite.url || !satellite.url.startsWith('https://docs.google.com/spreadsheets/')) {
          Logger.log('[ConfigManager_Mothership] Invalid satellite URL: ' + satellite.url);
          return false;
        }
      }
      
      return true;
    } catch (err) {
      Logger.log('[ConfigManager_Mothership] Config validation failed: ' + err.message);
      return false;
    }
  }
};

/**
 * validateConfigState_ - Mothership wrapper for config validation
 * @param {Object} config - Configuration object
 * @param {string} tier - Configuration tier
 * @returns {boolean} True if valid
 */
function validateConfigState_(config, tier) {
  if (typeof ConfigManager_Mothership !== 'undefined') {
    return ConfigManager_Mothership.validateMothershipConfig(config);
  }
  
  // Fallback validation
  return config && config.version && config.satellites;
}

/**
 * runGenesis - Enhanced genesis with Phase 3 config hardening
 * Creates Satellite_Registry sheet and initializes config management
 */
function runGenesis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Create Satellite_Registry sheet
    _createSatelliteRegistrySheet(ss);
    
    // Initialize configuration management
    const config = ConfigManager_Mothership.loadMothershipConfig();
    
    // Validate configuration
    if (ConfigManager_Mothership.validateMothershipConfig(config)) {
      ui.alert(
        'Genesis Complete',
        'Mothership initialized with:\n\n' +
        ' Satellite_Registry sheet created\n' +
        ' Configuration management enabled\n' +
        ' ' + config.satellites.length + ' satellites registered\n\n' +
        'You can now paste satellite URLs in column B of Satellite_Registry.',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        'Genesis Warning',
        'Mothership initialized but configuration validation failed.\n' +
        'Please check the Satellite_Registry sheet.',
        ui.ButtonSet.OK
      );
    }
    
  } catch (err) {
    ui.alert(
      'Genesis Error',
      'Failed to initialize Mothership:\n\n' + err.message,
      ui.ButtonSet.OK
    );
  }
}

/**
 * _createSatelliteRegistrySheet - Create safe Satellite_Registry sheet
 * @param {Spreadsheet} ss - Spreadsheet object
 */
function _createSatelliteRegistrySheet(ss) {
  let sheet = ss.getSheetByName("Satellite_Registry");
  if (!sheet) {
    sheet = ss.insertSheet("Satellite_Registry");
  }
  
  // Clear existing content
  sheet.clear();
  
  // Create headers
  const headers = [
    "satellite_id",
    "spreadsheet_url", 
    "satellite_name",
    "status",
    "last_sync",
    "config_version",
    "notes"
  ];
  
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#1a1a2e")
    .setFontColor("#FFD700");
  
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // satellite_id
  sheet.setColumnWidth(2, 400);  // spreadsheet_url (main column for pasting URLs)
  sheet.setColumnWidth(3, 150);  // satellite_name
  sheet.setColumnWidth(4, 100);  // status
  sheet.setColumnWidth(5, 150);  // last_sync
  sheet.setColumnWidth(6, 120);  // config_version
  sheet.setColumnWidth(7, 200);  // notes
  
  // Add sample data
  const sampleData = [
    ["SAT_001", "https://docs.google.com/spreadsheets/d/...", "Sample Satellite 1", "UNKNOWN", null, null, "Paste satellite URL in column B"],
    ["SAT_002", "https://docs.google.com/spreadsheets/d/...", "Sample Satellite 2", "UNKNOWN", null, null, "Replace with actual satellite URLs"]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  // Add instructions
  sheet.getRange(sampleData.length + 3, 1, 3, 2)
    .merge()
    .setValue("INSTRUCTIONS: Paste satellite spreadsheet URLs in column B. The system will automatically sync configuration from these satellites.")
    .setFontWeight("bold")
    .setBackground("#e8f5e8")
    .setWrap(true);
  
  Logger.log('[_createSatelliteRegistrySheet] Satellite_Registry sheet created');
}

// ============================================================================
// PHASE 4 PATCH 4: METADATA - COMPLETE SATELLITE REGISTRY MODULE
// ============================================================================

/**
 * SatelliteRegistry_ - Complete module for managing satellite spreadsheet URLs
 * Safe place to manage all satellite links - just paste URLs in column B
 */
const SatelliteRegistry_ = {
  
  // --------------------------------------------------------------------------
  // CONFIGURATION
  // --------------------------------------------------------------------------
  config: {
    sheetName: "Satellite_Registry",
    version: "1.0",
    columns: {
      id: 1,           // satellite_id
      url: 2,          // spreadsheet_url (main column for pasting)
      name: 3,         // satellite_name
      status: 4,       // status
      lastSync: 5,     // last_sync
      configVersion: 6, // config_version
      notes: 7         // notes
    },
    statuses: ["ACTIVE", "INACTIVE", "UNKNOWN", "ERROR"],
    defaultStatus: "UNKNOWN"
  },
  
  // --------------------------------------------------------------------------
  // getOrCreateSheet - Get or create the Satellite_Registry sheet
  // @param {Spreadsheet} ss - Spreadsheet object
  // @returns {Sheet} Satellite_Registry sheet
  // --------------------------------------------------------------------------
  getOrCreateSheet(ss) {
    let sheet = ss.getSheetByName(this.config.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(this.config.sheetName);
      this.initializeSheet(sheet);
      Logger.log('[SatelliteRegistry_] Created new Satellite_Registry sheet');
    }
    return sheet;
  },
  
  // --------------------------------------------------------------------------
  // initializeSheet - Initialize sheet with headers and formatting
  // @param {Sheet} sheet - Sheet to initialize
  // --------------------------------------------------------------------------
  initializeSheet(sheet) {
    // Clear existing content
    sheet.clear();
    
    // Create headers
    const headers = [
      "satellite_id",
      "spreadsheet_url", 
      "satellite_name",
      "status",
      "last_sync",
      "config_version",
      "notes"
    ];
    
    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight("bold")
      .setBackground("#1a1a2e")
      .setFontColor("#FFD700");
    
    sheet.setFrozenRows(1);
    
    // Set column widths
    sheet.setColumnWidth(this.config.columns.id, 120);      // satellite_id
    sheet.setColumnWidth(this.config.columns.url, 400);     // spreadsheet_url (main column)
    sheet.setColumnWidth(this.config.columns.name, 150);    // satellite_name
    sheet.setColumnWidth(this.config.columns.status, 100);  // status
    sheet.setColumnWidth(this.config.columns.lastSync, 150); // last_sync
    sheet.setColumnWidth(this.config.columns.configVersion, 120); // config_version
    sheet.setColumnWidth(this.config.columns.notes, 200);   // notes
    
    // Add instructions
    this.addInstructions(sheet);
    
    // Add sample data
    this.addSampleData(sheet);
  },
  
  // --------------------------------------------------------------------------
  // addInstructions - Add user-friendly instructions
  // @param {Sheet} sheet - Sheet to add instructions to
  // --------------------------------------------------------------------------
  addInstructions(sheet) {
    const instructions = [
      "INSTRUCTIONS: Safe place to manage all satellite links - just paste URLs in column B.",
      "",
      "HOW TO USE:",
      "1. Copy satellite spreadsheet URL from browser",
      "2. Paste in column B (spreadsheet_url)", 
      "3. System auto-detects satellite name and status",
      "4. Use 'Sync All' to update all satellites",
      "",
      "TIPS:",
      "- URLs must start with: https://docs.google.com/spreadsheets/",
      "- Column A auto-generates unique satellite IDs",
      "- Column C extracts satellite name from URL",
      "- Column D shows connection status"
    ];
    
    const startRow = sheet.getLastRow() + 2;
    sheet.getRange(startRow, 1, instructions.length, 2)
      .setValues(instructions.map(inst => [inst, ""]))
      .setFontWeight("bold")
      .setBackground("#e8f5e8")
      .setWrap(true);
    
    // Merge the first instruction row
    sheet.getRange(startRow, 1, 1, 2).merge();
  },
  
  // --------------------------------------------------------------------------
  // addSampleData - Add sample satellite data
  // @param {Sheet} sheet - Sheet to add sample data to
  // --------------------------------------------------------------------------
  addSampleData(sheet) {
    const sampleData = [
      ["SAT_001", "https://docs.google.com/spreadsheets/d/1ABC...", "Sample Satellite 1", "UNKNOWN", null, null, "Replace with actual satellite URL"],
      ["SAT_002", "https://docs.google.com/spreadsheets/d/2DEF...", "Sample Satellite 2", "UNKNOWN", null, null, "Paste satellite URL in column B"]
    ];
    
    // Find first empty row after instructions
    let startRow = sheet.getLastRow() + 2;
    while (startRow > 100) startRow = 10; // Safety check
    
    sheet.getRange(startRow, 1, sampleData.length, this.config.columns.notes)
      .setValues(sampleData);
  },
  
  // --------------------------------------------------------------------------
  // loadAll - Load all satellite registry entries
  // @param {Spreadsheet} ss - Spreadsheet object
  // @returns {Array} Array of satellite objects
  // --------------------------------------------------------------------------
  loadAll(ss) {
    const sheet = this.getOrCreateSheet(ss);
    const data = sheet.getDataRange().getValues();
    const satellites = [];
    
    // Skip header row and instructions
    let dataStartRow = 1;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[this.config.columns.url - 1] && 
          String(row[this.config.columns.url - 1]).startsWith("https://docs.google.com/")) {
        dataStartRow = i;
        break;
      }
    }
    
    // Parse satellite data
    for (let i = dataStartRow; i < data.length; i++) {
      const row = data[i];
      if (!row[this.config.columns.url - 1]) continue; // Skip empty rows
      
      const satellite = {
        id: String(row[this.config.columns.id - 1] || this.generateId()),
        url: String(row[this.config.columns.url - 1]).trim(),
        name: String(row[this.config.columns.name - 1] || this.extractNameFromUrl(row[this.config.columns.url - 1])),
        status: String(row[this.config.columns.status - 1] || this.config.defaultStatus),
        lastSync: row[this.config.columns.lastSync - 1] || null,
        configVersion: row[this.config.columns.configVersion - 1] || null,
        notes: String(row[this.config.columns.notes - 1] || ""),
        rowIndex: i + 1 // 1-based row index
      };
      
      // Validate satellite
      if (this.validateSatellite(satellite)) {
        satellites.push(satellite);
      }
    }
    
    Logger.log('[SatelliteRegistry_] Loaded ' + satellites.length + ' satellites');
    return satellites;
  },
  
  // --------------------------------------------------------------------------
  // addSatellite - Add a new satellite to the registry
  // @param {Spreadsheet} ss - Spreadsheet object
  // @param {string} url - Satellite spreadsheet URL
  // @param {string} name - Optional satellite name
  // @param {string} notes - Optional notes
  // @returns {Object} Result object
  // --------------------------------------------------------------------------
  addSatellite(ss, url, name, notes) {
    if (!url || !url.startsWith("https://docs.google.com/spreadsheets/")) {
      return { success: false, error: "Invalid satellite URL" };
    }
    
    const sheet = this.getOrCreateSheet(ss);
    const satellites = this.loadAll(ss);
    
    // Check for duplicate URLs
    const existing = satellites.find(sat => sat.url === url);
    if (existing) {
      return { success: false, error: "Satellite URL already exists", existingId: existing.id };
    }
    
    // Create new satellite entry
    const newSatellite = {
      id: this.generateId(),
      url: url,
      name: name || this.extractNameFromUrl(url),
      status: this.config.defaultStatus,
      lastSync: null,
      configVersion: null,
      notes: notes || ""
    };
    
    // Add to sheet
    const newRow = [
      newSatellite.id,
      newSatellite.url,
      newSatellite.name,
      newSatellite.status,
      newSatellite.lastSync,
      newSatellite.configVersion,
      newSatellite.notes
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log('[SatelliteRegistry_] Added satellite: ' + newSatellite.id);
    return { success: true, satellite: newSatellite };
  },
  
  // --------------------------------------------------------------------------
  // updateStatus - Update satellite status
  // @param {Spreadsheet} ss - Spreadsheet object
  // @param {string} satelliteId - Satellite ID
  // @param {string} status - New status
  // @param {Object} metadata - Additional metadata (lastSync, configVersion, etc.)
  // @returns {Object} Result object
  // --------------------------------------------------------------------------
  updateStatus(ss, satelliteId, status, metadata = {}) {
    const sheet = this.getOrCreateSheet(ss);
    const satellites = this.loadAll(ss);
    
    const satellite = satellites.find(sat => sat.id === satelliteId);
    if (!satellite) {
      return { success: false, error: "Satellite not found" };
    }
    
    // Validate status
    if (!this.config.statuses.includes(status)) {
      return { success: false, error: "Invalid status: " + status };
    }
    
    // Update satellite
    const updatedSatellite = {
      ...satellite,
      status: status,
      lastSync: metadata.lastSync || satellite.lastSync,
      configVersion: metadata.configVersion || satellite.configVersion,
      notes: metadata.notes || satellite.notes
    };
    
    // Update sheet
    const updateRow = [
      updatedSatellite.id,
      updatedSatellite.url,
      updatedSatellite.name,
      updatedSatellite.status,
      updatedSatellite.lastSync,
      updatedSatellite.configVersion,
      updatedSatellite.notes
    ];
    
    sheet.getRange(updatedSatellite.rowIndex, 1, 1, updateRow.length).setValues([updateRow]);
    
    Logger.log('[SatelliteRegistry_] Updated satellite status: ' + satelliteId + ' -> ' + status);
    return { success: true, satellite: updatedSatellite };
  },
  
  // --------------------------------------------------------------------------
  // removeSatellite - Remove a satellite from the registry
  // @param {Spreadsheet} ss - Spreadsheet object
  // @param {string} satelliteId - Satellite ID
  // @returns {Object} Result object
  // --------------------------------------------------------------------------
  removeSatellite(ss, satelliteId) {
    const sheet = this.getOrCreateSheet(ss);
    const satellites = this.loadAll(ss);
    
    const satelliteIndex = satellites.findIndex(sat => sat.id === satelliteId);
    if (satelliteIndex === -1) {
      return { success: false, error: "Satellite not found" };
    }
    
    const satellite = satellites[satelliteIndex];
    
    // Delete row
    sheet.deleteRow(satellite.rowIndex);
    
    Logger.log('[SatelliteRegistry_] Removed satellite: ' + satelliteId);
    return { success: true, removedSatellite: satellite };
  },
  
  // --------------------------------------------------------------------------
  // syncAll - Sync all satellites (placeholder for actual sync logic)
  // @param {Spreadsheet} ss - Spreadsheet object
  // @returns {Array} Array of sync results
  // --------------------------------------------------------------------------
  syncAll(ss) {
    const satellites = this.loadAll(ss);
    const results = [];
    
    satellites.forEach(satellite => {
      try {
        // This would contain the actual sync logic
        // For now, just update the status
        const result = {
          satelliteId: satellite.id,
          success: true,
          status: "ACTIVE",
          lastSync: new Date().toISOString(),
          configVersion: "SYNCED_" + Date.now()
        };
        
        this.updateStatus(ss, satellite.id, result.status, {
          lastSync: result.lastSync,
          configVersion: result.configVersion
        });
        
        results.push(result);
      } catch (err) {
        const errorResult = {
          satelliteId: satellite.id,
          success: false,
          error: err.message,
          status: "ERROR"
        };
        
        this.updateStatus(ss, satellite.id, errorResult.status, {
          notes: "Sync failed: " + err.message
        });
        
        results.push(errorResult);
      }
    });
    
    Logger.log('[SatelliteRegistry_] Synced ' + results.length + ' satellites');
    return results;
  },
  
  // --------------------------------------------------------------------------
  // validateSatellite - Validate satellite object
  // @param {Object} satellite - Satellite object
  // @returns {boolean} True if valid
  // --------------------------------------------------------------------------
  validateSatellite(satellite) {
    if (!satellite.url || !satellite.url.startsWith("https://docs.google.com/spreadsheets/")) {
      return false;
    }
    
    if (!satellite.id || satellite.id.trim() === "") {
      return false;
    }
    
    return true;
  },
  
  // --------------------------------------------------------------------------
  // generateId - Generate a unique satellite ID
  // @returns {string} Unique satellite ID
  // --------------------------------------------------------------------------
  generateId() {
    return "SAT_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5).toUpperCase();
  },
  
  // --------------------------------------------------------------------------
  // extractNameFromUrl - Extract satellite name from Google Sheets URL
  // @param {string} url - Google Sheets URL
  // @returns {string} Extracted name
  // --------------------------------------------------------------------------
  extractNameFromUrl(url) {
    try {
      // Extract from URL path or use default
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Try to find a meaningful name from the path
      for (const part of pathParts) {
        if (part && part.length > 3 && part !== 'spreadsheets' && part !== 'd') {
          return part.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      }
      
      // Fallback to domain-based naming
      return "Satellite " + urlObj.hostname.replace('docs.google.com', 'Google Sheets');
    } catch (err) {
      return "Unknown Satellite";
    }
  },
  
  // --------------------------------------------------------------------------
  // getRegistryStats - Get registry statistics
  // @param {Spreadsheet} ss - Spreadsheet object
  // @returns {Object} Statistics object
  // --------------------------------------------------------------------------
  getRegistryStats(ss) {
    const satellites = this.loadAll(ss);
    
    const stats = {
      total: satellites.length,
      active: satellites.filter(s => s.status === "ACTIVE").length,
      inactive: satellites.filter(s => s.status === "INACTIVE").length,
      unknown: satellites.filter(s => s.status === "UNKNOWN").length,
      error: satellites.filter(s => s.status === "ERROR").length,
      lastUpdated: new Date().toISOString()
    };
    
    return stats;
  }
};

/**
 * _createConfigLedgerSheet - Create Config_Ledger sheet with dominant_stamp and stamp_purity
 */
function _createConfigLedgerSheet(ss) {
  let sheet = ss.getSheetByName('Config_Ledger');
  if (!sheet) {
    sheet = ss.insertSheet('Config_Ledger');
  }
  sheet.clear();

  const headers = [['config_key', 'config_value', 'description', 'last_updated', 'dominant_stamp', 'stamp_purity']];
  sheet.getRange('A1:F1').setValues(headers)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  // Add default config rows
  sheet.getRange('A2:F2').setValues([[
    'system_initialized',
    'true',
    'System initialization timestamp',
    new Date().toISOString(),
    new Date().toISOString(),
    '1.0'
  ]]);

  sheet.autoResizeColumns(1, 6);
  Logger.log('[Genesis] Config_Ledger sheet created');
}

/**
 * _createVaultSheets - Create Vault and MA_Vault sheets
 */
function _createVaultSheets(ss) {
  // Create Vault sheet
  let vaultSheet = ss.getSheetByName('Vault');
  if (!vaultSheet) {
    vaultSheet = ss.insertSheet('Vault');
  }
  vaultSheet.clear();

  const vaultHeaders = [['vault_id', 'league', 'team', 'opponent', 'bet_type', 'confidence', 'grade', 'purity', 'timestamp']];
  vaultSheet.getRange('A1:I1').setValues(vaultHeaders)
    .setFontWeight('bold')
    .setBackground('#6a1b9a')
    .setFontColor('#ffffff');

  // Create MA_Vault sheet
  let maVaultSheet = ss.getSheetByName('MA_Vault');
  if (!maVaultSheet) {
    maVaultSheet = ss.insertSheet('MA_Vault');
  }
  maVaultSheet.clear();

  const maVaultHeaders = [['vault_id', 'league', 'team', 'opponent', 'bet_type', 'confidence', 'grade', 'purity', 'timestamp', 'dominant_stamp']];
  maVaultSheet.getRange('A1:J1').setValues(maVaultHeaders)
    .setFontWeight('bold')
    .setBackground('#6a1b9a')
    .setFontColor('#ffffff');

  Logger.log('[Genesis] Vault sheets created');
}

/**
 * _createAnalysisSheets - Create Analysis_Tier1 and other analysis sheets
 */
function _createAnalysisSheets(ss) {
  // Create Analysis_Tier1
  let analysisSheet = ss.getSheetByName('Analysis_Tier1');
  if (!analysisSheet) {
    analysisSheet = ss.insertSheet('Analysis_Tier1');
  }
  analysisSheet.clear();

  const analysisHeaders = [['analysis_id', 'league', 'team', 'opponent', 'bet_type', 'confidence', 'grade', 'purity', 'timestamp']];
  analysisSheet.getRange('A1:I1').setValues(analysisHeaders)
    .setFontWeight('bold')
    .setBackground('#ff9900')
    .setFontColor('#ffffff');

  // Create MA_Discovery
  let discoverySheet = ss.getSheetByName('MA_Discovery');
  if (!discoverySheet) {
    discoverySheet = ss.insertSheet('MA_Discovery');
  }
  discoverySheet.clear();

  const discoveryHeaders = [['discovery_id', 'league', 'team', 'opponent', 'edge_type', 'edge_value', 'confidence', 'timestamp']];
  discoverySheet.getRange('A1:G1').setValues(discoveryHeaders)
    .setFontWeight('bold')
    .setBackground('#ff9900')
    .setFontColor('#ffffff');

  Logger.log('[Genesis] Analysis sheets created');
}

/**
 * _createPerformanceSheets - Create performance tracking sheets
 */
function _createPerformanceSheets(ss) {
  // Create League_Performance
  let leaguePerfSheet = ss.getSheetByName('League_Performance');
  if (!leaguePerfSheet) {
    leaguePerfSheet = ss.insertSheet('League_Performance');
  }
  leaguePerfSheet.clear();

  const leaguePerfHeaders = [['league', 'total_bets', 'wins', 'losses', 'win_rate', 'avg_odds', 'last_updated']];
  leaguePerfSheet.getRange('A1:G1').setValues(leaguePerfHeaders)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  // Create Bet_Performance
  let betPerfSheet = ss.getSheetByName('Bet_Performance');
  if (!betPerfSheet) {
    betPerfSheet = ss.insertSheet('Bet_Performance');
  }
  betPerfSheet.clear();

  const betPerfHeaders = [['bet_id', 'league', 'team', 'opponent', 'bet_type', 'result', 'payout', 'timestamp']];
  betPerfSheet.getRange('A1:H1').setValues(betPerfHeaders)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  Logger.log('[Genesis] Performance sheets created');
}

/**
 * _createRiskySheets - Create risky accumulator analysis sheets
 */
function _createRiskySheets(ss) {
  // Create Risky_Bets_Analysis
  let riskySheet = ss.getSheetByName('Risky_Bets_Analysis');
  if (!riskySheet) {
    riskySheet = ss.insertSheet('Risky_Bets_Analysis');
  }
  riskySheet.clear();

  const riskyHeaders = [['bet_id', 'league', 'team', 'opponent', 'risk_level', 'confidence', 'recommendation', 'timestamp']];
  riskySheet.getRange('A1:G1').setValues(riskyHeaders)
    .setFontWeight('bold')
    .setBackground('#ff6b6b')
    .setFontColor('#ffffff');

  // Create Risky_Accas
  let riskyAccaSheet = ss.getSheetByName('Risky_Accas');
  if (!riskyAccaSheet) {
    riskyAccaSheet = ss.insertSheet('Risky_Accas');
  }
  riskyAccaSheet.clear();

  const riskyAccaHeaders = [['acca_id', 'total_bets', 'risk_score', 'expected_value', 'recommendation', 'timestamp']];
  riskyAccaSheet.getRange('A1:F1').setValues(riskyAccaHeaders)
    .setFontWeight('bold')
    .setBackground('#ff6b6b')
    .setFontColor('#ffffff');

  Logger.log('[Genesis] Risky analysis sheets created');
}

/**
 * _createHistoricalSheets - Create historical tracking sheets
 */
function _createHistoricalSheets(ss) {
  // Create Historical_Results_Archive
  let histResultsSheet = ss.getSheetByName('Historical_Results_Archive');
  if (!histResultsSheet) {
    histResultsSheet = ss.insertSheet('Historical_Results_Archive');
  }
  histResultsSheet.clear();

  const histResultsHeaders = [['result_id', 'event_date', 'league', 'team', 'opponent', 'result', 'payout', 'timestamp']];
  histResultsSheet.getRange('A1:H1').setValues(histResultsHeaders)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  // Create Historical_Performance_Log
  let histPerfSheet = ss.getSheetByName('Historical_Performance_Log');
  if (!histPerfSheet) {
    histPerfSheet = ss.insertSheet('Historical_Performance_Log');
  }
  histPerfSheet.clear();

  const histPerfHeaders = [['log_id', 'timestamp', 'metric', 'value', 'description']];
  histPerfSheet.getRange('A1:E1').setValues(histPerfHeaders)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('#ffffff');

  Logger.log('[Genesis] Historical sheets created');
}

/**
 * setupAllSheets - Enhanced setupAllSheets with Satellite_Registry integration
 * @param {Spreadsheet} ss - Spreadsheet object
 */
function setupAllSheets(ss) {
  // Create Satellite_Registry sheet using SatelliteRegistry_ module
  const registrySheet = SatelliteRegistry_.getOrCreateSheet(ss);
  
  // Initialize other Mothership sheets (existing logic)
  _createConfigSheet(ss);
  _createSyncTempSheet(ss);
  _createAccaPortfolioSheet(ss);
  _createAccaResultsSheet(ss);
  _createMasterDashboardSheet(ss);
  
  Logger.log('[setupAllSheets] All sheets created including Satellite_Registry');
}

