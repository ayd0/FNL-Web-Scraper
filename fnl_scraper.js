// TODO: POST to location field to narrow store locations
const puppeteer = require("puppeteer");

const PART_DESCRIPTION = (fnl, boundry) =>
    `https://fastenal.com/product?query=${fnl}`;

const self = {
    browser: null,
    page: null,

    initialize: async (fnl) => {
        self.browser = await puppeteer.launch({
            headless: false,
        });
        self.page = await self.browser.newPage();

        await self.page.goto(PART_DESCRIPTION(fnl), {
            waitUntil: "networkidle0",
        });
    },
    getResults: async (boundry=null) => {
        let elements = await self.page.$$(".ecom-card-sm");
        let results = [];

        if (boundry)
            boundry = boundry.toUpperCase()[0] + boundry.slice(1).toLowerCase();

        for (let element of elements) {
            let partPath = await element.$eval("div", (node) =>
                node.innerText.trim()
            );
            let partNum = `${partPath}`.split("\n")[1].slice(25);
            let partDesc = `${partPath}`.split("\n")[3];
            let list = {
                partNum,
                partDesc,
            };

            if (boundry) {
                if (partDesc.includes(boundry)) results.push(list);
                continue;
            }

            results.push(list);
        }

        return results;
    },
    processBoundry: async (partDesc, boundry) => {},
};

module.exports = self;
