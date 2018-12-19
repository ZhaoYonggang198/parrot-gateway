const ARANGO = require("./arango.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('userArango');

const db = ARANGO.getDb() 
const  userIdsCollection = "userIds"
const  userLoginCollection = "userLoginEvent"

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
    var aql = `UPSERT { source: '${source}', userId: '${userId}' } 
    INSERT { source: '${source}', userId: '${userId}', registration :  DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy'), lastLogin : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') } 
    UPDATE { lastLogin : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') } IN '${userIdsCollection}'
    RETURN { doc : NEW }
    `
    let docs = await ARANGO.queryDocs(aql)
    if (docs === null || docs.length === 0) {
        return { uuid : '', relationship : '', parrot : '' }
    }
    let user = docs[0].doc
    await recordUserLogin(user._key)
    let relationship = user.relationship ? user.relationship : ''
    let parrot = user.parrot ? user.parrot : ''
    return { uuid : user._key, relationship : relationship, parrot : parrot }
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
async function adoptNewBornParrot(id) {
  return null
}

module.exports= {
    userLogin,
    getLastLoginDay,
    adoptNewBornParrot
}
