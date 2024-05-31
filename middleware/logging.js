const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/access.log');

const loggingMiddleware = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip} - ${req.headers['user-agent']}\n`;
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
    next();
};

module.exports = loggingMiddleware;
