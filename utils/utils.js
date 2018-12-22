
function safeValue(value) {
  if (!value) {
    return ""
  }
  return value
}

module.exports= {
  safeValue
}
