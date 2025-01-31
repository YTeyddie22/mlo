const { createLogger, format, transports } = require("winston");
const { DailyRotateFile } = require("winston-daily-rotate-file");

class BaseLogger {
    #env = process.env;
    #options;
    #logLevel = this.#env.DEV_ENV ? "debug" : "info";
    #directory = "./src/logs/app.log";

    constructor() {
        this.#options = this._config();
    }

    _config() {}

    _jsonFormatter() {}
    logger(logFileDir) {
        return createLogger({
            transports: [
                new transports.Console({
                    level: this.#logLevel,
                    format: format(this._jsonFormatter)(
                        format.errors({ stack: true })
                    ),
                }),
                new transports.File({
                    filename: logFileDir,
                    format: format(this._jsonFormatter)(format.json()),
                }),
            ],
            exceptionHandlers: [new DailyRotateFile(this._config().file)],
            exitOnError: false,
        });
    }
}

export default BaseLogger;
