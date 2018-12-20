//////////////////////////////////////////////////////////////////
function getLocalDate() {
    var date = new Date()
    return date.toLocaleDateString()
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
