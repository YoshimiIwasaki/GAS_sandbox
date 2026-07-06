const SPREADSHEET_ID = '1j1SAP8rYg2F46jvTAR5gi7wejIcPchWg7LFItC8S4hI';

function doGet() {
  const template = HtmlService.createTemplateFromFile('index');
  template.data = getSheetData();
  return template.evaluate()
      .setTitle('水球部 創部100周年')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheetData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    notices: getSheetValues(ss, 'お知らせ'),
    presidents: getSheetValues(ss, '歴代部長'),
    history: getSheetValues(ss, '歴史'),
    schedule: getSheetValues(ss, '今後の予定')
  };
}

function getSheetValues(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      // Use string keys to handle exact column names
      obj[String(header).trim()] = row[i];
    });
    return obj;
  });
}
