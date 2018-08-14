const debug = require('debug')('isymbio:dev:generator');
const save = require('../../lib/save');

const tmp_dir = __dirname + '/../../tmp';

(async () => {
    try {
        await require('./permalinker')(tmp_dir + '/app', async data => {
            await save(tmp_dir + '/isymbio-links-transorm-map.json', data);
        });
    } catch (error) {
        debug('Error:\n', error);
    }
})();
