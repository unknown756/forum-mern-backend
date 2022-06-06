const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env" )  });
const http = require("http");
const app = require("./app");
const dbConnection = require("./utils/database.connection");

const server = http.createServer(app)

const startServer = async() => {
	await dbConnection(); 
	const PORT = process.env.PORT || 8000;
	server.listen(PORT, () => console.log("[+] Listening on port:", PORT));
};


startServer();


