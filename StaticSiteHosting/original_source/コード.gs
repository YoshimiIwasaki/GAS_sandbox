/**
 * ウェブアプリのエントリーポイント
 * スプレッドシートのデータをHTMLテンプレートに渡してレンダリング
 */
function doGet() {
  const today = new Date();

  const presidents = getSheetData('部長').filter(r => r['表示'] === true);

  const schedules = getSheetData('予定')
    .filter(r => r['表示'] === true)
    .sort((a, b) => new Date(a['日付']) - new Date(b['日付']));

  const history = getSheetData('歴史')
    .filter(r => r['表示'] === true)
    .sort((a, b) => Number(a['年度']) - Number(b['年度']));

  const notices = getSheetData('お知らせ')
    .filter(r => {
      if (!r['表示']) return false;
      const start = r['表示開始日'] ? new Date(r['表示開始日']) : null;
      const end   = r['表示期限']   ? new Date(r['表示期限'])   : null;
      if (start && today < start) return false;
      if (end   && today > end)   return false;
      return true;
    });

  const tmpl = HtmlService.createTemplateFromFile('index');
  tmpl.presidents = presidents;
  tmpl.schedules  = schedules;
  tmpl.history    = history;
  tmpl.notices    = notices;

  return tmpl.evaluate()
    .setTitle('水球部 創部100周年')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 指定シートの全データをオブジェクト配列で返す
 * 1行目をヘッダーとして使用
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
 * Driveファイルを「リンクを知っている全員が閲覧可」にしておく必要あり
 */
function driveThumbUrl(fileId, size) {
  if (!fileId) return '';
  size = size || 400;
  return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w' + size;
}

/**
 * HtmlService.createTemplateFromFile 用ヘルパー
 * HTML内で <?!= include('style.css') ?> のように呼び出す
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
