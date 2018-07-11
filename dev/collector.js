const debug = require('debug')('dev:collector');
const puppeteer = require('puppeteer');
const promisify = require('../lib/promisify');
const fs = require('fs-extra');

module.exports = async function(source_url, destination_path) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(source_url, { waitUntil: 'networkidle2' });
    } catch (error) {
        debug(`Can't browse ${source_url} page`, error);
    }

    const data = await page.evaluate(collector);

    await save(destination_path + '.json', data);

    await browser.close();
};

function collector() {
    return {
        title: document.title,
        navigation: [...document.querySelectorAll('#sidebar li a')].map(
            link => ({ url: link.href, text: link.innerText }),
        ),
        content: document.querySelector('#content').innerHTML,
        links: [...document.querySelectorAll('a[href]')].map(link => link.href),
    };
}
const save = async (filename, data) => {
    try {
        fs.ensureFileSync(filename);

        fs.writeJsonSync(filename, data, {
            spaces: 2,
        }),
            debug('Created JSON file', filename);
    } catch (error) {
        debug('Can not create JSON file', error);
    }
};
