const TTS = require('../utils/tts')
const config = require('../config')
const simplify = require('../utils/simplifier')
const logger = require('../utils/logger').logger('gateway');
const pt = require('promise-timeout');
const fs = require('fs');
const USER_CTX = require("../module/user_context.js")
const CONTEXT = require("../arango/context.js")
const PARROT = require("../arango/parrot.js")
const LEARNING = require("../arango/learning.js")

function build_tts_path(parrot, relation) {
  var subPath = '/tts/v1/parrot/'
  var dir = 'static' + subPath
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  if (parrot) {
    subPath = subPath + parrot + '/'
    dir = 'static' + subPath
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    if (relation) {
      subPath = subPath + relation + '/'
      dir = 'static' + subPath
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }  
    }
  }
  return subPath
}

function getTtsResult(parrot, relation, text, speed, role, pit, vol) {
  var path = build_tts_path(parrot, relation)
  return new Promise((resolve, reject) =>{
    pt.timeout(TTS.getAudio(text, speed, role, pit, vol, 'static' + path), 1000)
      .then((result) => {
        resolve(config.homeUrl + path +  result)
      })
      .catch((err) => {
        resolve('https://www.xiaodamp.cn/resource/audio/parrot/parrot-default.mp3')
      })
  })
}

function convert_to_openId(userId){
  var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
  return openId
}

const apiHandle = async (req) => {
  const userId = convert_to_openId(req.userId);
  const api = req.api;
  const params = req.arguments;
  let result = null;
  if (!api || !params) {
    return {
      status : {code : 200, errorType : 'success'},
      result : result
    };
  }
  switch(api) {
    case 'get-simplifier-result':
      result = await simplify(params.query);
      break;
    case 'get-text-tts':
      result = await getTtsResult(params.parrot, params.relation, params.text, params.speed, params.role, params.pit, params.vol)
      break;
    case 'user-login':
      result = await USER_CTX.userLogin(params.source, userId)
      break;
    case 'adopt-newborn-parrot':
      result = await CONTEXT.adoptNewBornParrot(params.uuid)
      break;
    case 'start-learning':
      result = await USER_CTX.startLearning(params.user)
      break;
    case 'end-learning':
      result = await USER_CTX.endLearning(params.user, params.uuid)
      break;
    case 'add-sentence':
      result = await USER_CTX.addSentence(params.user, params.learningId, params.userSay, params.userMedia, params.parrotUrl)
      break;
    case 'query-sentences':
      result = await USER_CTX.querySentences(params.relation, params.day)
      break;
    case 'get-sentence-count':
      result = await LEARNING.getSentencesCount(params.relation)
      break;
    case 'get-parrot-info':
      result = await PARROT.getParrotInfo(params.uuid)
      break;
    case 'update-parrot-name':
      result = await PARROT.updateParrotName(params.uuid, params.name)
      break;
    default:
      result = 'unknown gateway api : ' + api;
      logger.error(result);
  }
  return {
    status : {code : 200, errorType : 'success'},
    result : result
  };
};

const gatewayApi = async (ctx) => {
  try {
    const req = ctx.request.body;
    logger.debug(`receive gateway request : ${JSON.stringify(req)}`);
    const rsp = await apiHandle(req);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = rsp;
  } catch(err) {
    ctx.response.status = 404;
    logger.error('gateway api error: ' + err);
    logger.debug(err.stack);
  }
};

module.exports = {
  'POST /gateway' : gatewayApi
}



