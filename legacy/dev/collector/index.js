const debug = require('debug')('isymbio:dev:collector');
const save = require('../lib/save');

(async () => {
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
