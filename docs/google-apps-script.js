/**
 * PeraPeraGo — Google Apps Script
 * ─────────────────────────────────────────────────────────────
 * SETUP:
 * 1. Open your Google Spreadsheet
 * 2. Extensions → Apps Script → paste this entire file
 * 3. Save (Ctrl+S)
 * 4. Deploy → New Deployment
 *    Type: Web App
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Click Deploy → copy the URL
 * 6. Paste the URL into your .env.local as NEXT_PUBLIC_GOOGLE_SCRIPT_URL
 *
 * SPREADSHEET COLUMNS (auto-created on first submission):
 * Nama | Kelas | Materi | Speaking | Listening | Quiz | Nilai Akhir | Waktu
 * ─────────────────────────────────────────────────────────────
 */

const SHEET_NAME = "Hasil Siswa"; // Change if you want a different sheet tab name

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet + header row if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Nama", "Kelas", "Materi", "Speaking", "Listening", "Quiz", "Nilai Akhir", "Waktu"]);
      sheet.setFrozenRows(1);
      // Basic formatting for header
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f0f0f0");
    }

    // Parse incoming JSON
    var data = JSON.parse(e.postData.contents);

    // Append the result row
    sheet.appendRow([
      data.studentName  || "",
      data.studentClass || "",
      data.lessonName   || data.lessonId || "",
      data.speakingScore  !== undefined ? data.speakingScore  : "",
      data.listeningScore !== undefined ? data.listeningScore : "",
      data.quizScore      !== undefined ? data.quizScore      : "",
      data.finalScore     !== undefined ? data.finalScore     : "",
      data.timestamp    || new Date().toLocaleString("id-ID"),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler — health check (useful for testing the URL is live)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "PeraPeraGo webhook is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
