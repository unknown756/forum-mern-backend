const hpp = require("hpp");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const xssClean = require("xss-clean");
const session = require("express-session");
const sanitizer = require("express-mongo-sanitize");


const authRouter = require("./routes/auth.router");
const forumRouter = require("./routes/forum.router");
const errorHandler = require("./controllers/error.controller");


// App
const app = express();

// Logging
if (process.env.NODE_ENV === "development"){
	app.use(morgan("dev"));
}

// Headers protection
app.use(helmet());
app.use(hpp());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// General config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Sanitizing inputs
app.use(sanitizer());
app.use(xssClean());

// Routes
app.use("/api/v1/forums", forumRouter);
app.use("/api/v1/auth",authRouter);

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;
