'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, splat, simple, errors } = format;

const customFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${
        info.stack ? info.stack : info.message
    }`;
});

const logger = createLogger({
    format: combine(
        errors({ stack: true }),
        splat(),
        simple(),
        label({ label: 'delta server' }),
        timestamp({
            format: 'MM-DD-YYYY hh:mm:ss A'
        }),
        customFormat
    ),
    transports: [
        new transports.File({
            dirname: 'storage',
            filename: 'error.log',
            level: 'error'
        }),
        new transports.File({
            dirname: 'storage',
            filename: 'combined.log',
            level: 'info'
        })
        // new transports.Console()
    ]
});

module.exports = logger;
