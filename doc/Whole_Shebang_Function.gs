/**
 * runTheWholeShebang - Complete satellite consolidation and cleanup
 * Add this function to your satellite's existing Apps Script file
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

function _analyzeCurrentState(ss) {
  const analysis = {
    mixedSheets: [],
    oldRows: 0,
    newRows: 0
  };
  
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

function _executeWholeShebangCleanup(ss, analysis) {
  const results = {
    sheetsCleaned: 0,
    rowsRemoved: 0,
    rowsPreserved: 0
  };
  
  if (analysis.mixedSheets.includes('Bet_Slips')) {
    const betSlipsSheet = ss.getSheetByName('Bet_Slips');
    if (betSlipsSheet) {
      const data = betSlipsSheet.getDataRange().getValues();
      
      let newFormatStart = -1;
      for (let i = 0; i < data.length; i++) {
        const firstCell = String(data[i][0] || '');
        if (firstCell.includes('ENHANCED') || firstCell.includes('Bet_Record_ID')) {
          newFormatStart = i;
          break;
        }
      }
      
      if (newFormatStart > 0) {
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
