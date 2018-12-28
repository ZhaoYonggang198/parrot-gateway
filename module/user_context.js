
const logger = require('../utils/logger').logger('user_context');
const USER = require("../arango/user.js")
const LEARNING = require("../arango/learning.js")
const PARROT = require("../arango/parrot.js")
const RELATION = require("../arango/relation.js")

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
  return await LEARNING.addSentence(learningId, userSay, userMedia, parrotUrl)

}

async function userLogin(source, userId) {
  return  await USER.userLogin(source, userId)
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
