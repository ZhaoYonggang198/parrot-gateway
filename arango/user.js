const ARANGO = require("./arango.js")
const RELATION = require("./relation.js")
const DATE = require('../utils/date-time.js');
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
async function userLogin(source, userId) {
  logger.debug('userLogin:')
  let aql = `UPSERT { source: '${source}', userId: '${userId}' } 
  INSERT { 
    source       : '${source}', 
    userId       : '${userId}', 
    relations    : [],
    registration : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy'), 
    lastLogin    : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') 
  } 
  UPDATE { lastLogin : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') } IN '${userIdsCollection}'
  RETURN { doc : NEW }
  `
  let docs = await ARANGO.queryDocs(aql)
  if (docs === null || docs.length === 0) {
    return { uuid : '', relation : '', parrot : '' }
  }
  var user = docs[0].doc
  var relation = ''

  await recordUserLogin(user._key)
  if (user.relations && user.relations.length > 0) {
    relation = user.relations[0]
  }
  let parrot = user.parrot ? user.parrot : ''
  return { uuid : user._key, relation : relation, parrot : parrot }
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

module.exports= {
  userLogin,
  getLastLoginDay,
  fetchUser,
  available,
  fetchLastRelation
}
