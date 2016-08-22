'use strict'

const mongojs = require('mongojs')
const Wreck = require('wreck')
const config = require('../config')
const pkg = require('../package.json')
const dblog = mongojs(config.DB_CONNECTION_LOG)
const logs = dblog.collection('logs')
const wreckOptions = {
  json: true
}

function getStatsSchools (request, reply) {
  logs.aggregate({'$group': {'_id': '$schoolName', 'total': {'$sum': 1}}})
    .sort({'total': -1}, function (error, data) {
      reply(error || data)
    })
}

function getStatsTotal (request, reply) {
  logs.find({}).count(function (error, data) {
    reply(error || data)
  })
}

function getStatsTeachers (request, reply) {
  logs.distinct('userId', {}, function (error, data) {
    reply(error || data.length)
  })
}

function getStatsStatus (request, reply) {
  logs.aggregate({'$unwind': '$documentStatus'}, {'$group': {'_id': '$documentStatus.status', 'total': {'$sum': 1}}})
    .sort({'total': -1}, function (error, data) {
      reply(error || data)
    })
}

function getStatsHours (request, reply) {
  logs.aggregate({'$group': {'_id': {'$hour': '$documentDate'}, 'total': {'$sum': 1}}})
    .sort({'_id': -1}, function (error, data) {
      reply(error || data)
    })
}

function getStatsCategory (request, reply) {
  logs.aggregate({'$group': {'_id': '$documentCategory', 'total': {'$sum': 1}}})
    .sort({'total': -1}, function (error, data) {
      reply(error || data)
    })
}

module.exports.getStats = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
  }
  const liveStatsUrl = config.LIVESTATS_URL

  Wreck.get(liveStatsUrl, wreckOptions, (error, response, payload) => {
    if (error) {
      reply(error)
    } else {
      viewOptions.liveStats = payload
      reply.view('statistikk', viewOptions)
    }
  })
}

module.exports.getStatsSchools = getStatsSchools

module.exports.getStatsTotal = getStatsTotal

module.exports.getStatsTeachers = getStatsTeachers

module.exports.getStatsStatus = getStatsStatus

module.exports.getStatsHours = getStatsHours

module.exports.getStatsCategory = getStatsCategory
