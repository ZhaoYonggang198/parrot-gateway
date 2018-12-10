const TTS = require('../utils/tts')
const config = require('../config')
const simplify = require('../utils/simplifier')
const logger = require('../utils/logger').logger('gateway');

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
            var path = 'static/tts/v1/'
            result = await TTS.getAudio(params.text, params.speed, params.role, params.pit, params.vol, path)
            result = config.homeUrl + '/tts/v1/' +  result
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