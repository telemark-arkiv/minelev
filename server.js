'use strict'

var Hapi = require('hapi')
var Hoek = require('hoek')
var server = new Hapi.Server()
var config = require('./config')
var louieService = require('./index')
var validate = require('./lib/validateJWT')
var yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.COOKIE_SECRET,
    isSecure: true
  }
}

server.connection({
  port: config.SERVER_PORT_WEB
})

server.register(require('vision'), function (err) {
  Hoek.assert(!err, err)

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    helpersPath: 'views/helpers',
    partialsPath: 'views/partials',
    layoutPath: 'views/layouts',
    layout: true,
    compileMode: 'sync'
  })
})

server.register(require('inert'), function (err) {
  if (err) {
    throw err
  }
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    },
    config: {
      auth: false
    }
  })
})

server.register([
  {
    register: louieService,
    options: {}
  }
], function (err) {
  if (err) {
    console.error('Failed to load a plugin:', err)
  }
})

server.register(require('hapi-auth-cookie'), function (err) {
  if (err) {
    console.error('Failed to load a plugin: ', err)
  }

  server.auth.strategy('session', 'cookie', {
    password: config.COOKIE_SECRET,
    cookie: 'louie-session',
    validateFunc: validate,
    redirectTo: '/login',
    isSecure: false
  })

  server.auth.default('session')
})

server.register({
  register: require('yar'),
  options: yarOptions
}, function (err) {
  console.error('Failed to load a plugin: yar ', err)
})

function startServer () {
  server.start(function () {
    console.log('Server running at:', server.info.uri)
  })
}

function stopServer () {
  server.stop(function () {
    console.log('Server stopped')
  })
}

module.exports.start = startServer

module.exports.stop = stopServer
