const debug = require('debug')('isymbio:dev:generator');
const save = require('../../lib/save');

const tmp_dir = __dirname + '/../../tmp';

(async () => {
    try {
        await require('./downloader')(tmp_dir + '/app', async data => {
            await save(
                tmp_dir + '/isymbio-files-to-download',
                data.reduce((file, line) => file + '\n' + line, ''),
            );
        });
    } catch (error) {
        debug('Error:\n', error);
    }
})();
