const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
}

startServer();
