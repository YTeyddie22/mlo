const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
}

startServer();
