const mongoose = require("mongoose");

const connectToDB = async() => {
	await mongoose.connect(process.env.DATABASE_URL)
	console.log("[+] Connected to database")
};


module.exports = connectToDB;


