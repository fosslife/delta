const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, splat, simple } = format;

const customFormat = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = createLogger({
    format: combine(
        splat(),
        simple(),
        label({ label: 'sprk server' }),
        timestamp({
            format: 'MM-DD-YYYY hh:mm:ss A',
        }),
        customFormat,
    ),
    transports: [
        new transports.File({ dirname: 'storage', filename: 'error.log', level: 'error' }),
        new transports.File({ dirname: 'storage', filename: 'combined.log' })
    ]
});

module.exports = logger;
