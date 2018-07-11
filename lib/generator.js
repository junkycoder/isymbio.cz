const debug = require('debug')('lib:generator');
const fs = require('fs');
const path = require('path');

module.exports.getTemplateData = templateFileName => {
    if (!templateFileName) {
        return {};
    }

    const dataFileName = templateFileName.replace('.hbs', '.json');

    if (!fs.existsSync(dataFileName)) {
        return {};
    }

    debug(`Found data file ${dataFileName}`);
    return require(path.relative(__dirname, dataFileName));
};
