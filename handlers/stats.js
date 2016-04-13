'use strict'

var mongojs = require('mongojs')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var logs = dblog.collection('logs')

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

module.exports.getStatsSchools = getStatsSchools

module.exports.getStatsTotal = getStatsTotal

module.exports.getStatsTeachers = getStatsTeachers

module.exports.getStatsStatus = getStatsStatus

module.exports.getStatsHours = getStatsHours

module.exports.getStatsCategory = getStatsCategory
