const fnl_scraper = require('./fnl_scraper');

(async () => {
    await fnl_scraper.initialize('1%2F2"%20FHN&fsi=1');

    let results = await fnl_scraper.getResults('anchor');

    debugger;
})();