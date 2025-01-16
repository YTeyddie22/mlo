const dotenv = require("dotenv");
const app = require("./app");

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

async function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
}

startServer();

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! SHUTTING DOWN");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", (err) => {
    console.log("SIGTERM RECIEVED! SHUTTING DOWN GRACEFULLY");
    server.close(() => {
        console.log("PROCESS TERMINATED");
    });
});
