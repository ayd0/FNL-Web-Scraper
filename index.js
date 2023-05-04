const fnl_scraper = require("./fnl_scraper");
const productCypher = require("./utils/productCypher");
const SEARCH_STR = '1/2" - 2" FHN';
const BOUNDARY = null;

(async () => {
    await fnl_scraper.initialize(productCypher(SEARCH_STR));

    let results = await fnl_scraper.getResults(BOUNDARY);

    debugger;
});//(); // uncomment for non-server build

const crawl = async (searchStr) => {
    await fnl_scraper.initialize(productCypher(searchStr), fnl_scraper.postLoc);

    let results = await fnl_scraper.getResults(BOUNDARY);
    return results;
}

const getAll = async () => {
    await fnl_scraper.initialize();
    await fnl_scraper.getCategoryResults();

    return null;
}

const scrapers = {
    crawl: crawl,
    getAll: getAll
};

module.exports = scrapers;