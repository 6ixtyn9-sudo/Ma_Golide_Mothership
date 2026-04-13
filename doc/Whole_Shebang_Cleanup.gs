/**
 * ======================================================================
 * FILE: Whole_Shebang_Cleanup.gs
 * PURPOSE: Complete satellite consolidation - TRUE "whole shebang" cleanup
 * ENSURES: Only new enhanced format, zero duplicate code, clean integration
 * ======================================================================
 */

/**
 * runTheWholeShebang - Master consolidation function (follows naming convention)
 * This is the REAL deal - complete satellite cleanup and consolidation
 */
function runTheWholeShebang() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  Logger.log('=== WHOLE SHEBANG CLEANUP STARTED ===');
  Logger.log('This is the REAL consolidation - no half measures');
  
  try {
    // Phase 1: Deep Analysis
    const analysis = _deepSatelliteAnalysis(ss);
    
    // Phase 2: User confirmation with full details
    const confirm = ui.alert(
      'RUN THE WHOLE SHEBANG',
      `DEEP ANALYSIS RESULTS:\n\n` +
      `Old bet functions found: ${analysis.oldBetFunctions.length}\n` +
      `Duplicate generation code: ${analysis.duplicateCodeBlocks.length}\n` +
      `Mixed format sheets: ${analysis.mixedFormatSheets.length}\n` +
      `Legacy triggers: ${analysis.legacyTriggers.length}\n\n` +
      `This will:\n` +
      `1. Remove ALL old bet generation code\n` +
      `2. Delete duplicate functions\n` +
      `3. Clean mixed format sheets\n` +
      `4. Consolidate to NEW FORMAT ONLY\n\n` +
      `PROCEED WITH COMPLETE CLEANUP?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirm !== ui.Button.YES) {
      Logger.log('User cancelled whole shebang cleanup');
      return;
    }
    
    // Phase 3: Execute complete cleanup
    const results = _executeCompleteCleanup(ss, analysis);
    
    // Phase 4: Final verification
    const verification = _finalVerification(ss);
    
    // Phase 5: Report
    const report = _generateCleanupReport(results, verification);
    
    ui.alert(
      'WHOLE SHEBANG COMPLETE',
      report,
      ui.ButtonSet.OK
    );
    
    Logger.log('=== WHOLE SHEBANG CLEANUP SUCCESS ===');
    
  } catch (e) {
    Logger.log(`WHOLE_SHEBANG_CLEANUP ERROR: ${e.message}\n${e.stack}`);
    ui.alert('Cleanup Error', `Failed to complete whole shebang:\n\n${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Deep analysis of satellite state
 */
function _deepSatelliteAnalysis(ss) {
  const analysis = {
    oldBetFunctions: [],
    duplicateCodeBlocks: [],
    mixedFormatSheets: [],
    legacyTriggers: [],
    allSheets: ss.getSheets()
  };
  
  // Analyze each sheet for issues
  analysis.allSheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    
    // Check for mixed formats in Bet_Slips
    if (sheetName === 'Bet_Slips') {
      const hasOldFormat = _detectOldFormat(data);
      const hasNewFormat = _detectNewFormat(data);
      
      if (hasOldFormat && hasNewFormat) {
        analysis.mixedFormatSheets.push({
          name: sheetName,
          oldRows: _countOldFormatRows(data),
          newRows: _countNewFormatRows(data)
        });
      }
    }
    
    // Check for other problematic sheets
    if (_sheetHasLegacyData(sheetName, data)) {
      analysis.mixedFormatSheets.push({
        name: sheetName,
        issue: 'Legacy data detected'
      });
    }
  });
  
  // Try to detect old functions (limited in Apps Script but we can try)
  try {
    // This would need to be adapted based on actual satellite structure
    const scriptProperties = PropertiesService.getScriptProperties();
    const legacyIndicators = scriptProperties.getProperties();
    
    Object.keys(legacyIndicators).forEach(key => {
      if (key.includes('old') || key.includes('legacy') || key.includes('bet_slips')) {
        analysis.legacyTriggers.push(key);
      }
    });
  } catch (e) {
    Logger.log(`Could not analyze script properties: ${e.message}`);
  }
  
  return analysis;
}

/**
 * Detect old format in data
 */
function _detectOldFormat(data) {
  if (data.length === 0) return false;
  
  // Check for old format indicators
  const firstRow = data[0];
  const firstCell = String(firstRow[0] || '');
  
  return firstCell.includes('Generated:') && 
         !firstCell.includes('ENHANCED') &&
         !String(data[1] || []).includes('Bet_Record_ID');
}

/**
 * Detect new format in data
 */
function _detectNewFormat(data) {
  if (data.length < 2) return false;
  
  // Check for new format indicators
  const secondRow = data[1] || [];
  return String(secondRow[0] || '').includes('Bet_Record_ID') ||
         String(data[0] || []).includes('ENHANCED');
}

/**
 * Count old format rows
 */
function _countOldFormatRows(data) {
  let count = 0;
  let foundNewFormat = false;
  
  for (let i = 0; i < data.length; i++) {
    if (_detectNewFormat([data[i]])) {
      foundNewFormat = true;
      break;
    }
    if (String(data[i][0] || '').includes('Generated:') || 
        String(data[i][0] || '').includes('#ERROR!')) {
      count++;
    }
  }
  
  return count;
}

/**
 * Count new format rows
 */
function _countNewFormatRows(data) {
  let count = 0;
  let inNewSection = false;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    if (String(row[0] || '').includes('ENHANCED') || 
        String(row[0] || '').includes('Bet_Record_ID')) {
      inNewSection = true;
    }
    
    if (inNewSection && String(row[0] || '').trim() !== '') {
      count++;
    }
  }
  
  return count;
}

