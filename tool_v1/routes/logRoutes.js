const express = require('express');
const LogController = require('../controllers/logController');
const router = express.Router();

// API endpoints
router.get('/logs', LogController.getAllLogs);
router.get('/logs/username/:username', LogController.getLogsByUsername);
router.get('/logs/ip/:ip', LogController.getLogsByIp);
router.get('/logs/timestamp', LogController.getLogsByTimestampRange);

module.exports = router;