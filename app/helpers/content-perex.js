const cheerio = require('cheerio');

module.exports = function(content) {
    const $ = cheerio.load(content.toString());
    const text = $('article p')
        .first()
        .html();

    return text;
};
