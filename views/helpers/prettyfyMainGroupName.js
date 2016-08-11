'use strict'

module.exports = function (mainGroupName) {
  const list = mainGroupName.split(':')
  return list.length === 2 ? list[1] : mainGroupName
}
