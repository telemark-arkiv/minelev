'use strict'

var fs = require('fs')
var mongojs = require('mongojs')
var getWarningTemplatesPath = require('tfk-saksbehandling-elev-varsel-templates')
var FormData = require('form-data')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var logs = dblog.collection('logs')
var pkg = require('../package.json')
var prepareWarning = require('../lib/prepare-warning')
var prepareWarningPreview = require('../lib/prepare-warning-preview')
const courseCategory = require('../lib/categories-courses')
var order = require('../lib/categories-order')
var behaviour = require('../lib/categories-behaviour')
var warningTypes = require('../lib/categories-warnings')

function filterWarningTypes (contactTeacher) {
  var filteredList = []
  warningTypes.forEach(function (type) {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

module.exports.getFrontpage = (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const myContactClasses = yar.get('myContactClasses') || []
  var mongoQuery = {'userId': userId}

  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
  }
  logs.find(mongoQuery).sort({timeStamp: -1}).limit(40, function (error, data) {
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
      myContactClasses: myContactClasses,
      latestId: request.query.documentAdded,
      logs: data || []
    }
    reply.view('index', viewOptions)
  })
}

module.exports.getLogspage = (request, reply) => {
  const userId = request.auth.credentials.data.userId
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  var mongoQuery = {}
  if (request.query.studentId) {
    mongoQuery.studentId = request.query.studentId
  } else {
    if (myContactClasses.length > 0) {
      const classIds = myContactClasses.map(item => item.Id)
      mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
    } else {
      mongoQuery.userId = userId
    }
  }

  logs.find(mongoQuery).sort({timeStamp: -1}, function (error, data) {
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
      myContactClasses: myContactClasses,
      logs: data
    }
    if (request.query.studentId) {
      reply.view('logs-detailed', viewOptions)
    } else {
      reply.view('logs', viewOptions)
    }
  })
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
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

module.exports.doLogin = (request, reply) => {
  const yar = request.yar
  var jwt = require('jsonwebtoken')
  var payload = request.payload
  var username = payload.username
  var password = payload.password
  const userId = username
  var LdapAuth = require('ldapauth-fork')
  var auth = new LdapAuth(config.LDAP)

  auth.authenticate(username, password, function (err, user) {
    if (err) {
      console.error(JSON.stringify(err))
      if (err.name || /no such user/.test(err)) {
        var viewOptions = {
          version: pkg.version,
          versionName: pkg.louie.versionName,
          versionVideoUrl: pkg.louie.versionVideoUrl,
          systemName: pkg.louie.systemName,
          githubUrl: pkg.repository.url,
          loginErrorMessage: err.name || 'InvalidCredentialsError'
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
        userId: user.sAMAccountName || user.uid || ''
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
      request.seneca.act({role: 'buddy', list: 'contact-classes', userId: userId}, (error, payload) => {
        var myContactClasses = []
        if (error) {
          reply(error)
        } else {
          if (Array.isArray(payload)) {
            myContactClasses = payload
          }
          yar.set('myContactClasses', myContactClasses)
          reply.redirect('/')
        }
      })
    }
  })
}

/*
// For local testing
module.exports.doLogin = (request, reply) => {
  const yar = request.yar
  var jwt = require('jsonwebtoken')
  var payload = request.payload
  var username = payload.username
  const userId = username
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

  request.seneca.act({role: 'buddy', list: 'contact-classes', userId: userId}, (error, payload) => {
    var myContactClasses = []
    if (error) {
      reply(error)
    } else {
      if (Array.isArray(payload)) {
        myContactClasses = payload
      }
      yar.set('myContactClasses', myContactClasses)
      reply.redirect('/')
    }
  })
}
*/

function doLogout (request, reply) {
  request.cookieAuth.clear()
  reply.redirect('/')
}

module.exports.doSearch = (request, reply) => {
  const yar = request.yar
  const data = request.payload
  const searchText = data.searchText
  const userId = request.auth.credentials.data.userId
  const myContactClasses = yar.get('myContactClasses') || []

  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    searchText: searchText
  }

  request.seneca.act({role: 'buddy', search: 'students', userId: userId, query: searchText}, (error, payload) => {
    if (error) {
      reply(error)
    } else {
      if (!payload.statusKode) {
        viewOptions.students = payload
        reply.view('search-results', viewOptions)
      }
      if (payload.statusKode === 404) {
        viewOptions.students = []
        reply.view('search-results', viewOptions)
      }
      if (payload.statusKode === 401) {
        reply.redirect('/logout')
      }
    }
  })
}

module.exports.writeWarning = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    order: order,
    behaviour: behaviour,
    courseCategory: courseCategory
  }

  request.seneca.act({role: 'buddy', get: 'student', userId: userId, studentUserName: studentUserName}, (error, payload) => {
    if (error) {
      reply(error)
    } else {
      if (!payload.statusCode) {
        const student = payload[0]
        viewOptions.student = student
        viewOptions.warningTypes = filterWarningTypes(student.contactTeacher)
        viewOptions.skjemaUtfyllingStart = new Date().getTime()
        reply.view('warning', viewOptions)
      }
      if (payload.statusCode === 401) {
        console.log(JSON.stringify(payload))
        reply.redirect('/logout')
      }
    }
  })
}

function generateWarningPreview (request, reply) {
  var user = request.auth.credentials.data
  var data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.cn
  data.userAgent = request.headers['user-agent']
  var postData = prepareWarning(data)
  var previewData = prepareWarningPreview(postData)
  var template = getWarningTemplatesPath(postData.documentCategory)
  var templaterForm = new FormData()

  request.seneca.act({role: 'info', info: 'preview', data: previewData})

  Object.keys(previewData).forEach(function (key) {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.TEMPLATER_SERVICE_URL, function (error, docx) {
    if (error) {
      reply(error)
    } else {
      var chunks = []
      var totallength = 0

      docx.on('data', function (chunk) {
        chunks.push(chunk)
        totallength += chunk.length
      })

      docx.on('end', function () {
        var results = new Buffer(totallength)
        var pos = 0
        for (var i = 0; i < chunks.length; i++) {
          chunks[i].copy(results, pos)
          pos += chunks[i].length
        }
        reply(results.toString('base64'))
      })
    }
  })
}

module.exports.submitWarning = (request, reply) => {
  const user = request.auth.credentials.data
  var data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.cn
  data.userAgent = request.headers['user-agent']
  var postData = prepareWarning(data)

  request.seneca.act({role: 'queue', cmd: 'add', data: postData}, (error, doc) => {
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
      reply.redirect('/?documentAdded=' + postData.documentId)
    }
  })
}

module.exports.showLogin = showLogin

module.exports.doLogout = doLogout

module.exports.generateWarningPreview = generateWarningPreview
