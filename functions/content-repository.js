const db = require('./db');

function getLatestContent() {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM content ORDER BY created_at DESC LIMIT 1", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function saveContent(polishText, englishText) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO content (polish_text, english_text) VALUES (?, ?)", [polishText, englishText], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

module.exports = {
  getLatestContent,
  saveContent
};
