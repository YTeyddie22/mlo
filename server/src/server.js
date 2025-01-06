const http = require("http");
const app = require("./app");

const PORT = 3000;
http.createServer(app);

const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
}

startServer();
