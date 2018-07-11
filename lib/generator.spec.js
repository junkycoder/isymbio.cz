const tap = require('tap');
const { getTemplateData } = require('./generator');

tap.test('Always returns object', test => {
    test.ok(getTemplateData());
    test.ok(getTemplateData('./'));
    test.ok(getTemplateData(null));
    test.end();
});
