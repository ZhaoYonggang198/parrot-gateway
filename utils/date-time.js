//////////////////////////////////////////////////////////////////
function getLocalDate() {
    var date = new Date()
    return date.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
function getLocalTime() {
    var date = new Date()
    return date.toLocaleTimeString()
}

module.exports= {
    getLocalDate,
    getLocalTime
}
