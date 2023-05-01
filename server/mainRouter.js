const express = require("express");
const crawl = require("../index");
const mainRouter = express.Router();

mainRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.end("GET IS WORKING");
    })
    .post(async (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(`Received search request: ${req.body.search}\nSearching...\n`);
        res.end(JSON.stringify(await crawl(req.body.search)));
    });
module.exports = mainRouter;