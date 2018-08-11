const debug = require('debug')('isymbio:dev:generator');
const save = require('../lib/save');
const fs = require('fs-extra');
const TurndownService = require('turndown');
const UrlSafeString = require('url-safe-string');
const cheerio = require('cheerio');

module.exports = async function(links) {
    let pages_to_generate_count = links.length;

    for (let index = 0; index < links.length; index++) {
        const link = links[index];

        if (link.url.includes('/admin/upload/')) {
            continue;
        }

        let data = {};

        try {
            data = require(`../tmp/${link.id}.json`);
        } catch (error) {
            pages_to_generate_count--;
            continue;
        }

        const title = createTitle(link, data);
        const headline = [
            '---',
            `title: ${title}`,
            // 'layout: article.hbs',
            '---',
        ].join('\n');

        await save(
            `./app/markdown/${createAddress(link, data, { title })}.md`,
            headline + '\n' + createContent(link, data),
        );
    }

    debug(
        `${pages_to_generate_count} from ${links.length} has collected data.`,
    );
};

const createAddress = (link, data, { title }) => {
    if (link.score > 100) {
        return link.url.split('/').reverse()[0];
    }

    if (
        ['http://isymbio.cz', 'http://isymbio.cz/index.php'].includes(link.url)
    ) {
        return 'index';
    }

    const [url, type] = link.url.match(/.*\/(\w+)\.[php|html]/i);

    const tagGenerator = new UrlSafeString();

    switch (type) {
        case 'news': {
            const tag = tagGenerator.generate(title);
            return `novinky/${tag}`;
        }

        case 'clanky': {
            const tag = tagGenerator.generate(title);
            return `clanky/${tag}`;
        }

        default:
            return 'unknown';
    }

    return 'unknown';
};

const createTitle = (link, data) => {
    if (
        ['http://isymbio.cz', 'http://isymbio.cz/index.php'].includes(link.url)
    ) {
        return 'SYMBIO Access devices s.r.o.';
    }

    const $ = cheerio.load(data.content);

    if (link.score > 100) {
        return $('h2').text();
    }

    const [url, type] = link.url.match(/.*\/(\w+)\.[php|html]/i);

    switch (type) {
        case 'news': {
            return $('h3').text();
        }

        default: {
            return $('h2').text();
        }
    }
};

const createContent = (link, data) => {
    const turndownService = new TurndownService({
        headingStyle: 'atx',
    });

    const markdown = turndownService.turndown(data.content);

    return markdown;
};
