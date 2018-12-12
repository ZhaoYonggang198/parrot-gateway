const TTS = require('../utils/tts')
const config = require('../config')
const simplify = require('../utils/simplifier')
const logger = require('../utils/logger').logger('gateway');
const pt = require('promise-timeout');

function getTtsResult(text, speed, role, pit, vol) {
    var path = 'static/tts/v1/'
    return new Promise((resolve, reject) =>{
        pt.timeout(TTS.getAudio(text, speed, role, pit, vol, path), 1000)
            .then((result) => {
                resolve(config.homeUrl + '/tts/v1/' +  result)
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
    switch(api) {
        case 'get-simplifier-result':
            result = await simplify(params.query);
            break;
        case 'get-text-tts':
            result = await getTtsResult(params.text, params.speed, params.role, params.pit, params.vol)
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