// TODO:
//       - convert results to XML format and POST
//       - certify location updated
//       - handle case where multiple initialization requests are made simulataneously

const puppeteer = require("puppeteer");

const MAIN_PAGE = "https://fastenal.com/";
const LOC_PAGE = `${MAIN_PAGE}locations/details/WAFER`;
const PART_DESCRIPTION = (fnl) => `${MAIN_PAGE}product?query=${fnl}`;
const CATEGORY_DESCRIPTION = (category) => `${MAIN_PAGE}product/${category}`;
const EXPRESS_SRC = `${MAIN_PAGE}catalog/static/3a364d147bed98729cc3.png`;

process.on("uncaughtException", (err) => {
    console.error(err);
    console.log("Node NOT Exiting...");
});

const self = {
    browser: null,
    page: null,

    initialize: async (fnl = null, updateLoc = null) => {
        self.browser = await puppeteer.launch({
            headless: false,
        });
        self.page = await self.browser.newPage();

        if (updateLoc) await updateLoc();

        if (fnl) {
            // this chain is for testing
            await self.page.goto(PART_DESCRIPTION(fnl), {
                waitUntil: "networkidle0",
            });
            await self.setExpressIndicator();
        } else {
            console.log("non FNL");
            await self.page.goto(CATEGORY_DESCRIPTION("Fasteners"));
        }
    },
    postLoc: async () => {
        console.log("updating location...");
        await self.page.goto(LOC_PAGE, {
            waitUntil: "networkidle0",
        });
        await self.page.click(".js-setStore", {
            waitUntil: "networkidle0",
        });
        console.log("location updated");
    },
    setExpressIndicator: async () => {
        await self.page.click(".form-check-input", {
            waitUntil: "networkidle0",
        });
    },
    getResults: async (boundary = null) => {
        let elements; // = await self.page.$$(".ecom-card-sm");
        let results = [];
        await self.page
            .waitForSelector(".ecom-card-icon-list-group")
            .then(console.log("selecting..."))
            .then((elements = await self.page.$$(".ecom-card-sm")))
            .then(console.log(`selected: ${elements}`))
            .then(async () => {
                await self.verifyExpress(elements);
                if (boundary)
                    boundary =
                        boundary.toUpperCase()[0] +
                        boundary.slice(1).toLowerCase();

                for (let element of elements) {
                    let partDesc = await element.$eval(
                        ".card-text > span",
                        (node) => node.innerText.trim()
                    );
                    if (boundary && !partDesc.includes(boundary)) continue;

                    let partNum = await element.$eval(
                        ".font-weight-normal",
                        (node) => node.innerText.trim()
                    );
                    let list = {
                        partNum,
                        partDesc,
                    };

                    results.push(list);
                }
            });

        await self.browser.close();
        console.table(results);
        return results;
    },
    verifyExpress: async (elements) => {
        // this isn't working correctly
        console.log("verifying all parts in stock...");
        try {
            await elements[0].$eval(`img[style="width: 75px;"]`);
        } catch (e) {
            console.log("FAILED, unable to confirm stock");
            return;
        }
        console.log("SUCCESS, all parts in stock");
    },
    getCategoryResults: async () => {
        let categories = [];

        await self.browser.close();
    },
};

module.exports = self;
