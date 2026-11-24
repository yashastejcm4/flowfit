/** @OnlyCurrentDoc */
/**
 * Flowfit → Google Sheets receiver.
 * Paste into Extensions → Apps Script of your Flowfit Log sheet, then
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * Copy the web app link into Flowfit → Profile → Settings → Google Sheets.
 *
 * Flowfit sends rows grouped by tab. Column A is a stable ID, so sending the
 * same row twice updates it instead of adding a duplicate.
 */
function doGet() {
  return json_({ ok: true, app: 'Flowfit', sheet: SpreadsheetApp.getActiveSpreadsheet().getName() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (!body || body.app !== 'Flowfit' || !Array.isArray(body.tabs)) throw new Error('Not a Flowfit sync');
    var ss = SpreadsheetApp.getActiveSpreadsheet(), written = {};
    body.tabs.forEach(function (t) { written[t.name] = upsert_(ss, t.name, t.header, t.rows || []); });
    return json_({ ok: true, written: written });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function upsert_(ss, name, header, rows) {
  if (!/^[A-Za-z ]{1,30}$/.test(name)) throw new Error('Bad tab name');
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  var width = header.length;
  if (sh.getLastRow() === 0 || sh.getRange(1, 1, 1, width).getValues()[0].join('') !== header.join('')) {
    sh.getRange(1, 1, 1, width).setValues([header]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  if (!rows.length) return 0;
  var last = sh.getLastRow(), index = {};
  if (last > 1) sh.getRange(2, 1, last - 1, 1).getValues().forEach(function (r, i) { index[String(r[0])] = i + 2; });
  var fresh = [];
  rows.forEach(function (r) {
    var row = r.slice(0, width);
    while (row.length < width) row.push('');
    var id = String(row[0]), at = index[id];
    if (at > 0) sh.getRange(at, 1, 1, width).setValues([row]);
    else if (at < 0) fresh[-at - 1] = row;
    else { fresh.push(row); index[id] = -fresh.length; }
  });
  if (fresh.length) sh.getRange(sh.getLastRow() + 1, 1, fresh.length, width).setValues(fresh);
  return rows.length;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
