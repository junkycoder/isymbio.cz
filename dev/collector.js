const debug = require('debug')('isymbio:dev:collector');
const puppeteer = require('puppeteer');
const save = require('../lib/save');

module.exports = async function(links, { target_dir }) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let index = 0; index < links.length; index++) {
        const link = links[index];

        try {
            await page.goto(link.url, { waitUntil: 'networkidle2' });
            const data = await page.evaluate(collector);
            await save(`${target_dir}/${link.id}.json`, data);
        } catch (error) {
            debug(`Can't browse ${link.url} page\n`, error);
        }
    }

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
