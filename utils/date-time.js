const UTILS = require("./utils.js") 
//////////////////////////////////////////////////////////////////
function getLocalDate() {
    var date = new Date()
    var result = date.getFullYear() + '-' + UTILS.paddingZero(date.getMonth() + 1, 2) + '-' 
            + UTILS.paddingZero(date.getDate(), 2)
    return result
}

//////////////////////////////////////////////////////////////////
function getLocalTime() {
    var date = new Date()
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12:false});
}

module.exports= {
    getLocalDate,
    getLocalTime
}
