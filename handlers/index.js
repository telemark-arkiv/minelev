'use strict'

var mongojs = require('mongojs')
var Wreck = require('wreck')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var dbqueue = mongojs(config.DB_CONNECTION_QUEUE)
var logs = dblog.collection('logs')
var queue = dbqueue.collection('queue')
var pkg = require('../package.json')
var prepareWarning = require('../lib/prepare-warning')
var order = require('../lib/categories-order')
var behaviour = require('../lib/categories-behaviour')
var warningTypes = require('../lib/categories-warnings')
var wreckOptions = {
  json: true
}

function filterWarningTypes (contactTeacher) {
  var filteredList = []
  warningTypes.forEach(function (type) {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

function getFrontpage (request, reply) {
  logs.find({'userId': request.auth.credentials.data.userId}).sort({timeStamp: -1}).limit(20, function (error, data) {
    if (error) {
      console.error(error)
    }
    var viewOptions = {
      version: pkg.version,
      versionName: pkg.louie.versionName,
      versionVideoUrl: pkg.louie.versionVideoUrl,
      systemName: pkg.louie.systemName,
      githubUrl: pkg.repository.url,
      credentials: request.auth.credentials,
      logs: data || []
    }
    reply.view('index', viewOptions)
  })
}

function getLogspage (request, reply) {
  var query = {}
  if (request.query.studentId) {
    query.studentId = request.query.studentId
  } else {
    query.userId = request.auth.credentials.data.userId
  }

  logs.find(query).sort({timeStamp: -1}, function (error, data) {
    if (error) {
      console.error(error)
    }
    var viewOptions = {
      version: pkg.version,
      versionName: pkg.louie.versionName,
      versionVideoUrl: pkg.louie.versionVideoUrl,
      systemName: pkg.louie.systemName,
      githubUrl: pkg.repository.url,
      credentials: request.auth.credentials,
      logs: data
    }
    reply.view('logs', viewOptions)
  })
}

function getHelppage (request, reply) {
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials
  }
  reply.view('help', viewOptions)
}

function showLogin (request, reply) {
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }
  reply.view('login', viewOptions, {layout: 'layout-login'})
}

function doLogin (request, reply) {
  var jwt = require('jsonwebtoken')
  var payload = request.payload
  var username = payload.username
  var password = payload.password
  var LdapAuth = require('ldapauth-fork')
  var auth = new LdapAuth(config.LDAP)

  auth.authenticate(username, password, function (err, user) {
    if (err) {
      console.error(JSON.stringify(err))
      if (err.name) {
        var viewOptions = {
          version: pkg.version,
          versionName: pkg.louie.versionName,
          versionVideoUrl: pkg.louie.versionVideoUrl,
          systemName: pkg.louie.systemName,
          githubUrl: pkg.repository.url,
          loginErrorMessage: err.name
        }
        reply.view('login', viewOptions, {layout: 'layout-login'})
      }
    } else {
      var tokenOptions = {
        expiresIn: '1h',
        issuer: 'https://auth.t-fk.no'
      }
      var data = {
        cn: user.cn,
        userId: user.sAMAccountName || ''
      }
      var token = jwt.sign(data, config.JWT_SECRET, tokenOptions)
      request.cookieAuth.set({
        token: token,
        isAuthenticated: true,
        data: data
      })
      auth.close(function (err) {
        if (err) {
          console.error(err)
        }
      })
      reply.redirect('/')
    }
  })
}

/*
// For local testing
function doLogin (request, reply) {
  var jwt = require('jsonwebtoken')
  var payload = request.payload
  var username = payload.username
  // var password = payload.password
  var user = {
    cn: username,
    userId: username
  }
  var tokenOptions = {
    expiresIn: '1h',
    issuer: 'https://auth.t-fk.no'
  }
  var token = jwt.sign(user, config.JWT_SECRET, tokenOptions)
  request.cookieAuth.set({
    token: token,
    isAuthenticated: true,
    data: user
  })

  reply.redirect('/')
}
*/

function doLogout (request, reply) {
  request.cookieAuth.clear()
  reply.redirect('/')
}

function doSearch (request, reply) {
  var data = request.payload
  var searchText = data.searchText
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    searchText: searchText
  }
  // var searchUrl = config.BUDDY_API_URL + '/users/' + request.auth.credentials.data.userId + '/search/'
  var searchUrl = config.BUDDY_API_URL + '/users/nila/search/'
  wreckOptions.headers = {
    Authorization: request.auth.credentials.token
  }

  Wreck.get(searchUrl + searchText, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      viewOptions.students = payload
      request.yar.set('searchResults', payload)
      reply.view('search-results', viewOptions)
    }
  })
}

/*
// For local testing
function doSearch (request, reply) {
  var students = require('../test/data/students')
  var data = request.payload
  var searchText = data.searchText
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    students: students,
    searchText: searchText
  }
 request.yar.set('searchResults', students)
 reply.view('search-results', viewOptions)
}
*/

function writeWarning (request, reply) {
  var studentID = request.params.studentID
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    order: order,
    behaviour: behaviour
  }
  var searchUrl = config.BUDDY_API_URL + '/users/' + request.auth.credentials.data.userId + '/students/'
  wreckOptions.headers = {
    Authorization: request.auth.credentials.token
  }

  Wreck.get(searchUrl + studentID, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      var student = payload[0]
      viewOptions.student = student
      viewOptions.warningTypes = filterWarningTypes(student.contactTeacher)
      reply.view('warning', viewOptions)
    }
  })
}

function submitWarning (request, reply) {
  var user = request.auth.credentials.data
  var data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.cn
  var postData = prepareWarning(data)
  queue.save(postData, function (error, doc) {
    if (error) {
      console.error(error)
    } else {
      postData.documentId = doc._id.toString()
      postData.documentStatus = [
        {
          timeStamp: new Date().getTime(),
          status: 'I kø'
        }
      ]
      logs.save(postData)
      reply.redirect('/')
    }
  })
}

module.exports.getFrontpage = getFrontpage

module.exports.getLogspage = getLogspage

module.exports.getHelppage = getHelppage

module.exports.showLogin = showLogin

module.exports.doLogin = doLogin

module.exports.doLogout = doLogout

module.exports.doSearch = doSearch

module.exports.writeWarning = writeWarning

module.exports.submitWarning = submitWarning
