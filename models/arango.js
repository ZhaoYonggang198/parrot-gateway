const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('arango');

const  userIdsCollection = "userIds"
const  userLoginCollection = "userLoginEvent"

//////////////////////////////////////////////////////////////////
async function isNewUser(source, userId) {
    var user = await getUser(source, userId)
    return user === null
}

//////////////////////////////////////////////////////////////////
async function getUser(source, userId) {
    var aql = `FOR doc IN ${userIdsCollection} filter doc.source =='${source}' and  doc.id == '${id}' return doc}`
    logger.info('execute aql', aql)
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function userLogin(source, userId) {
    var user = await getUser(source, userId)
    var key = ''
    if (user === null) {
        key = await addUser(source, userId)
    }
    user.lastLoginTime = getlocalDateString()
    var collection = db.collection(userIdsCollection)
    var key = await collection.update(user._key, bindingInfo).then(
        meta => { logger.info('update binding user success:', meta._key); return meta._key },
        err => { logger.error('Failed to binding user:', err); return "" }
    )
    recordUserLogin(source, userId)
    return  key
}

//////////////////////////////////////////////////////////////////
async function addUser(source, userId) {
    var collection = db.collection(userIdsCollection)
    var doc = buildUserDoc(source, userId)
    var key = await collection.save(doc).then(
        meta => { logger.info('new user added:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
    );
    return  key
}

//////////////////////////////////////////////////////////////////
function buildUserDoc(source, userId) {
    var doc = {}
    doc.source = source
    doc.userId = userId
    doc.registrationTime = getlocalDateString()
    doc.lastLoginTime = getlocalDateString()
    return doc
}

//////////////////////////////////////////////////////////////////
function buildUserLoginDoc(source, userId) {
    var doc = {}
    doc.source = source
    doc.userId = userId
    doc.loginTime = getlocalDateString()
    return doc
}

//////////////////////////////////////////////////////////////////
function getlocalDateString(){
    var myDate = new Date()
    return myDate.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
async function recordUserLogin(source, userId) {
    var collection = db.collection(userLoginCollection)
    var doc = buildUserLoginDoc(source, userId)
    var key = await collection.save(doc).then(
        meta => { logger.info('new user added:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
    );
    return  key
}

module.exports={
    isNewUser,
    userLogin
}
