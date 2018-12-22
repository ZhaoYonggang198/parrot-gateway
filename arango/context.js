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
  var parrot = await PARROT.fetchParrot(parrotId)
  var user = await USER.fetchUser(userId)
  var parrotAvailable = await PARROT.available(parrot)
  var userAvailable = await USER.available(user)
  if (!userAvailable) {
    return user.relations[0]
  }
  if (!parrotAvailable) {
    return parrot.relations[0]
  }

  if (parrot) {
    logger.info('buildRelation, parrot', JSON.stringify(parrot))
  }
  if (user) {
    logger.info('buildRelation, user', JSON.stringify(user))
  }

  // push at the beginning
  parrot.relations.unshift(relationKey);
  parrot.master = userId
  await ARANGO.updateDoc(parrotCollection, parrotId, parrot)

  // push at the beginning
  user.relations.unshift(relationKey);
  user.parrot = parrotId
  await ARANGO.updateDoc(userCollection, userId, user)
  return relationKey
}

async function adoptNewBornParrot(userId) {
  let user = await USER.fetchUser(userId)
  let userAvailable = await USER.available(user)
  if (!userAvailable) {
    let relation = await USER.fetchLastRelation(user)
    return {relation : relation._key, parrot : relation.parrot}
  }
  let parrotId = await PARROT.deliverNewParrot()
  if (parrotId === null) {
    return { relation : "", parrot : ""}
  }
  logger.info('adoptNewBornParrot, parrot:', parrotId)
  logger.info('adoptNewBornParrot, user:', userId)
  let key = await buildRelation(userId, parrotId)
  return { relation: key, parrot: parrotId }
}

module.exports= {
  adoptNewBornParrot
}