'use strict'

const routes = require('./routes')
const feedback = require('./routes/feedback')
const stats = require('./routes/stats')
const demo = require('./routes/demo')
const classes = require('./routes/classes')

exports.register = function (server, options, next) {
  server.route(routes)
  server.route(feedback)
  server.route(stats)
  server.route(demo)
  server.route(classes)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
