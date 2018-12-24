const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'dateFile', filename: 'logs/', pattern: 'yyyy-MM-dd.log', alwaysIncludePattern: true}
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' }
  }
});

exports.logger = function(name){
  var logger = log4js.getLogger(name);
  return logger;
};