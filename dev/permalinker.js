const debug = require('debug')('isymbio:dev:generator');
const save = require('../lib/save');
const glob = require('glob');
const cheerio = require('cheerio');

module.exports = async function(pages, source_dir, handler) {
    // 1st generate new url for every page
    await new Promise((resolve, reject) =>
        glob(`${source_dir}/**/*.json`, {}, (error, files) => {
            if (error) reject();
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const data = require(file);
                const page = pages.find(page => page.url == data.link);

                if (page) {
                    page.new_url = `/${data.type}/${data.name}/`.replace(
                        '//',
                        '/',
                    );
                }
            }
            console.log('1');
            resolve();
        }),
    );

    console.log('2');

    // 2nd replace old content urls to new urls
    await new Promise((resolve, reject) =>
        glob(`${source_dir}/**/*.json`, {}, (error, files) => {
            if (error) reject();
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const data = require(file);
                const $ = cheerio.load(data.content);

                $('a[href]').each((i, element) => {
                    const href = $(element)
                        .attr('href')
                        .replace(' ', '');
                    const page = pages.find(page => page.url.includes(href));

                    if (page) {
                        $(element).attr('href', page.new_url);
                    }
                });

                console.log($.html());
                resolve();
                return;

                handler({
                    content: $('document').html(),
                    ...data,
                });
            }
            resolve();
        }),
    );
};
