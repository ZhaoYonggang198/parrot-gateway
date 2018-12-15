const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('arango');

const  userIdsCollection = "userIds"
const  userLoginCollection = "userLoginEvent"


//////////////////////////////////////////////////////////////////
async function hasUser(source, userId) {
    var aql = `FOR doc IN ${userIdsCollection} filter doc.source =='${source}' and  doc.userId == '${userId}' return doc`
    logger.info('execute aql', aql)
    var user =  await arangoDb.querySingleDoc(aql)
    return user != null
}

//////////////////////////////////////////////////////////////////
async function getLastLoginDay(source, userId) {
    var aql = `FOR doc IN ${userIdsCollection} filter doc.source =='${source}' and  doc.userId == '${userId}' return doc`
    logger.info('execute aql', aql)
    var user =  await arangoDb.querySingleDoc(aql)
    if (user == null) {
        return getlocalDateString()
    }
    return user.lastLoginDay
}

//////////////////////////////////////////////////////////////////
async function userLogin(source, userId) {
    var aql = `UPSERT { source: '${source}', userId: '${userId}' } 
    INSERT { source: '${source}', userId: '${userId}', registrationDay :  DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy'), lastLoginDay : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') } 
    UPDATE { lastLoginDay : DATE_FORMAT(DATE_NOW(), '%m/%d/%yyyy') } IN '${userIdsCollection}'
    `
    await db.query(aql)
    await recordUserLogin(source, userId)
    return  true
}

//////////////////////////////////////////////////////////////////
async function recordUserLogin(source, userId) {
    var aql = ` INSERT { source: '${source}', userId: '${userId}', loginTime : DATE_ISO8601(DATE_NOW()) } 
    IN '${userLoginCollection}'`
    await db.query(aql)
    return true
}

//////////////////////////////////////////////////////////////////
function getlocalDateString() {
    var myDate = new Date()
    return myDate.toLocaleDateString()
}

module.exports={
    hasUser,
    userLogin,
    getLastLoginDay
}
