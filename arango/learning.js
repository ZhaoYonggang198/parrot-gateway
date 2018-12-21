const ARANGO = require("./arango.js")
const DATE = require('../utils/date-time.js');
const logger = require('../utils/logger').logger('learningDB');

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
  if (!uuid) {
    logger.error('addSentence, uuid is null')
    return false
  }
  var doc = await ARANGO.fetchDoc(collectionName, uuid)
  if (!doc) {
    logger.error('addSentence, doc not found:', uuid)
    return false
  }
  var item = {
    userSay : userSay ? userSay : "",
    userMedia : userMedia ? userMedia : "",
    parrotUrl : parrotUrl ? parrotUrl : ""
  }
  if (!doc.sentences) {
    doc.sentences = []
  }
  doc.sentences.unshift(item)
  return await ARANGO.updateDoc(collectionName, uuid, doc)
}

async function querySentences(relation, day) {
  let aql = `for doc in '${collectionName}'
  FILTER doc.relation == ${relation}' && doc.startDay == {day}
  return doc
  `
  let learnings = await ARANGO.queryDocs(aql)
  if (!learnings) {
    return []
  }
  var sentences = []
  var count = learnings.length;
  for (var i = 0; i < count; i++) {
    if (doc[i].sentences) {
      sentences = sentences.concat(doc[i].sentences)
    }
  }
  return sentences
}

module.exports= {
  startLearning,
  endLearning,
  addSentence
}
