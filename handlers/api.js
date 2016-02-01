'use strict'

var mongojs = require('mongojs')
var config = require('../config')
var dblog = mongojs(config.DB_CONNECTION_LOG)
var dbqueue = mongojs(config.DB_CONNECTION_QUEUE)
var logs = dblog.collection('logs')
var queue = dbqueue.collection('queue')

function getNextFromQueue (request, reply) {
  queue.find({}).sort({timeStamp: 1}).limit(1, function (error, data) {
    reply(error || data)
  })
}

function deleteFromQueue (request, reply) {
  var jobId = mongojs.ObjectId(request.params.jobId)
  queue.remove({'_id': jobId}, function (error, data) {
    reply(error || data)
  })
}

function addStatusToLog (request, reply) {
  var documentId = request.params.documentId
  var status = request.payload
  status.timeStamp = new Date().getTime()
  logs.update({'documentId': documentId}, {'$push': {documentStatus: status}}, function (error, data) {
    reply(error || data)
  })
}

module.exports.getNextFromQueue = getNextFromQueue

module.exports.deleteFromQueue = deleteFromQueue

module.exports.addStatusToLog = addStatusToLog
