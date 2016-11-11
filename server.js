'use strict'

const Chairo = require('chairo')
const Seneca = require('seneca')()
const Hapi = require('hapi')
const Hoek = require('hoek')
const hapiAuthCookie = require('hapi-auth-cookie')
const hapiAuthJwt2 = require('hapi-auth-jwt2')
const server = new Hapi.Server()
const config = require('./config')
const louieService = require('./index')
const validate = require('./lib/validateJWT')
const validateAPI = require('./lib/validateAPI')
const hub = require('./lib/seneca-hub')
const goodOptions = {
  ops: {
    interval: 900000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', ops: '*', error: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.YAR_SECRET,
    isSecure: false
  }
}

const plugins = [
  {register: Chairo, options: {seneca: Seneca}}
]

const authPlugins = [
  {
    register: hapiAuthCookie,
    options: {}
  },
  {
    register: hapiAuthJwt2,
    options: {}
  }
]

function endIfError (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

server.connection({
  port: config.SERVER_PORT_WEB
})

server.register(plugins, function (error) {
  endIfError(error)
})

server.register(authPlugins, function (error) {
  endIfError(error)

  server.auth.strategy('session', 'cookie', {
    password: config.COOKIE_SECRET,
    cookie: 'minelev-session',
    validateFunc: validate,
    redirectTo: '/login',
    isSecure: false
  })

  server.auth.default('session')

  server.auth.strategy('jwt', 'jwt', { key: config.JWT_SECRET,          // Never Share your secret key
      validateFunc: validateAPI,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  })


  server.seneca.use('mesh', {auto: true})

  server.seneca.use(hub, {tag: 'seneca-hub'})

  server.seneca.log.info('hapi', server.info)

  registerRoutes()
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

server.register({
  register: require('yar'),
  options: yarOptions
}, function (err) {
  if (err) {
    console.error('Failed to load a plugin:', err)
  }
})

server.register({
  register: require('good'),
  options: goodOptions
}, function (err) {
  if (err) {
    console.error(err)
  }
})

function registerRoutes () {
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
}

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
