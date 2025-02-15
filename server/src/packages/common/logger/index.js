const Log = require("./log");
const { loggerMiddleWare } = require("./loggerMiddleware");

const Logger = new Log();

module.exports = { loggerMiddleWare };
module.exports = Logger;
