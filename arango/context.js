const ARANGO = require("./arango.js")
const RELATION = require("./relation.js")
const USER = require("./user.js")
const PARROT = require("./parrot.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('contextDB');

const db = ARANGO.getDb() 
const parrotCollection = "parrot"
const userCollection = "user"
const relationCollection = "relation"

//TODO, should invoke transaction
async function buildRelation(userId, parrotId) {
  var relationKey = await RELATION.buildRelation(userId, parrotId)
  var parrotAvailable = await PARROT.available(parrotId)
  var userAvailable = await USER.available(userId)
  if (!parrotAvailable || !userAvailable) {
    return
  }
  var parrot = await PARROT.fetchParrot(parrotId)
  var user = await USER.fetchUser(userId)
  if (parrot) {
    logger.info('buildRelation, parrot', JSON.stringify(parrot))
  }
  if (user) {
    logger.info('buildRelation, user', JSON.stringify(user))
  }

  // push at the beginning
  parrot.relations.unshift(relationKey);
  ARANGO.updateDoc(parrotCollection, parrotId, parrot)

  // push at the beginning
  user.relations.unshift(relationKey);
  ARANGO.updateDoc(userCollection, userId, user)
}

async function adoptNewBornParrot(userId) {
  let parrotId = await PARROT.deliverNewParrot()
  logger.info('adoptNewBornParrot, parrot:', parrotId)
  logger.info('adoptNewBornParrot, user:', userId)
  await buildRelation(userId, parrotId)
  return true
}

module.exports= {
  adoptNewBornParrot
}