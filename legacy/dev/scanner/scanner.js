const debug = require('debug')('isymbio:dev:scanner');
const puppeteer = require('puppeteer');
const { hashURLAsID } = require('../../lib/crypto');
const nanoid = require('nanoid');
const normalizeUrl = require('normalize-url');
const save = require('../../lib/save');

module.exports = async function scanner(
    entry_url,
    initialState,
    { shouldFollow },
    callback,
) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Kdyz udelam vobjekt, nebudu muset resit unikatni zaznamy
    let urls = initialState
        ? initialState
        : {
              [normalizeUrl(entry_url)]: {
                  id: nanoid(),
              },
          };

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
            page_to_visit.error = error.message;
        }

        // Update url record
        urls[page_to_visit.url] = page_to_visit;

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

            if (urls.hasOwnProperty(url)) {
                urls[url].score = 1 + (urls[url].score || 0);
                return;
            }

            urls[url] = { url };
            unique_urls_count++;
        });

        url_list_queue = freshPagesList(urls);

        debug(`... thereof ${unique_urls_count} unique.`);
    }

    debug(
        `Scan for ${entry_url} complete. Collected ${Object.keys(urls).length}`,
    );

    callback(urls);
};

const freshPagesList = urls =>
    Object.keys(urls)
        .filter(url => urls[url].visited != true)
        .filter(url => urls[url].error == undefined)
        .map(url => ({ url, id: nanoid() }));

const trycatch = func => (...args) => {
    try {
        return func(...args);
    } catch (error) {
        return null;
    }
};
