const ARANGO = require("./arango.js")
const RELATION = require("./relation.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('parrotDB');

const db = ARANGO.getDb() 
const collectionName = "parrot"


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
async function available(key) {
  let parrot = await ARANGO.fetchDoc(collectionName, key)
  if(!parrot.relations) {
    return true
  }
  if (parrot.relations.length === 0) {
    return true
  }
  let relation = RELATION.fetchRelation(parrot.relations[0])
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
  available
}
