const BaseLogger = require("./baseLogger");

class Log extends BaseLogger {
    //For user operations in the App
    userActivityInformation(message, ...arg) {
        this.logger("./src/logs/user_activities.json").info(message, ...arg);
    }
    userActivityError(message, ...arg) {
        this.logger("./src/logs/user_activities.json").error(
            message.toUpperCase(),
            ...arg
        );
    }

    //For the database interaction
    databaseActivityInfo(message, ...arg) {
        this.logger("./src/logs/database_activities.json").info(
            message,
            ...arg
        );
    }
    databaseActivityError(message, ...arg) {
        this.logger("./src/logs/database_activities.json").error(
            message.toUpperCase(),
            ...arg
        );
    }

    //For the Api operations
    apiLog(message, ...arg) {
        this.logger("./src/logs/api_activities.json").info(message, ...arg);
    }

    //For the overall usage of the app
    log(message, ...arg) {
        this.logger("./src/logs/app.log").info(message, ...arg);
    }
    error(message, processExit = false, ...arg) {
        const logger = this.logger("./src/logs/app_errors.json");
        logger.error(message.toUpperCase(), ...arg);

        if (processExit) {
            setTimeout(() => {
                process.exist(1);
            }, 1000);
        }
    }
}
export default Log;
