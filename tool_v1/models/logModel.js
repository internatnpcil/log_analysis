const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./database/logs.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      username TEXT,
      ip TEXT,
      action TEXT
    )`);
  }
});

class LogModel {
  // Parse log file and store in database
  static async parseLogFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const lines = data.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        // Example format: "2023-10-15 14:30:45 user:john_doe ip:192.168.1.1 action:connect"
        const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) user:(\w+) ip:([\d.]+) action:(\w+)/;
        const match = line.match(regex);

        if (match) {
          const [, timestamp, username, ip, action] = match;
          await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO logs (timestamp, username, ip, action) VALUES (?, ?, ?, ?)`,
              [timestamp, username, ip, action],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }
      }
      return { success: true, message: 'Log file parsed and stored successfully' };
    } catch (error) {
      throw new Error('Error parsing log file: ' + error.message);
    }
  }

  // Get all logs
  static async getAllLogs() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM logs', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get logs by username
  static async getLogsByUsername(username) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM logs WHERE username = ?', [username], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get logs by IP
  static async getLogsByIp(ip) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM logs WHERE ip = ?', [ip], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get logs by timestamp range
  static async getLogsByTimestampRange(start, end) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM logs WHERE timestamp BETWEEN ? AND ?', [start, end], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = LogModel;