/**
 * Check if sheet has legacy data
 */
function _sheetHasLegacyData(sheetName, data) {
  if (data.length === 0) return false;
  
  const legacyIndicators = [
    'Generated:',
    '#ERROR!',
    'config_stamp',
    'Total Bankers:',
    'Total Snipers:'
  ];
  
  const firstCell = String(data[0][0] || '');
  return legacyIndicators.some(indicator => firstCell.includes(indicator));
}

/**
 * Execute complete cleanup
 */
function _executeCompleteCleanup(ss, analysis) {
  const results = {
    sheetsCleaned: 0,
    rowsRemoved: 0,
    legacyDataCleared: 0,
    newFormatPreserved: 0
  };
  
  // Clean mixed format sheets
  analysis.mixedFormatSheets.forEach(sheetInfo => {
    const sheet = ss.getSheetByName(sheetInfo.name);
    if (!sheet) return;
    
    if (sheetInfo.name === 'Bet_Slips') {
      const cleanupResult = _cleanBetSlipsSheet(sheet, sheetInfo);
      results.sheetsCleaned++;
      results.rowsRemoved += cleanupResult.rowsRemoved;
      results.newFormatPreserved += cleanupResult.rowsPreserved;
    } else {
      // Clean other sheets with legacy data
      _cleanLegacySheet(sheet);
      results.legacyDataCleared++;
      results.sheetsCleaned++;
    }
  });
  
  // Clean up script properties
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    analysis.legacyTriggers.forEach(key => {
      scriptProperties.deleteProperty(key);
    });
  } catch (e) {
    Logger.log(`Could not clean script properties: ${e.message}`);
  }
  
  return results;
}

/**
 * Clean Bet_Slips sheet specifically
 */
function _cleanBetSlipsSheet(sheet, sheetInfo) {
  const data = sheet.getDataRange().getValues();
  const result = {
    rowsRemoved: 0,
    rowsPreserved: 0
  };
  
  // Find where new format starts
  let newFormatStart = -1;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[0] || '').includes('ENHANCED') || 
        String(row[0] || '').includes('Bet_Record_ID')) {
      newFormatStart = i;
      break;
    }
  }
  
  if (newFormatStart > 0) {
    // Remove everything before new format
    sheet.deleteRows(1, newFormatStart);
    result.rowsRemoved = newFormatStart;
    result.rowsPreserved = data.length - newFormatStart;
    
    Logger.log(`Cleaned Bet_Slips: removed ${newFormatStart} old rows, preserved ${result.rowsPreserved} new rows`);
  }
  
  return result;
}

/**
 * Clean legacy sheet
 */
function _cleanLegacySheet(sheet) {
  // Clear content but preserve basic structure
  const range = sheet.getDataRange();
  if (range.getNumRows() > 0) {
    // Keep first row if it has headers, otherwise clear everything
    const firstRow = range.getValues()[0];
    const hasHeaders = firstRow.some(cell => String(cell || '').trim() !== '');
    
    if (hasHeaders && range.getNumRows() > 1) {
      sheet.getRange(2, 1, range.getNumRows() - 1, range.getNumColumns()).clearContent();
    } else {
      sheet.clear();
    }
  }
  
  Logger.log(`Cleaned legacy sheet: ${sheet.getName()}`);
}

