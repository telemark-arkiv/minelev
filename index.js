'use strict'

var routes = require('./routes')
var feedback = require('./routes/feedback')
var stats = require('./routes/stats')

exports.register = function (server, options, next) {
  server.route(routes)
  server.route(feedback)
  server.route(stats)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
