const ARANGO = require("./arango.js")
const RELATION = require("./relation.js")
const DATE = require('../utils/date-time.js');
const UTILS = require('../utils/utils.js');
const logger = require('../utils/logger').logger('userDB');

const db = ARANGO.getDb() 
const userIdsCollection = "user"
const userLoginCollection = "userLogin"

//////////////////////////////////////////////////////////////////
async function getLastLoginDay(key) {
  var doc = await ARANGO.fetchDoc(key)
  if (doc === null) {
    logger.error('getLastLoginDay, failed to fetch doc')  
    return getlocalDateString()
  }
  return doc.lastLoginDay
}

//////////////////////////////////////////////////////////////////
function buildUserKey(source, userId) {
  return source + '__' + userId
}
//////////////////////////////////////////////////////////////////
async function userLogin(source, userId) {
  logger.debug('userLogin:')
  if (!source || !userId) {
    return {}
  }
  var key = buildUserKey(source, userId)
  logger.info("user login, _key:", key)
  let aql = `UPSERT { _key : '${key}' } 
  INSERT { 
    _key         : '${key}',
    source       : '${source}', 
    userId       : '${userId}', 
    relations    : [],
    keepLoginDays : 1,
    registration : DATE_FORMAT(DATE_NOW(), '%yyyy-%mm-%dd'), 
    lastLogin    : DATE_FORMAT(DATE_NOW(), '%yyyy-%mm-%dd') 
  } 
  UPDATE { lastLogin : DATE_FORMAT(DATE_NOW(), '%yyyy-%mm-%dd') } IN '${userIdsCollection}'
  RETURN {  user : NEW , lastLogin : OLD.lastLogin }
  `
  let docs = await ARANGO.queryDocs(aql)
  if (docs === null || docs.length === 0) {
    return { uuid : '', relation : '', parrot : '' }
  }
  var user = docs[0].user
  var lastLogin = docs[0].lastLogin
  var relation = ''

  //TODO
  var days = DATE.updateKeepLoginDays(user.keepLoginDays, lastLogin)
  await updateKeepLoginDays(user._key, days)
  await recordUserLogin(user._key)
  
  if (user.relations && user.relations.length > 0) {
    relation = user.relations[0]
  }
  logger.info('user login, keepLoginDays:', days)
  return { 
          uuid : user._key, 
          relation : relation, 
          parrot : UTILS.safeValue(user.parrot), 
          previousLogin : lastLogin, 
          keepLoginDays : days
        }
}


//////////////////////////////////////////////////////////////////
async function recordUserLogin(id) {
  let doc = {}
  doc.user = id
  doc.loginDay = DATE.getLocalDate()
  doc.loginTime = DATE.getLocalTime()
  await ARANGO.saveDoc(userLoginCollection, doc)
}

//////////////////////////////////////////////////////////////////
async function fetchUser(key) {
  return await ARANGO.fetchDoc(userIdsCollection, key)
}

//////////////////////////////////////////////////////////////////
async function fetchLastRelation(user) {
  if(!user.relations) {
    return {}
  }
  if (user.relations.length === 0) {
    return {}
  }
  var relation = await RELATION.fetchRelation(user.relations[0])
  if (!relation) {
    return {}
  }
  return relation
}

//////////////////////////////////////////////////////////////////
async function available(user) {
  logger.info('user available, user:', JSON.stringify(user))
  if(!user.relations) {
    return true
  }
  if (user.relations.length === 0) {
    return true
  }
  let relation = await RELATION.fetchRelation(user.relations[0])
  if (!relation) {
    return false
  }
  logger.info('user available， relation:', JSON.stringify(relation))
  return relation.valid != true
}

//////////////////////////////////////////////////////////////////
async function updateKeepLoginDays(uuid, days) {
  logger.info('updateKeepLoginDays:', days)
  if (!uuid || !days) {
    return false
  }
  let doc = {
    keepLoginDays : days
  }
  return await ARANGO.updateDoc(userIdsCollection, uuid, doc)
}

module.exports= {
  userLogin,
  getLastLoginDay,
  fetchUser,
  available,
  fetchLastRelation
}
