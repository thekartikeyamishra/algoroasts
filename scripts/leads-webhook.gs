/**
 * Google Apps Script — receives Algoroasts invite + contact submissions into a Google Sheet.
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet. Extensions → Apps Script. Paste this file. Save.
 *  2. Project Settings → Script properties → add LEADS_WEBHOOK_SECRET = (same value as on Vercel).
 *  3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 *  4. Copy the /exec URL into Vercel → Settings → Environment Variables → LEADS_WEBHOOK_URL. Redeploy.
 *
 * Apps Script cannot read request headers, so the HMAC header is not verifiable here; the
 * secret-in-URL alternative is: append ?key=<secret> to LEADS_WEBHOOK_URL and check it below.
 */
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var expected = props.getProperty('LEADS_WEBHOOK_SECRET');
  if (expected && (!e.parameter || e.parameter.key !== expected)) {
    return ContentService.createTextOutput('forbidden');
  }
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = data.type === 'contact' ? 'Contact' : 'Invites';
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received', 'Email', 'Name', 'Role', 'Message', 'Ref', 'Referred by', 'Source', 'Country', 'Consent at', 'User agent']);
  }
  sheet.appendRow([
    new Date(), data.email, data.name, data.role, data.message, data.ref,
    data.referredBy, data.source, data.country, data.consentAt, data.userAgent,
  ]);
  return ContentService.createTextOutput('ok');
}
