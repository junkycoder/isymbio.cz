const debug = require('debug')('isymbio:lib:save');
const fs = require('fs-extra');

module.exports = async function save(filename, data) {
    try {
        fs.ensureFileSync(filename);

        if (filename.includes('.json')) {
            fs.writeJsonSync(filename, data, {
                spaces: 2,
            });
            debug('Created JSON file', filename);
        } else {
            console.log(__dirname, filename);
            fs.writeFile(filename, data);
            debug('Created file', filename);
        }
    } catch (error) {
        debug('Can not create JSON file', error);
    }
};
