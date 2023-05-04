const express = require("express");
const fnl_scraper = require("../index");
const fs = require('fs');
const path = require('path');
const mainRouter = express.Router();

mainRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        
        let fileUrl = req.url;
        if (fileUrl === '/' || fileUrl === '/main' || fileUrl === '') fileUrl = "/main.html"
        console.log(fileUrl);
        
        const filePath = path.resolve("./public" + fileUrl);
        console.log(filePath);
        fs.access(filePath, (err) => {
            if (err) {
                res.statusCode = 404;
                res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`)
                return;
            }
            console.log(filePath);
            fs.createReadStream(filePath).pipe(res);
        });
    })
    .post(async (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        req.body.getAll 
            ? res.end(JSON.stringify(await fnl_scraper.getAll()))
            : res.end(JSON.stringify(await fnl_scraper.crawl(req.body.search)));
    });

module.exports = mainRouter;