const Log = require("./log");
const loggerMiddleWare = require("./loggerMiddleware");

const Logger = new Log();

export { loggerMiddleWare };
export default Logger;
