const logger = require('../utils/logger').logger('score');
const DATE = require('../utils/date-time.js')
//////////////////////////////////////////////////////////////////
const  loginScoreRule =
[
  { 
    start  : 0,
    end    : 6,
    score  : 10
  }, 
  {  
    start  : 7,
    end    : 20,
    score  : 20
  }, 
  {  
    start  : 21,
    end    : 100000,
    score  : 30
  }
]

const absencePunishRule = 
[
  { 
    start   : 0,
    end     : 2,
    score   : 0
  },
  { 
    start   : 3,
    end     : 6,
    score   : 5
  },
  { 
    start    : 7,
    end      : 20,
    score    : 10
  },
  { 
    start    : 21,
    end      : 100000,
    score    : 20
  }
]


//////////////////////////////////////////////////////////////////
function getScoreByRule(rules, dayCount) {
  var matchRules = rules.filter( rule => {
    return rule.start <= dayCount && rule.end >= dayCount
  })
  if ( matchRules.length === 0) {
    logger.error('no rule item defined for day count:', dayCount)
    return 10
  }
  return matchRules[0].score
}

//////////////////////////////////////////////////////////////////
function getSentenceScore() {
  return 1
}

//////////////////////////////////////////////////////////////////
function getLoginScore(previousLogin, keepLoginDays) {
  var score = 0
  if (keepLoginDays > 1) {
     return getScoreByRule(loginScoreRule, keepLoginDays)
  }
  var days = DATE.getDaysElapsed(previousLogin)
  return getScoreByRule(loginScoreRule, 1) - getScoreByRule(absencePunishRule, days)
}

module.exports = {
  getLoginScore,
  getSentenceScore
}
