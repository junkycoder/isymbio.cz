const debug = require('debug')('isymbio:dev:generator');
const glob = require('glob');
const cheerio = require('cheerio');

module.exports = async function(source_dir, handler) {
    let link_transform_map = {
        '/': '/',
        'index.php': '/',
    };
    let ignore_list = [
        '/', // Homepage
    ];

    await new Promise((resolve, reject) =>
        glob(`${source_dir}/**/*.json`, {}, (error, files) => {
            if (error) reject();
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const data = require(file);

                const link = normalizeOldLink(data.link);

                if (ignore_list.includes(link)) {
                    continue;
                }

                link_transform_map[link] = `/${data.type}/${
                    data.name
                }/`.replace('//', '/');
            }

            handler(link_transform_map);
            resolve();
        }),
    );
};

function normalizeOldLink(link) {
    link = require('normalize-url')(link, {
        normalizeProtocol: true,
        normalizeHttps: true,
        stripFragment: true,
        stripWWW: true,
        removeTrailingSlash: true,
    });
    link = link.replace(/^http:\/\/isymbio.cz/gi, '');

    return !!link ? link : '/';
}
