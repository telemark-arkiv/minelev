'use strict'

module.exports = function (statuses) {
  var latest = statuses[statuses.length - 1]
  return latest.status || ''
}
