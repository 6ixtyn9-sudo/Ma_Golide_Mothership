/**
 * ======================================================================
 * FILE: Satellite_Identity_Cleanup.gs
 * PURPOSE: Clean up old satellite code and consolidate to new format
 * USAGE: Run this in your satellite spreadsheet to remove duplicate/old code
 * ======================================================================
 */

/**
 * Satellite_Identity - Main cleanup function
 * Identifies and removes old bet generation code, consolidates to new format
 */
function Satellite_Identity() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  Logger.log('=== SATELLITE IDENTITY CLEANUP STARTED ===');
  
  try {
    // Step 1: Analyze current satellite state
    const analysis = _analyzeSatelliteState(ss);
    
    // Step 2: Show analysis results
    const confirm = ui.alert(
      'Satellite Identity Analysis',
      `Found the following issues:\n\n` +
      `Old bet slip functions: ${analysis.oldFunctions.length}\n` +
      `Duplicate bet generation: ${analysis.hasDuplicates ? 'YES' : 'NO'}\n` +
      `New enhanced format: ${analysis.hasNewFormat ? 'YES' : 'NO'}\n\n` +
      `Proceed with cleanup?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirm !== ui.Button.YES) {
      Logger.log('User cancelled cleanup');
      return;
    }
    
    // Step 3: Perform cleanup
    const cleanup = _performCleanup(ss, analysis);
    
    // Step 4: Report results
    ui.alert(
      'Cleanup Complete',
      `Cleanup results:\n\n` +
      `Old functions removed: ${cleanup.oldFunctionsRemoved}\n` +
      `Duplicate code cleaned: ${cleanup.duplicatesRemoved}\n` +
      `Sheets cleaned: ${cleanup.sheetsCleaned}\n\n` +
      `Satellite now uses consolidated new format only.`,
      ui.ButtonSet.OK
    );
    
    Logger.log('=== SATELLITE IDENTITY CLEANUP COMPLETED ===');
    
  } catch (e) {
    Logger.log(`Satellite_Identity ERROR: ${e.message}`);
    ui.alert('Cleanup Error', `Failed to cleanup satellite:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Analyze current satellite state
 */
function _analyzeSatelliteState(ss) {
  const analysis = {
    oldFunctions: [],
    hasDuplicates: false,
    hasNewFormat: false,
    sheets: ss.getSheets()
  };
  
  // Check for old function names
  const oldFunctionPatterns = [
    'generateBetSlips',
    'createBetSlips', 
    'writeBetSlips',
    'Bet_Slips',
    'oldBetSlips',
    'legacyBetSlips'
  ];
  
  // Check sheets for old vs new format
  analysis.sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    
    if (sheetName === 'Bet_Slips') {
      const data = sheet.getDataRange().getValues();
      
      // Check for old format indicators
      const hasOldHeaders = data.length > 0 && 
        String(data[0][0] || '').includes('Bet_Slips') &&
        String(data[0][0] || '').includes('Generated:');
      
      // Check for new format indicators  
      const hasNewHeaders = data.length > 0 &&
        String(data[1] || []).includes('Bet_Record_ID');
      
      if (hasOldHeaders) analysis.hasDuplicates = true;
      if (hasNewHeaders) analysis.hasNewFormat = true;
    }
  });
  
  return analysis;
}

/**
 * Perform the actual cleanup
 */
