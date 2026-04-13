/**
 * ======================================================================
 * FILE: Satellite_Whole_Shebang.gs
 * PURPOSE: Complete satellite consolidation and cleanup
 * USAGE: Add this to your satellite spreadsheet - runTheWholeShebang() does everything
 * ======================================================================
 */

/**
 * runTheWholeShebang - Complete satellite consolidation and cleanup
 * Executes everything needed in one function - no extra files required
 * This belongs in the SATELLITE, not the Mothership
 */
function runTheWholeShebang() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  Logger.log('=== RUN THE WHOLE SHEBANG STARTED ===');
  
  try {
    // Phase 1: Analyze current state
    const analysis = _analyzeCurrentState(ss);
    
    // Phase 2: Show what will be cleaned
    const confirm = ui.alert(
      'RUN THE WHOLE SHEBANG',
      `CLEANUP ANALYSIS:\n\n` +
      `Mixed format sheets: ${analysis.mixedSheets.length}\n` +
      `Old format rows: ${analysis.oldRows}\n` +
      `New format rows: ${analysis.newRows}\n\n` +
      `This will remove old bet formats and consolidate to new enhanced format only.\n\n` +
      `PROCEED WITH CLEANUP?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirm !== ui.Button.YES) {
      Logger.log('User cancelled whole shebang');
      return;
    }
    
    // Phase 3: Execute cleanup
    const results = _executeWholeShebangCleanup(ss, analysis);
    
    // Phase 4: Report results
    ui.alert(
      'WHOLE SHEBANG COMPLETE',
      `Cleanup Results:\n\n` +
      `Sheets cleaned: ${results.sheetsCleaned}\n` +
      `Old rows removed: ${results.rowsRemoved}\n` +
      `New format preserved: ${results.rowsPreserved}\n\n` +
      `Satellite now uses consolidated new format only.`,
      ui.ButtonSet.OK
    );
    
    Logger.log('=== WHOLE SHEBANG COMPLETED SUCCESSFULLY ===');
    
  } catch (e) {
    Logger.log(`runTheWholeShebang ERROR: ${e.message}\n${e.stack}`);
    ui.alert('Cleanup Error', `Failed to run whole shebang:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Analyze current satellite state
 */
function _analyzeCurrentState(ss) {
  const analysis = {
    mixedSheets: [],
    oldRows: 0,
    newRows: 0
  };
  
  // Check Bet_Slips sheet
  const betSlipsSheet = ss.getSheetByName('Bet_Slips');
  if (betSlipsSheet) {
    const data = betSlipsSheet.getDataRange().getValues();
    
    let oldCount = 0;
    let newCount = 0;
    let foundNew = false;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const firstCell = String(row[0] || '');
      
      if (firstCell.includes('ENHANCED') || firstCell.includes('Bet_Record_ID')) {
        foundNew = true;
      }
      
      if (foundNew) {
        if (firstCell.trim() !== '') newCount++;
      } else {
        if (firstCell.includes('Generated:') || firstCell.includes('#ERROR!')) {
          oldCount++;
        }
      }
    }
    
    if (oldCount > 0 && newCount > 0) {
      analysis.mixedSheets.push('Bet_Slips');
      analysis.oldRows = oldCount;
      analysis.newRows = newCount;
    }
  }
  
  return analysis;
}

/**
 * Execute the whole shebang cleanup
 */
function _executeWholeShebangCleanup(ss, analysis) {
  const results = {
    sheetsCleaned: 0,
    rowsRemoved: 0,
    rowsPreserved: 0
  };
  
  // Clean Bet_Slips sheet if needed
  if (analysis.mixedSheets.includes('Bet_Slips')) {
    const betSlipsSheet = ss.getSheetByName('Bet_Slips');
    if (betSlipsSheet) {
      const data = betSlipsSheet.getDataRange().getValues();
      
      // Find where new format starts
      let newFormatStart = -1;
      for (let i = 0; i < data.length; i++) {
        const firstCell = String(data[i][0] || '');
        if (firstCell.includes('ENHANCED') || firstCell.includes('Bet_Record_ID')) {
          newFormatStart = i;
          break;
        }
      }
      
      if (newFormatStart > 0) {
        // Remove old format rows
        betSlipsSheet.deleteRows(1, newFormatStart);
        results.rowsRemoved = newFormatStart;
        results.rowsPreserved = data.length - newFormatStart;
        results.sheetsCleaned++;
        
        Logger.log(`Cleaned Bet_Slips: removed ${newFormatStart} old rows, preserved ${results.rowsPreserved} new rows`);
      }
    }
  }
  
  return results;
}

/**
 * Update satellite menu to include whole shebang
 * Add this to your satellite's onOpen function
 */
function updateSatelliteMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Ma Golide')
    .addItem('RUN THE WHOLE SHEBANG', 'runTheWholeShebang')
    .addItem('Run Full Analysis (No Tuning)', 'runFullAnalysis')
    .addSeparator()
    .addItem('Generate Raw Sheets (Dynamic)', 'generateRawSheetsForGameCount')
    .addSeparator()
    .addSubMenu(ui.createMenu('Parsers')
      .addItem('Parse Raw', 'parseRaw')
      .addItem('Parse Results', 'runParseResults')
      .addItem('Parse Upcoming', 'parseUpcomingMatches')
      .addItem('Parse All H2H', 'runAllH2HParsers')
      .addItem('Parse All Recent', 'runAllRecentParsers')
      .addItem('Run All Parsers', 'runAllParsers'))
    .addSubMenu(ui.createMenu('Analyzers')
      .addItem('Run Historical Analysis', 'runHistoricalAnalyzers')
      .addItem('Run Tier 1 Forecast', 'runTier1_Forecast')
      .addItem('Run Tier 1 Forensics', 'runTier1Forensics')
      .addSeparator()
      .addItem('Run Tier 2 COMPLETE', 'runTier2Complete')
      .addSeparator()
      .addItem('Run Tier 2 Margins Only', 'runTier2_DeepDive')
      .addItem('Run Tier 2 O/U Only', 'runTier2OU')
      .addItem('Run O/U Then Enhancements', 'runOUThenEnhancements'))
    .addSubMenu(ui.createMenu('Enhancements')
      .addItem('Run All Enhancements (HQ + 1H)', 'runAllEnhancements')
      .addSeparator()
      .addItem('Run ROBBERS Detection', 'runRobbersDetection')
      .addItem('Run First Half Predictions', 'runFirstHalfPredictions')
      .addItem('Run FT O/U Predictions', 'runFTOUPredictions')
      .addSeparator()
      .addItem('Enhancement Diagnostic', 'runEnhancementDiagnostic')
      .addItem('Clear All Caches', 'clearAllCaches'))
    .addSubMenu(ui.createMenu('Highest Quarter')
      .addItem('Run HQ Predictions', 'runHQPredictions')
      .addItem('Run HQ With O/U Cross-Leverage', 'runHQWithOUCrossLeverage')
      .addSeparator()
      .addItem('Build HQ History', 'runBuildHQHistory')
      .addItem('Backtest HQ Model', 'runHQBacktest')
      .addItem('HQ Accuracy Report', 'runHQAccuracyReport')
      .addSeparator()
      .addItem('HQ Diagnostic (First Game)', 'runHQDiagnostic')
      .addItem('HQ Pipeline Status', 'runHQStatusCheck'))
    .addSubMenu(ui.createMenu('Reports')
      .addItem('Generate Accuracy Report', 'runAccuracyReportWrapper')
      .addItem('Generate Tier 2 Accuracy Report', 'generateTier2AccuracyReport_')
      .addItem('Generate O/U Accuracy Report', 'runOUAccuracyReport')
      .addItem('Generate HQ Accuracy Report', 'runHQAccuracyReport'))
    .addSubMenu(ui.createMenu('Configuration')
      .addItem('Sync Missing Configs (Safe)', 'syncMissingConfigs')
      .addSeparator()
      .addItem('Optimize Tier 2 Config', 'runTier2ConfigOptimization')
      .addItem('Tune League Weights', 'tuneLeagueWeightsWrapper')
      .addItem('Tune HQ Parameters', 'runHQTuner')
      .addSeparator()
      .addItem('Apply Tier 1 Rank #1', 'applyTier1ProposedToConfig')
      .addItem('Apply Tier 1 Rank #2', 'applyTier1Rank2ToConfig')
      .addItem('Apply Tier 1 Rank #3', 'applyTier1Rank3ToConfig')
      .addSeparator()
      .addItem('Apply Tier 2 Rank #1', 'applyTier2ProposedToConfig')
      .addItem('Apply Tier 2 Rank #2', 'applyTier2Rank2ToConfig')
      .addItem('Apply Tier 2 Rank #3', 'applyTier2Rank3ToConfig')
      .addSeparator()
      .addItem('Create HQ Sheets', 'runCreateHQSheets')
      .addItem('Create Config_Tier2', 'createTier2ConfigSheet')
      .addItem('View Current Config', 'showCurrentConfig')
      .addSeparator()
      .addItem('Clean Duplicate Columns', 'cleanUpcomingCleanDuplicateColumns')
      .addItem('Clear Margin Cache', 'clearMarginCache'))
    .addSeparator()
    .addItem('Build Accumulators', 'runAccumulator')
    .addSubMenu(ui.createMenu('Diagnostics')
      .addItem('HQ Pipeline Status', 'runHQStatusCheck')
      .addItem('HQ Diagnostic (First Game)', 'runHQDiagnostic')
      .addItem('Data Access Check', 'diagHQDataAccess')
      .addItem('Run Full HQ Audit', 'runHQFullAudit'))
    .addToUi();
}
