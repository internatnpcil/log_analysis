const LogModel = require('../models/logModel');

class LogController {
  static async uploadLog(req, res) {
    try {
      const result = await LogModel.parseLogFile(req.file.path);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllLogs(req, res) {
    try {
      const logs = await LogModel.getAllLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLogsByUsername(req, res) {
    try {
      const { username } = req.params;
      const logs = await LogModel.getLogsByUsername(username);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLogsByIp(req, res) {
    try {
      const { ip } = req.params;
      const logs = await LogModel.getLogsByIp(ip);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLogsByTimestampRange(req, res) {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ error: 'Start and end timestamps are required' });
      }
      const logs = await LogModel.getLogsByTimestampRange(start, end);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LogController;