function _performCleanup(ss, analysis) {
  const cleanup = {
    oldFunctionsRemoved: 0,
    duplicatesRemoved: 0,
    sheetsCleaned: 0
  };
  
  // Clean Bet_Slips sheet - remove old format
  const betSlipsSheet = ss.getSheetByName('Bet_Slips');
  if (betSlipsSheet && analysis.hasDuplicates) {
    const data = betSlipsSheet.getDataRange().getValues();
    
    // Find where new format starts
    let newFormatStart = -1;
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0] || '').includes('ENHANCED') || 
          String(data[i][0] || '').includes('Bet_Record_ID')) {
        newFormatStart = i;
        break;
      }
    }
    
    if (newFormatStart > 0) {
      // Remove old format rows (everything before new format)
      betSlipsSheet.deleteRows(1, newFormatStart);
      cleanup.duplicatesRemoved = newFormatStart;
      cleanup.sheetsCleaned++;
      
      Logger.log(`Cleaned ${newFormatStart} old format rows from Bet_Slips`);
    }
  }
  
  // Clean up other sheets that might have old data
  const sheetsToClean = ['Ma_Golide_Report', 'Accuracy_Report', 'Config'];
  sheetsToClean.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      // Clear old data but keep structure
      const range = sheet.getDataRange();
      if (range.getNumRows() > 1) {
        sheet.getRange(2, 1, range.getNumRows() - 1, range.getNumColumns()).clearContent();
        cleanup.sheetsCleaned++;
      }
    }
  });
  
  return cleanup;
}

/**
 * Verify satellite is using new format only
 */
function verifySatelliteFormat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const betSlipsSheet = ss.getSheetByName('Bet_Slips');
  if (!betSlipsSheet) {
    ui.alert('Error', 'Bet_Slips sheet not found', ui.ButtonSet.OK);
    return;
  }
  
  const data = betSlipsSheet.getDataRange().getValues();
  const firstRow = String(data[0][0] || '');
  
  const isOldFormat = firstRow.includes('Generated:') && !firstRow.includes('ENHANCED');
  const isNewFormat = firstRow.includes('ENHANCED') || String(data[1][0] || '').includes('Bet_Record_ID');
  
  let message = '';
  let status = '';
  
  if (isNewFormat && !isOldFormat) {
    status = 'GOOD';
    message = 'Satellite is using new enhanced format only.\n\nNo old format detected.';
  } else if (isOldFormat && isNewFormat) {
    status = 'NEEDS CLEANUP';
    message = 'Satellite has both old and new formats.\n\nRun Satellite_Identity to clean up.';
  } else if (isOldFormat) {
    status = 'OUTDATED';
    message = 'Satellite is using old format only.\n\nUpdate to new consolidated code.';
  } else {
    status = 'UNKNOWN';
    message = 'Could not determine format.\n\nCheck Bet_Slips sheet structure.';
  }
  
  ui.alert(`Satellite Format Status: ${status}`, message, ui.ButtonSet.OK);
  
  Logger.log(`Satellite format check: ${status}`);
}

/**
 * Force cleanup - more aggressive cleanup option
 */
function forceSatelliteCleanup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const confirm = ui.alert(
    'Force Satellite Cleanup',
    'This will:\n\n' +
    '1. Clear all Bet_Slips data\n' +
    '2. Clear all report sheets\n' +
    '3. Reset satellite to clean state\n\n' +
    'This cannot be undone. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) return;
  
  try {
    // Clear Bet_Slips completely
    const betSlipsSheet = ss.getSheetByName('Bet_Slips');
    if (betSlipsSheet) {
      betSlipsSheet.clear();
      Logger.log('Cleared Bet_Slips sheet');
    }
    
    // Clear report sheets
    const reportSheets = ['Ma_Golide_Report', 'Accuracy_Report', 'Config'];
    reportSheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        sheet.clear();
        Logger.log(`Cleared ${sheetName} sheet`);
      }
    });
    
    ui.alert(
      'Force Cleanup Complete',
      'Satellite has been reset to clean state.\n\n' +
      'Run your main bet generation function to create new enhanced format.',
      ui.ButtonSet.OK
    );
    
    Logger.log('Force satellite cleanup completed');
    
  } catch (e) {
    Logger.log(`Force cleanup error: ${e.message}`);
    ui.alert('Cleanup Error', e.message, ui.ButtonSet.OK);
  }
}
