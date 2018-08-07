require('dotenv').config();

const debug = require('debug')('isymbio:dev');

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
    const pages = require('../tmp/isymbio-pages-list.json')
        .sort((a, b) => a.score < b.score)
        .filter(
            page =>
                page.url.includes('komentare_add.php') == false &&
                page.url.includes('komentare.php') == false &&
                page.url.includes('galerie_items.php') == false &&
                page.url.includes('mailform.php') == false &&
                page.url.startsWith('http://isymbio.cz'),
        );

    console.log(pages);

    try {
        await require('./collector')(pages, {
            target_dir: __dirname + '/../tmp',
        });
    } catch (error) {
        debug('Error:\n', error);
    }
})();
