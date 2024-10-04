const debug = require('debug')('app:logger');
function log(req, res, next){
    debug('Getting a request, need logging first...');
    next();
}
module.exports = log;