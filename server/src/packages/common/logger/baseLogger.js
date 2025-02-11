const { createLogger, format, transports } = require("winston");
const { DailyRotateFile } = require("winston-daily-rotate-file");
const dayjs = require("dayjs");

class BaseLogger {
    #env = process.env;
    #options;
    #Message = Symbol.for("message");
    #logLevel = this.#env.DEV_ENV ? "debug" : "info";
    #directory = "./src/logs/app.log";

    constructor() {
        this.#options = this._config();
    }

    setLogLevel(level) {
        this.#logLevel = level;
    }

    _config() {
        return {
            file: {
                level: this.#logLevel,
                filename: `${this.#directory}%DATE%.json`,
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                timestamp: true,
                handleExceptions: true,
                humanReadableUnhandledException: true,
                prettyPrint: true,
                json: true,
                maxSize: "20m",
                colorize: true,
                maxFiles: "14d",
            },
        };
    }

    _jsonFormatter(logEntry) {
        const base = {
            timestamp: dayjs().format("LLLL"),
        };
        const json = Object.assign(base, logEntry);
        logEntry[this.#Message] = JSON.stringify(json);

        return logEntry;
    }

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
