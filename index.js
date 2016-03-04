'use strict'

var routes = require('./routes')
var feedback = require('./routes/feedback')

exports.register = function (server, options, next) {
  server.route(routes)
  server.route(feedback)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
