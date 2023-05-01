const productCypher = (searchStr) => {
    console.log(`fetching: "${searchStr}"...`);
    const cypher = new Map([
        ["\\s", "%20"],
        ["\\/", "%2F"],
        ["STR_END", "&fsi=1"],
    ]);
    let iterator = cypher.entries();
    while (true) {
        let current = iterator.next().value;
        if (current[0] === "STR_END") {
            searchStr += current[1];
            break;
        } else {
            const re = new RegExp(`${current[0]}`, "g");
            searchStr = searchStr.replace(re, current[1]);
        }
    }
    console.log(`cypher: ${searchStr}`);
    return searchStr;
};

module.exports = productCypher;