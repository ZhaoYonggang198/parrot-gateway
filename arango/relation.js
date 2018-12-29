const ARANGO = require("./arango.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('parrotDB');

const db = ARANGO.getDb() 
const collectionName = "relation"
const initIntimateScore = 100

//////////////////////////////////////////////////////////////////
async function buildRelation(user, parrot) {
  let doc = {}
  doc.start = DATE.getLocalDate()
  doc.user = user
  doc.parrot = parrot
  doc.valid = true
  doc.intimateScore = initIntimateScore
  return await ARANGO.saveDoc(collectionName, doc)
}

//////////////////////////////////////////////////////////////////
async function fetchRelation(key) {
  logger.info('fetchRelation:', key)
  return await ARANGO.fetchDoc(collectionName, key)
}

//////////////////////////////////////////////////////////////////
async function teardownRelation(key) {
  let doc = await ARANGO.fetchDoc(collectionName, key)
  if (!doc) {
    return true
  }
  doc.valid = false
  doc.end = DATE.getLocalDate()
  return await  ARANGO.updateDoc(collectionName, key, doc)
}


//////////////////////////////////////////////////////////////////
async function addScore(uuid, score) {
  var aql = 
  `LET doc = DOCUMENT("${collectionName}/${uuid}")
    update doc with {
        intimateScore: doc.intimateScore + ${score}
      } 
    in ${collectionName}`
  return await ARANGO.updateDocByAql(aql)
}

module.exports= {
  buildRelation,
  teardownRelation,
  fetchRelation,
  addScore
}
