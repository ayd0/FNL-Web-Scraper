const fnl_scraper = require("./fnl_scraper");
const productCypher = require("./utils/productCypher");
const SEARCH_STR = '1/2" - 2" FHN';
const BOUNDARY = null;

(async () => {
    await fnl_scraper.initialize(productCypher(SEARCH_STR));

    let results = await fnl_scraper.getResults(BOUNDARY);

    debugger;
})();