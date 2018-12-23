const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: './storage/error.log', level: 'error' }),
        new transports.File({ filename: './storage/combined.log',
            format: format.combine(
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        })
    ]
});

module.exports = logger;
