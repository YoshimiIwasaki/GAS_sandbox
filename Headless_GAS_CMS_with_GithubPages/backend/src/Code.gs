const SPREADSHEET_ID = '1O0Qlrt9C6AOu2P-BwKJMYdoIGbLFbeY45wDAFprTZ_w';

/**
 * API エントリーポイント
 * GitHub Pages (フロントエンド) からのリクエストを受け取り、JSONを返す
 */
function doGet(e) {
  try {
    const today = new Date();
    const isVisible = (val) => val === true || String(val).toUpperCase() === 'TRUE';
    
    // 各シートからデータを取得・整形
    const presidents = getSheetData('部長').filter(r => isVisible(r['表示']));

    const schedules = getSheetData('予定')
      .filter(r => isVisible(r['表示']))
      .sort((a, b) => new Date(a['日付']) - new Date(b['日付']));

    const history = getSheetData('歴史')
      .filter(r => isVisible(r['表示']))
      .sort((a, b) => Number(a['年度']) - Number(b['年度']));

    const notices = getSheetData('お知らせ')
      .filter(r => {
        if (!isVisible(r['表示'])) return false;
        const start = r['表示開始日'] ? new Date(r['表示開始日']) : null;
        const end   = r['表示期限']   ? new Date(r['表示期限'])   : null;
        if (start && today < start) return false;
        if (end   && today > end)   return false;
        return true;
      });

    // まとめてJSONで返すオブジェクトを作成
    const responseData = {
      status: 'success',
      data: {
        presidents: presidents,
        schedules: schedules,
        history: history,
        notices: notices
      }
    };

    // JSONとしてレスポンスを返す (CORSはGAS側で自動で許可されます)
    const output = ContentService.createTextOutput(JSON.stringify(responseData));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;

  } catch (error) {
    // エラーハンドリング
    const errorResponse = {
      status: 'error',
      message: error.toString()
    };
    const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

/**
 * 指定シートの全データをオブジェクト配列で返す
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const [headers, ...rows] = values;
  return rows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i]]))
  );
}

/**
 * DriveファイルIDからサムネイルURLを生成
 */
function driveThumbUrl(fileId, size) {
  if (!fileId) return '';
  size = size || 400;
  return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w' + size;
}
