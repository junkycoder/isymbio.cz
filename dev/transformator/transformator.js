const debug = require('debug')('isymbio:dev:transformator');
const save = require('../lib/save');
const fs = require('fs-extra');
const cheerio = require('cheerio');

module.exports = async function(pages, handler) {
    for (let index = 0; index < pages.length; index++) {
        const { id, url } = pages[index];
        const data = require(`../tmp/${id}.json`);

        handler(
            {
                id,
                url,
            },
            transform(data)(
                transform.title,
                transform._name,
                transform._type,
                transform.content,
            ),
        );
    }

    debug(`All pages transformed and updated.`);
};

function transform({ title, link, content }) {
    return (...transformers) =>
        transformers.reduce((data, transformer) => transformer(data), {
            title,
            link,
            content,
        });
}

transform.title = data => {
    const $ = cheerio.load(data.content);

    let title = $('h2')
        .first()
        .text();

    if (title == 'Novinky') {
        title = $('h3')
            .first()
            .text();
    }

    return {
        ...data,
        title,
    };
};

transform._name = data => {
    const name = require('diacritics')
        .remove(data.title)
        .replace(/[^\w\s]/gi, '')
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/--/gi, '-')
        .toLowerCase();

    return {
        ...data,
        name,
    };
};

transform._type = data => {
    let type = '';

    if (data.link.includes('/news.php')) {
        type = 'novinky';
    }

    if (data.link.includes('/clanky.php')) {
        type = 'clanky';
    }

    return {
        ...data,
        type,
    };
};

transform.content = data => {
    const $ = cheerio.load(data.content);

    $('h1, h2, h3, h4, h5').each((index, element) => {
        const level = element.tagName.substr(1);
        const title = $(element).text();

        $(element).replaceWith(`<h${level - 1}>${title}</h${level - 1}>`);
    });

    // komentare - trash to remove
    $('.postmeta').remove();

    let content = $('.post')
        .html()
        .trim();

    return {
        ...data,
        content,
    };
};
