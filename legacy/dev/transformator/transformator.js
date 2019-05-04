const debug = require('debug')('isymbio:dev:transformator');
const fs = require('fs-extra');
const cheerio = require('cheerio');

module.exports = async function({ pages, links }, getPageData, handler) {
    for (let index = 0; index < pages.length; index++) {
        const { id, url } = pages[index];
        const data = getPageData(id);

        handler(
            {
                id,
                url,
            },
            transform(data, links)(
                transform.title,
                transform._name,
                transform._type,
                transform.content,
            ),
        );
    }

    debug(`All pages transformed and updated.`);
};

function transform({ title, link, content }, links) {
    return (...transformers) =>
        transformers.reduce((data, transformer) => transformer(data, links), {
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

transform.content = (data, links) => {
    const $ = cheerio.load(data.content);

    // Shift headline levels -1
    $('h1, h2, h3, h4, h5').each((index, element) => {
        const level = element.tagName.substr(1);
        const title = $(element).text();

        $(element).replaceWith(`<h${level - 1}>${title}</h${level - 1}>`);
    });

    // Replace links
    $('a[href]').each((index, element) => {
        let href = $(element)
            .attr('href')
            .replace(/^ /, '');
        // .replace(' ', ''); // Causes bug on downloader cuz some files hase spaces in its names

        href = href
            .replace(/^http:\/\/isymbio.cz/gi, '')
            .replace(/^http:\/\/symbio-ops.cz/gi, '');

        if (
            href.startsWith('http') === false &&
            href.startsWith('/') === false
        ) {
            href = '/' + href;
        }

        // Replace upload links

        if (href.startsWith('/admin/upload/')) {
            let new_href = href.replace('/admin/upload/', '/soubory/');
            element.attribs.href = new_href;
        }

        if (href.startsWith('/mailform.php')) {
            href = href.replace('/mailform.php?mail=', 'mailto:');
        }

        if (links.hasOwnProperty(href)) {
            element.attribs.href = links[href];
        }
    });

    // komentare - trash to remove
    $('.postmeta').remove();

    // Get clean HTML
    let content = $('.post')
        .html()
        .trim();

    return {
        ...data,
        content,
    };
};
