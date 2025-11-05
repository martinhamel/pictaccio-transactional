import { createLogger, Logger as WinstonLogger, transports, format } from 'winston';
import { config } from 'config';
import { SplunkTransport } from 'lib/core/splunk_transport';

/**
 * Logging class
 */
class Logger {
    private readonly _logger: WinstonLogger;

    /**
     * Initialize the logger
     * @param logFilePath Path of the log file
     */
    constructor(logFilePath: string) {
        this._logger = createLogger({
            format: format.combine(
                format.simple(),
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'})
            ),
            transports: [
                //new transports.Console(),
                new transports.File({
                    filename: logFilePath
                }),
            ]
        });

        if (!config.env.production && config.env.environment !== 'test') {
            this._logger.add(new transports.Console({
                format: format.combine(format.simple(), format.timestamp()),
                level: 'info'
            }));
        }
        if ((config.env.production || config.env.debug) && process.env['NO_SPLUNK'] !== 'true') {
            this._logger.add(new SplunkTransport({
                host: config.app.logging.httpHost,
                port: config.app.logging.httpPort,
                token: config.app.logging.httpToken,
                level: 'debug'
            }));
        }
    }

    /**
     * Log an event of type debug
     * @param message
     * @param extended? Extended information related to this entry
     */
    public debug(message: string, extended?: any) {
        this._log(message, 'debug', extended);
    }

    /**
     * Log an event of type error
     * @param message
     * @param extended? Extended information related to this entry
     */
    public error(message: string, extended?: any) {
        this._log(message, 'error', extended);
    }

    /**
     * Log an event of type info
     * @param message
     * @param extended? Extended information related to this entry
     */
    public info(message: string, extended?: any) {
        this._log(message, 'info', extended);
    }

    /**
     * Log an event of type warning
     * @param message
     * @param extended? Extended information related to this entry
     */
    public warn(message: string, extended?: any) {
        this._log(message, 'warn', extended);
    }

    /* PRIVATE */

    /**
     * Write log message to file and console.
     * @param message The log entry message
     * @param level Log level of the entry
     * @param extended Extended information related to this entry
     * @private
     */
    private _log(message: string, level: string, extended: any) {
        this._logger[level](message, extended);
    }
}

export const logger = new Logger('pictaccio.log');
