'use strict'

const Wreck = require('wreck')
const config = require('../config')
const pkg = require('../package.json')
var wreckOptions = {
  json: true
}

module.exports.showClasses = (request, reply) => {
  const classesUrl = config.BUDDY_API_URL + '/users/' + request.auth.credentials.data.userId + '/contactClasses'

  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials
  }

  wreckOptions.headers = {
    Authorization: request.auth.credentials.token
  }

  Wreck.get(classesUrl, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      if (res.statusCode === 200) {
        viewOptions.classes = payload
        reply.view('klasseliste', viewOptions)
      }
      if (res.statusCode === 404) {
        console.log(res.statusCode)
        console.log(payload)
        viewOptions.classes = []
        reply.view('klasseliste', viewOptions)
      }
      if (res.statusCode === 401) {
        console.log(res.statusCode)
        console.log(payload)
        reply.redirect('/logout')
      }
    }
  })
}

module.exports.listStudentsInClass = (request, reply) => {
  const groupID = request.params.groupID
  const studentsUrl = config.BUDDY_API_URL + '/groups/' + groupID + '/students'

  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials
  }

  wreckOptions.headers = {
    Authorization: request.auth.credentials.token
  }

  Wreck.get(studentsUrl, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      if (res.statusCode === 200) {
        viewOptions.students = payload
        reply.view('klasse-elevliste', viewOptions)
      }
      if (res.statusCode === 404) {
        console.log(res.statusCode)
        console.log(payload)
        viewOptions.students = []
        reply.view('klasse-elevliste', viewOptions)
      }
      if (res.statusCode === 401) {
        console.log(res.statusCode)
        console.log(payload)
        reply.redirect('/logout')
      }
    }
  })
}
