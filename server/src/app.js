const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("combined"));
app.use(express.json());

//! Test middleware;

app.use((req, res, next) => {
    req.requstTime = new Date().toISOString();
    next();
});
module.exports = app;
