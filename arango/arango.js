var arangojs = require('arangojs');
var config = require('../config')
const logger = require('../utils/logger').logger('arangoDb');
const dbName = "parrot"
var db = null 

//////////////////////////////////////////////////////////////////
function getDb() {
  if(db == null) {
  logger.info("read config ", JSON.stringify(config))
  Database = arangojs.Database;
  db = new Database(`http://${config.arangoHost}:${config.arangoPort}`);
  db.useDatabase(dbName);
  db.useBasicAuth(config.arangoUser, config.arangoPassword)
  logger.info("arango db init success")
  }
  return db
}

//////////////////////////////////////////////////////////////////
async function saveDoc(collectionName, doc) {
  var collection = getDb().collection(collectionName)
  return await collection.save(doc)
  .then(
  meta => { 
    logger.info('add doc to collection:', collectionName); 
    return meta._key 
  },
  err => { 
    logger.error('Failed to add doc to collectio', err); 
    return null
  }
  );
}

//////////////////////////////////////////////////////////////////
async function updateDoc(collectionName, key, doc) {
  var collection = getDb().collection(collectionName)
  return await collection.update(key, doc)
  .then(
    meta => { 
    logger.info('update doc to collection:', collectionName); 
    return true 
  },
  err => { 
    logger.error('Failed to update doc to collection', err); 
    return false
  }
  );
}

//////////////////////////////////////////////////////////////////
async function fetchDoc(collectionName, key) {
  return await getDb().collection(collectionName).document(key)
  .then(
    doc => { return doc },
    err => {
    console.error('Failed to fetch document:', err)
    return null
  }
  );
}
//////////////////////////////////////////////////////////////////
async function queryDocs(aql) {
  // logger.info("qery aql is: ", aql)
  return await getDb().query(aql).then(cursor => cursor.all())
  .then(
    docs =>  { return docs },
    err => {
      logger.error('Failed to fetch agent document:')
      return []
    }
  );
}

module.exports= {
  getDb,
  saveDoc,
  fetchDoc,
  updateDoc,
  queryDocs
}
