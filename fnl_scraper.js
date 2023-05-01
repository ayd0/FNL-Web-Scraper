// TODO: 
//       - convert fnl string to search string
//       - convert results to XML format and POST to
//       - certify location updated

const puppeteer = require("puppeteer");

const MAIN_PAGE = "https://fastenal.com/";
const LOC_PAGE = `${MAIN_PAGE}/locations/details/WAFER`;
const PART_DESCRIPTION = (fnl) => `${MAIN_PAGE}product?query=${fnl}`;

const self = {
    browser: null,
    page: null,

    initialize: async (fnl) => {
        self.browser = await puppeteer.launch({
            headless: false,
        });
        await self.postLoc();

        await self.page.goto(PART_DESCRIPTION(fnl), {
            waitUntil: "networkidle0",
        });
        await self.setExpressIndicator();
    },
    postLoc: async () => {
        self.page = await self.browser.newPage();
        await self.page.goto(LOC_PAGE, {
            waitUntil: "networkidle0",
        });
        await self.page.click(".js-setStore", {
            waitUntil: "networkidle0",
        });
    },
    setExpressIndicator: async () => {
        await self.page.click(".form-check-input", {
            waitUntil: "networkidle0",
        });
    },
    getResults: async (boundry = null) => {
        let elements; // = await self.page.$$(".ecom-card-sm");
        let results = [];
        await self.page
            .waitForSelector(".ecom-card-icon-list-group")
            .then(console.log("selecting..."))
            .then((elements = await self.page.$$(".ecom-card-sm")))
            .then(console.log(`selected: ${elements}`))
            .then(async () => {
                if (boundry)
                    boundry =
                        boundry.toUpperCase()[0] +
                        boundry.slice(1).toLowerCase();

                for (let element of elements) {
                    let partNum = await element.$eval(".font-weight-normal", (node) => node.innerText.trim());
                    let partDesc = await element.$eval(".card-text > span", (node) => node.innerText.trim());
                    console.log(`PATH: ${typeof(partNum)}: ${partNum.length}`);
                    let list = {
                        partNum,
                        partDesc
                    };

                    results.push(list);
                }
            });

        // await self.browser.close();
        return results;
    },
    processBoundry: async (partDesc, boundry) => {},
};

module.exports = self;
