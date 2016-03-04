'use strict'

var Wreck = require('wreck')
var config = require('../config')
var pkg = require('../package.json')
var wreckOptions = {
  json: true
}

function showFeedbackPage (request, reply) {
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials
  }
  reply.view('feedback', viewOptions)
}

function addFeedback (request, reply) {
  var data = request.payload
  var url = config.GITHUB_FEEDBACK_URL
  var title = pkg.louie.systemName + ' - ' + pkg.version + ' - ' + new Date()
  var issue = {
    title: title,
    body: data.description + '\n\n' + request.auth.credentials.data.cn,
    labels: [
      'MinElev'
    ]
  }
  var auth = 'Basic ' + new Buffer(config.GITHUB_USER + ':' + config.GITHUB_TOKEN).toString('base64')

  wreckOptions.headers = {
    'Authorization': auth,
    'User-Agent': config.GITHUB_USER,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  }

  wreckOptions.payload = JSON.stringify(issue)

  Wreck.post(url, wreckOptions, function (error, response, payload) {
    if (error) {
      reply(error)
    } else {
      reply.redirect('/?feedbackCollected=true')
    }
  })
}

module.exports.showFeedbackPage = showFeedbackPage

module.exports.addFeedback = addFeedback