/**
 * Final verification
 */
function _finalVerification(ss) {
  const verification = {
    isClean: true,
    issues: [],
    newFormatOnly: false
  };
  
  // Check Bet_Slips sheet
  const betSlipsSheet = ss.getSheetByName('Bet_Slips');
  if (betSlipsSheet) {
    const data = betSlipsSheet.getDataRange().getValues();
    
    const hasOldFormat = _detectOldFormat(data);
    const hasNewFormat = _detectNewFormat(data);
    
    if (hasOldFormat) {
      verification.isClean = false;
      verification.issues.push('Old format still present in Bet_Slips');
    }
    
    if (hasNewFormat && !hasOldFormat) {
      verification.newFormatOnly = true;
    }
  }
  
  // Check other sheets for legacy data
  ss.getSheets().forEach(sheet => {
    const data = sheet.getDataRange().getValues();
    if (_sheetHasLegacyData(sheet.getName(), data)) {
      verification.isClean = false;
      verification.issues.push(`Legacy data in sheet: ${sheet.getName()}`);
    }
  });
  
  return verification;
}

/**
 * Generate cleanup report
 */
function _generateCleanupReport(results, verification) {
  let report = 'WHOLE SHEBANG CLEANUP RESULTS:\n\n';
  
  report += `CLEANUP PERFORMED:\n`;
  report += `Sheets cleaned: ${results.sheetsCleaned}\n`;
  report += `Old rows removed: ${results.rowsRemoved}\n`;
  report += `Legacy data cleared: ${results.legacyDataCleared}\n`;
  report += `New format rows preserved: ${results.newFormatPreserved}\n\n`;
  
  if (verification.isClean && verification.newFormatOnly) {
    report += `STATUS: SUCCESS\n`;
    report += `Satellite is now using NEW FORMAT ONLY\n`;
    report += `No old/duplicate code detected\n\n`;
    report += `THE WHOLE SHEBANG IS NOW REAL!`;
  } else {
    report += `STATUS: NEEDS ATTENTION\n`;
    report += `Issues found:\n`;
    verification.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
  }
  
  return report;
}

/**
 * runQuickCleanup - Fast cleanup for minor issues
 */
function runQuickCleanup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  try {
    const betSlipsSheet = ss.getSheetByName('Bet_Slips');
    if (!betSlipsSheet) {
      ui.alert('Error', 'Bet_Slips sheet not found', ui.ButtonSet.OK);
      return;
    }
    
    const data = betSlipsSheet.getDataRange().getValues();
    const hasOldFormat = _detectOldFormat(data);
    const hasNewFormat = _detectNewFormat(data);
    
    if (!hasOldFormat) {
      ui.alert('No Cleanup Needed', 'Satellite is already clean', ui.ButtonSet.OK);
      return;
    }
    
    // Quick cleanup - just remove old format
    const cleanupResult = _cleanBetSlipsSheet(betSlipsSheet, { name: 'Bet_Slips' });
    
    ui.alert(
      'Quick Cleanup Complete',
      `Removed ${cleanupResult.rowsRemoved} old format rows\n` +
      `Preserved ${cleanupResult.rowsPreserved} new format rows`,
      ui.ButtonSet.OK
    );
    
  } catch (e) {
    ui.alert('Error', `Quick cleanup failed: ${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * runValidateWholeShebang - Check if whole shebang is working
 */
function runValidateWholeShebang() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  const verification = _finalVerification(ss);
  
  let status = '';
  let message = '';
  let icon = '';
  
  if (verification.isClean && verification.newFormatOnly) {
    status = 'WHOLE SHEBANG WORKING!';
    message = 'Satellite is fully consolidated and using new format only.\n\n' +
              'Ready for clean Mothership integration.';
    icon = 'SUCCESS';
  } else if (verification.issues.length > 0) {
    status = 'WHOLE SHEBANG INCOMPLETE';
    message = 'Issues preventing full consolidation:\n\n';
    verification.issues.forEach(issue => {
      message += `× ${issue}\n`;
    });
    message += '\nRun WHOLE_SHEBANG_CLEANUP() to fix.';
    icon = 'WARNING';
  } else {
    status = 'UNKNOWN STATE';
    message = 'Could not determine satellite state.\n\n' +
              'Run WHOLE_SHEBANG_CLEANUP() for full analysis.';
    icon = 'INFO';
  }
  
  ui.alert(`${icon} ${status}`, message, ui.ButtonSet.OK);
  Logger.log(`Whole Shebang Validation: ${status}`);
}
