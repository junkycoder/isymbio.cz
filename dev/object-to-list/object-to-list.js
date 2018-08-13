const debug = require('debug')('isymbio:dev:object-to-list');
const save = require('../lib/save');

module.exports = async function(obj_file, list_file) {
    try {
        const object = require(obj_file);
        const list = Object.keys(object).map(key => object[key]);
        await save(list_file, list);
    } catch (error) {
        debug('Error:\n', error);
    }
};
