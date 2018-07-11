const debug = require('debug')('dev:collector');
const puppeteer = require('puppeteer');
const path = require('path');
const promisify = require('../lib/promisify');
const fs = require('fs-extra');

const { compose } = require('../lib/helpers');

const defaulte = value => () => value;
const yesnt = () => null;
const objnt = () => ({});
const arrnt = () => [];

const proxy = value => value;

if (proxy('fok') !== 'fok') {
    throw new Error('Proxy test failed');
}

const beforeHashtag = link => link.split('#')[0];

module.exports = function(
    entry_url,
    {
        collectLinks = arrnt,
        collectData = objnt,
        isLinkInteresting = defaulte(true),
        handleUnbrowsableLink = yesnt,
        linkDidFound = defaulte(''),
        normalizeLink = beforeHashtag,
    },
) {
    return puppeteer.launch().then(async browser => {
        debug('Browser is ready.');
        const page = await browser.newPage();

        let links = [entry_url];
        let datas = {};
        let index = 0,
            url;

        while ((url = links[index])) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
            } catch (error) {
                debug(`Can not go to page ${url}`);

                handleUnbrowsableLink(url);

                // IMPORTANT do not delete or you stuck in the loop
                index++;
                continue;
            }

            const collectedLinks = (await page.evaluate(collectLinks)).filter(
                isLinkInteresting,
            );

            const uniqueLinks = collectedLinks
                .map(linkDidFound)
                .map(normalizeLink)
                .filter(link => link && links.indexOf(link) === -1);

            links.push(...uniqueLinks);

            debug(`Collected links ${index + 1}/${links.length}`);

            datas[url] = await page.evaluate(collectData);

            debug(`Crawled data for ${url}`);

            // IMPORTANT do not delete or you stuck in the loop
            index++;
        }

        debug(`Collected ${links.length} TOTAL unique links`);

        await save('./tmp/collected-links.json', links);
        await save('./tmp/crawled-data.json', data);

        // other actions...
        debug('Browser is going ... close.');
        await browser.close();
    });
};

const save = async (filename, data) => {
    try {
        await promisify(
            fs.writeJsonSync(filename, data, {
                spaces: 2,
            }),
        );

        debug('Created JSON file', filename);
    } catch (error) {
        debug('Can not create JSON file', error);
    }
};
