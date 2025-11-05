"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const config_1 = require("config");
const splunk_transport_1 = require("lib/core/splunk_transport");
class Logger {
    constructor(logFilePath) {
        this._logger = (0, winston_1.createLogger)({
            format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
            transports: [
                new winston_1.transports.File({
                    filename: logFilePath
                }),
            ]
        });
        if (!config_1.config.env.production && config_1.config.env.environment !== 'test') {
            this._logger.add(new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.timestamp()),
                level: 'info'
            }));
        }
        if ((config_1.config.env.production || config_1.config.env.debug) && process.env['NO_SPLUNK'] !== 'true') {
            this._logger.add(new splunk_transport_1.SplunkTransport({
                host: config_1.config.app.logging.httpHost,
                port: config_1.config.app.logging.httpPort,
                token: config_1.config.app.logging.httpToken,
                level: 'debug'
            }));
        }
    }
    debug(message, extended) {
        this._log(message, 'debug', extended);
    }
    error(message, extended) {
        this._log(message, 'error', extended);
    }
    info(message, extended) {
        this._log(message, 'info', extended);
    }
    warn(message, extended) {
        this._log(message, 'warn', extended);
    }
    _log(message, level, extended) {
        this._logger[level](message, extended);
    }
}
exports.logger = new Logger('pictaccio.log');
//# sourceMappingURL=logger.js.map