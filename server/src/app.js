const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const xss = require("xss");
const compression = require("compression");
const cors = require("cors");

app.use(morgan("combined"));
app.use(express.json());
app.disable("x-powered-by");

//! Get the actual path of the static file
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
const whiteList = [
    //production
    // development urls
    "http://localhost",
    "localhost",
    "127.0.0.1",
    "http://localhost:3000",
    "localhost:3000",
    "http://127.0.0.1:3000",
    "127.0.0.1:3000",
    /\.ngrok\.io$/,
    // production urls
];
const corsOptions = {
    origin: whiteList,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE",
    preflightContinue: true,
    allowedHeaders: [
        "Origin",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Accept-Version",
        "Authorization",
        "Credentials",
        "X-Requested-With",
        "Content-Type",
    ],
};

app.enable("trust proxy");
app.set("trust proxy", 1);
app.use(cors(corsOptions));

app.options("*", cors(corsOptions), (req, res) => res.sendStatus(200));

if (process.env.NODE_ENV === "production") {
    app.use(helmet());
}

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

//! Prevents too many requests.
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP. Try again after a while",
});

app.use("/api", limiter);

//! For parsing cookies
app.use(cookieParser());

//*Against Xss;
app.use(xss());

//* Against parameter pollution;

app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");

/**
 * ? Setting up the view engine;( PUG);
 * * Creating the path for the files used by the engine;
 */

app.set("view engine", "pug");
app.use(compression());

app.set("views", path.join(__dirname, "client"));

//! Test middleware;

app.use((req, res, next) => {
    req.requstTime = new Date().toISOString();
    next();
});
module.exports = app;
