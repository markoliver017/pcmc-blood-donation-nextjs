// lib/logger.server.js
import fs from 'fs';
import path from 'path';

function getLogFilePath() {
    const date = new Date().toISOString().slice(0, 10); // e.g. "2025-05-04"
    const logsDir = path.join(process.cwd(), 'logs');

    // Ensure /logs directory exists
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    return path.join(logsDir, `${date}.txt`);
}

function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;

    fs.appendFile(getLogFilePath(), logLine, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

export function logErrorToFile(error, context = '') {
    const msg = `❌ ERROR${context ? ` (${context})` : ''}: ${error.stack || error}`;
    writeLog(msg);
}

export function logSuccessToFile(message, context = '') {
    const msg = `✅ SUCCESS${context ? ` (${context})` : ''}: ${message}`;
    writeLog(msg);
}
