require('dotenv').config();

const debug = require('debug')('isymbio:dev');
const save = require('../lib/save');

(async () => {
    return;
    try {
        await require('./scanner')(
            'http://isymbio.cz/',
            // 'http://isymbio.cz/admin/upload/uzivatelska_prirucka_Vocatex.pdf',
            __dirname + '/../tmp/isymbio-pages.json',
            {
                shouldFollow(link) {
                    return (
                        link.includes('symbio-ops.cz') ||
                        link.includes('isymbio.cz')
                    );
                },
            },
        );
    } catch (error) {
        debug('Error in scanner', error);
    }
})();

(async () => {
    return;
    try {
        await require('./object-to-list')(
            __dirname + '/../tmp/isymbio-pages.json',
            __dirname + '/../tmp/isymbio-pages-list.json',
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();

(async () => {
    return;
    const pages = require('../tmp/isymbio-pages-list.json')
        .sort((a, b) => a.score < b.score)
        .filter(
            page =>
                page.url.includes('komentare_add.php') == false &&
                page.url.includes('komentare.php') == false &&
                page.url.includes('galerie_items.php') == false &&
                page.url.includes('mailform.php') == false &&
                page.url.startsWith('http://isymbio.cz') &&
                page.url.includes('/admin/upload/') === false &&
                page.url.includes('/index.php') === false,
        );

    try {
        await require('./collector')(pages, {
            target_dir: __dirname + '/../tmp',
        });
        await save(__dirname + '/../tmp/isymbio-clean-pages-list.json', pages);
    } catch (error) {
        debug('Error:\n', error);
    }
})();

(async () => {
    // return;
    const pages = require('../tmp/isymbio-clean-pages-list.json').sort(
        (a, b) => a.score < b.score,
    );

    try {
        await require('./transformator')(pages, async (page, data) => {
            await save(
                __dirname + `/../tmp/app/${data.type}/${data.name}.json`,
                data,
            );
        });
    } catch (error) {
        debug('Error:\n', error);
    }
    // })();

    // (async () => {
    //     return;
    try {
        await require('./generator')(
            __dirname + '/../tmp/app',
            async (data, markdown) => {
                const header = [
                    '---',
                    'title: ' + data.title,
                    '---',
                    null,
                ].join('\n');
                await save(
                    __dirname + `/../app/markdown/${data.type}/${data.name}.md`,
                    header + markdown,
                );
            },
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
