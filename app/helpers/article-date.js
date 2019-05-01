const cheerio = require('cheerio');

module.exports = function(strdate) {
    const date = new Date(strdate);
    return [date.getDate(), date.getMonth(), date.getFullYear()].join('. ');
};
