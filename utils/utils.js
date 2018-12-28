
function safeValue(value) {
  if (!value) {
    return ""
  }
  return value
}

function paddingZero(num, size) {
  var s = num+ "";
  var count = size - s.length
  for(i = 0; i < count; i++) {
    s = "0" + s;
  }
  // print("enter padding_zero, ret:", s)
  return s;
}

module.exports= {
  safeValue,
  paddingZero
}