
const logger = require('../utils/logger').logger('user_context');
const DATE = require('../utils/date-time.js')
const USER = require("../arango/user.js")
const LEARNING = require("../arango/learning.js")
const PARROT = require("../arango/parrot.js")
const RELATION = require("../arango/relation.js")
const INTIMATE = require("./intimate_score.js")

async function startLearning(info) {
  var id =  await LEARNING.startLearning(info.uuid, info.parrot, info.relation)
  if (!id) {
    id = ""
  }
  return { learningId : id }
}

async function endLearning(info, uuid) {
  return await LEARNING.endLearning(uuid)
}

async function addSentence(info, learningId, userSay, userMedia, parrotUrl) {
  await LEARNING.addSentence(learningId, userSay, userMedia, parrotUrl)
  if (!info || !info.relation) {
    logger.error("addSentence, parameter error", info)
    return false
  }
  RELATION.addScore(info.relation, INTIMATE.getSentenceScore())
}

async function userLogin(source, userId) {
  let user = await USER.userLogin(source, userId)
  let score = await INTIMATE.getLoginScore(user.previousLogin, user.keepLoginDays)
  if (user.relation && score != 0) {
    await RELATION.addScore(user.relation, score)
  }
  if (user.relation) {
    var relation = await RELATION.fetchRelation(user.relation)
    user.intimate = relation.intimate
    user.sentenceCount = await LEARNING.getSentencesCount(user.relation)
  }
  logger.info("user login, info:", user)
  return user
}

async function querySentences(relation, day) {
  return await LEARNING.querySentences(relation, day)
}


module.exports = {
  startLearning,
  addSentence,
  endLearning,
  querySentences,
  userLogin
}
