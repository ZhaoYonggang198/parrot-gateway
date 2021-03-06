const ARANGO = require("./arango.js")
const RELATION = require("./relation.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('parrotDB');
const UTILS = require('../utils/utils.js')
const db = ARANGO.getDb() 
const collectionName = "parrot"
const intiIntimateScore = 100

//////////////////////////////////////////////////////////////////
async function deliverNewParrot() {
  let doc = {}
  doc.birthday = DATE.getLocalDate()
  doc.relations = []
  return await ARANGO.saveDoc(collectionName, doc)
}

//////////////////////////////////////////////////////////////////
async function fetchParrot(key) {
  return await ARANGO.fetchDoc(collectionName, key)
}

//////////////////////////////////////////////////////////////////
async function getParrotInfo(key) {
  var parrot = await ARANGO.fetchDoc(collectionName, key)
  if (!parrot) {
    return {}
  }
  return {
    name      : UTILS.safeValue(parrot.name),
    gender    : UTILS.safeValue(parrot.gender),
    birthday  : UTILS.safeValue(parrot.birthday)
  }
}

//////////////////////////////////////////////////////////////////
async function updateParrotName(key, name) {
  if (!key || !name) {
    return false
  }
  let doc = {
    name : name
  }
  return await ARANGO.updateDoc(collectionName, key, doc)
}

//////////////////////////////////////////////////////////////////
async function available(parrot) {
  if(!parrot.relations) {
    return true
  }
  if (parrot.relations.length === 0) {
    return true
  }
  let relation = await RELATION.fetchRelation(parrot.relations[0])
  if (!relation) {
    return false
  }
  return !relation.valid
}

// //////////////////////////////////////////////////////////////////
// async function updateRelation() {
//   let parrot = await ARANGO.fetchDoc(collectionName, key)
//   if (!parrot) {
//     return false
//   }
//   doc.birthday = DATE.getLocalDate()
//   doc.relations = []
//   return await ARANGO.saveDoc(collectionName, doc)
// }

module.exports= {
  deliverNewParrot,
  fetchParrot,
  available,
  getParrotInfo,
  updateParrotName
}
