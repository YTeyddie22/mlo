const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const Logger = require("./src/packages/common/logger");

process.on("uncaughtException", (err) => {
    Logger.error("---Uncaught Exception--->", true, err);
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
}

startServer();

process.on("unhandledRejection", (err) => {
    Logger.error("---Uncaught Rejection--->", true, err);
    console.log("UNHANDLED REJECTION! SHUTTING DOWN");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", (err) => {
    Logger.error("---SIGTERM issue--->", true, err);
    console.log("SIGTERM RECIEVED! SHUTTING DOWN GRACEFULLY");
    console.log(err.name, err.message);
    server.close(() => {
        console.log("PROCESS TERMINATED");
    });
});
