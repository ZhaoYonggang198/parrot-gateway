var arango = require('arangojs');
var config = require('../config')
const logger = require('../utils/logger').logger('arangoDb');
var db = null 
const  userIdsCollection = "userIds"
const dataBaseName = "parrot"

function getDb(){
    logger.info("read config ", JSON.stringify(config))
    if(db == null){
        Database = arango.Database;
        db = new Database(`http://${config.arangoHost}:${config.arangoPort}`);
        db.useDatabase(dataBaseName);
        db.useBasicAuth(config.arangoUser, config.arangoPassword)
        logger.info("arango db init success")
    }
    return db
}

async function addNewUser(source, id){
    var collection = db.collection(userIdsCollection)
    var user = {}
    //此处主要为了解决和遗留数据的兼容问题，所以名字不统一
    user.source = source
    user.id = id
    await collection.save(user).then(
        meta => { logger.info('add new user  saved:', meta._key); return meta._key },
        err => { logger.error('Failed to add new user', err); return "" }
    );
}

//////////////////////////////////////////////////////////////////
async function queryDocs(aql){
    logger.info("qery aql is: ", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(docs => {
        return docs
    },
    err => {
        logger.error('Failed to fetch agent document:')
        return []
    })
}


//////////////////////////////////////////////////////////////////
async function querySingleDoc(aql){
    logger.info("query aql is: ", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(docs => {
        if(docs.length == 0){
            return null
        }else{
            return docs[0]
        }
    },
    err => {
        logger.info('fetch no document:')
        return null
    })
}

//////////////////////////////////////////////////////////////////
async function saveDoc(collectionName, doc){
    var collection  = db.collection(collectionName)
    return await collection.save(doc).then(
        meta => { logger.info('Document saved:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
    );
}

//////////////////////////////////////////////////////////////////
async function updateDoc(aql){
    logger.info("update aql is :", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(result => {
        logger.info(`update doc success`)
        return true
    },
    err => {
        logger.error('Failed to update doc')
        return false
    })
}

module.exports={
    getDb,
    querySingleDoc,
    updateDoc,
    queryDocs,
    saveDoc
}
