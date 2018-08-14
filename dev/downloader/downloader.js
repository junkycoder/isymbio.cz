const debug = require('debug')('isymbio:dev:downloader');
const glob = require('glob');
const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');

module.exports = async function(source_dir, handler) {
    const link_to_download = [];

    await new Promise((resolve, reject) =>
        glob(`${source_dir}/**/*.json`, {}, (error, files) => {
            if (error) reject();
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const data = require(file);
                const $ = cheerio.load(data.content);

                $('a[href^="/soubory/"]').each((i, element) => {
                    link_to_download.push(
                        normalizeUrl(
                            $(element)
                                .attr('href')
                                .replace(
                                    '/soubory/',
                                    'http://isymbio.cz/admin/upload/',
                                ),
                        ),
                    );
                });
            }

            debug(`Found ${link_to_download.length} files to download.`);
            debug('Now you can run dev/downloader/download.sh CLI tool.');
            handler(link_to_download);
            resolve();
        }),
    );
};
