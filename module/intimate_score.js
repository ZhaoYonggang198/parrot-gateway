const logger = require('../utils/logger').logger('score');
//////////////////////////////////////////////////////////////////
const  login_score_rule =
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

const absence_punish_rule = 
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
function get_score_by_rule(rules, dayCount) {
  var matchRules = rules.filter( rule => {
        return rule.start <= dayCount && rule.end >= dayCount
      })
  if ( matchRules.length === 0) {
    logger.error('no rule item defined for day count:', dayCount)
    return 10
  }
  return matchRules[0].score
}
