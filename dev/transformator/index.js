const debug = require('debug')('isymbio:dev:transformator');
const save = require('../../lib/save');

const tmp_dir = __dirname + '/../../tmp';

(async () => {
    const pages = require(tmp_dir + '/isymbio-clean-pages-list.json').sort(
        (a, b) => a.score < b.score,
    );
    const links = require(tmp_dir + '/isymbio-links-transorm-map.json');

    try {
        await require('./transformator')(
            { pages, links },
            id => require(`${tmp_dir}/${id}.json`),
            async (page, data) => {
                await save(
                    `${tmp_dir}/app/${data.type}/${data.name}.json`,
                    data,
                );
            },
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
