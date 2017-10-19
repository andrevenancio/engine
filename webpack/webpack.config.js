const pkg = require('../package.json');

const COMPANY = pkg.company;
const NAME = pkg.name;
const PATH_DIST = 'lib';
const PATH_SOURCE = 'src';
const VERSION = JSON.stringify(pkg.version);

module.exports = {
    COMPANY,
    NAME,
    PATH_DIST,
    PATH_SOURCE,
    VERSION,
};
