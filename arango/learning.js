const ARANGO = require("./arango.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('userDB');

const db = ARANGO.getDb() 
const collectionName = "learning"

async function startLearning(user, parrot, relation) {
  var doc = {
    user : user,
    parrot : parrot,
    relation : relation,
    startDay : DATE.getLocalDate(),
    startTime : DATE.getLocalTime(),
    sentences : []
  }
  return await ARANGO.saveDoc(collectionName, doc)
}

async function endLearning(uuid) {
  var doc = {
    endDay : DATE.getLocalDate(),
    endTime : DATE.getLocalTime()
  }
  return await ARANGO.updateDoc(collectionName, uuid, doc)
}

async function addSentence(uuid, userSay, userMedia, parrotUrl) {
  var doc = await ARANGO.fetchDoc(collectionName, uuid)
  if (!doc) {
    logger.error('addSentence, doc not found:', uuid)
    return false
  }
  var item = {
    userSay : userSay,
    userMedia : userMedia,
    parrotUrl : parrotUrl
  }
  if (!doc.sentences) {
    doc.sentences = []
  }
  doc.sentences.unshift(item)
  return await ARANGO.updateDoc(collectionName, uuid, doc)
}

module.exports= {
  startLearning,
  endLearning,
  addSentence
}
