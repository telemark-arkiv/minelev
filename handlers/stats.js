'use strict'

var mongojs = require('mongojs')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var logs = dblog.collection('logs')
var pkg = require('../package.json')

function getStatsSchools (request, reply) {
  logs.aggregate( { '$group' : { '_id' : '$schoolName', 'total' : { '$sum' : 1 }} })
    .sort({ 'total': -1 }, function (error, data) {
      reply(error || data)
    })
}

function getStatsTotal (request, reply) {
  logs.find({}).count(function (error, data) {
    reply(error || data)
  })
}

function getStatsStatus (request, reply) {
  logs.aggregate( {'$unwind': '$documentStatus'}, { '$group' : { '_id' : '$documentStatus.status', 'total' : { '$sum' : 1 }} })
    .sort({ 'total': -1 }, function (error, data) {
      reply(error || data)
    })
}

module.exports.getStatsSchools = getStatsSchools

module.exports.getStatsTotal = getStatsTotal

module.exports.getStatsStatus = getStatsStatus
