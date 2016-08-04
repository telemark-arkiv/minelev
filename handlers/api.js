'use strict'

var mongojs = require('mongojs')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var logs = dblog.collection('logs')

function addStatusToLog (request, reply) {
  var documentId = request.params.documentId
  var status = request.payload
  status.timeStamp = new Date().getTime()
  logs.update({'documentId': documentId}, {'$push': {documentStatus: status}}, function (error, data) {
    reply(error || data)
  })
}

module.exports.addStatusToLog = addStatusToLog
