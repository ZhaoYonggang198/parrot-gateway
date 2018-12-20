const ARANGO = require("./arango.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('userDB');

const db = ARANGO.getDb() 
const learningCollection = "user"

module.exports= {
  // startLearning,
  // endLearning,
  // addSentence
}
