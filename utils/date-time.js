const UTILS = require("./utils.js") 
const logger = require('./logger').logger('date_time');
//////////////////////////////////////////////////////////////////
function getLocalDate() {
    var date = new Date()
    var result = date.getFullYear() + '-' + UTILS.paddingZero(date.getMonth() + 1, 2) + '-' 
            + UTILS.paddingZero(date.getDate(), 2)
    return result
}

//////////////////////////////////////////////////////////////////
function getLocalTime() {
    var date = new Date()
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12:false});
}

function getDaysElapsed(date) {
  if (!date) {
    return 0
  }
  logger.info('getDaysElapsed, input: ', date)
  const ms_perday = 3600 * 24 *1000
  var values = date.split('-')
  if (values.length !== 3) {
      logger.error('wrong date format:', date)
      return 0
  }
  for (var i = 0; i < 3; i++) {
      if (values[i][0] === '0') {
        values[i] = values[i].substring(1)
      }
  }
  var day = new Date()
  day.setFullYear(values[0], values[1] - 1, values[2])
  var today = new Date()
  var diff = today - day
  logger.info('getDaysElapsed, input day: ', day)
  logger.info('getDaysElapsed, input: ', Math.floor(diff/ms_perday))
  return Math.floor(diff/ms_perday)
}

//////////////////////////////////////////////////////////////////
function updateKeepLoginDays(keepLoginDays, lastLoginDay) {
    logger.info('############ enter updateKeepLoginDays')
    var days = getDaysElapsed(lastLoginDay)
    if (days == 1) {
        return keepLoginDays + 1
    }
    if (days == 0) {
        return keepLoginDays
    }
    return 1
}

module.exports= {
    getLocalDate,
    getLocalTime,
    getDaysElapsed,
    updateKeepLoginDays
}
