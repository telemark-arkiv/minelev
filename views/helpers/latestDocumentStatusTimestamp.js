'use strict'

var formatDate = require('./formatDate')

module.exports = function (statuses) {
  var latest = statuses[statuses.length - 1]
  if (latest) {
    return formatDate(latest.timeStamp)
  } else {
    return ''
  }
}
