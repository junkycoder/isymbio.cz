const cheerio = require('cheerio');

module.exports = function(strdate) {
    if (!strdate) return '';
    const date = new Date(strdate);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('. ');
};
