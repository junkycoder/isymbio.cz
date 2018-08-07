const debug = require('debug')('isymbio:dev:scanner');
const puppeteer = require('puppeteer');
const { hashURLAsID } = require('../lib/crypto');
const normalizeUrl = require('normalize-url');
const save = require('../lib/save');

module.exports = async function scanner(
    entry_url,
    output_file,
    { shouldFollow },
) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Kdyz udelam vobjekt, nebudu muset resit unikatni zaznamy
    let urls = {};

    try {
        urls = require(output_file).reduce(
            (page, map) => (map[page.id] = page),
            urls,
        );
    } catch (error) {
        debug(error);
        urls = {
            [hashURLAsID(entry_url)]: {
                id: hashURLAsID(entry_url),
                url: normalizeUrl(entry_url),
            },
        };
    }

    debug('Initial urls object initialized\n', urls);
    let url_list_queue = freshPagesList(urls);

    while (url_list_queue.length > 0) {
        // Always pick first url from fresh list

        const [page_to_visit] = url_list_queue;

        try {
            debug('Visit page\n', page_to_visit);
            await page.goto(page_to_visit.url, { waitUntil: 'networkidle2' });

            // Mark as visited
            page_to_visit.visited = true;
        } catch (error) {
            // Mark as errored
            page_to_visit.error = error;
        }

        // Update url record
        urls[page_to_visit.id] = page_to_visit;

        // Remove visited url from queue
        url_list_queue = freshPagesList(urls);
        debug(`${url_list_queue.length} remains to visit`);

        let found_urls = [];

        if (shouldFollow(page_to_visit.url) == false) {
            continue;
        }

        if (page_to_visit.error == undefined) {
            found_urls = (await page.evaluate(() =>
                [...document.querySelectorAll('a')].map(link => link.href),
            )).map(trycatch(normalizeUrl));
        }

        debug(`Found ${found_urls.length} urls`);

        let unique_urls_count = 0;

        found_urls.forEach(url => {
            if (!url) {
                return;
            }

            const id = hashURLAsID(url);

            if (urls.hasOwnProperty(id)) {
                urls[id].score = 1 + (urls[id].score || 0);
                return;
            }

            urls[id] = {
                id,
                url,
            };

            unique_urls_count++;
        });

        url_list_queue = freshPagesList(urls);

        debug(`... thereof ${unique_urls_count} unique.`);

        await save(output_file, urls);
    }

    debug(
        `Scan for ${entry_url} complete. Collected ${
            Object.keys(urls).length
        } page URLs -- ${output_file}`,
    );
};

const freshPagesList = urls =>
    Object.keys(urls)
        .filter(id => urls[id].visited != true)
        .filter(id => urls[id].error == undefined)
        .map(id => urls[id]);

const trycatch = func => (...args) => {
    try {
        return func(...args);
    } catch (error) {
        return null;
    }
};
