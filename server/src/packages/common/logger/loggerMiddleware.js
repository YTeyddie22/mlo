const morgan = require("morgan");
const Log = require("./log");

const logger = new Log();

const stream = {
    write: (message) => logger.apiLog(message),
};
const loggerMiddleware = morgan("combined", { stream });

module.exports = loggerMiddleware;
