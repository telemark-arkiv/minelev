'use strict'

const mongojs = require('mongojs')
const config = require('../config')
const dblog = mongojs(config.DB_CONNECTION_LOG)
const logs = dblog.collection('logs')

module.exports.addStatusToLog = (request, reply) => {
  const documentId = request.params.documentId
  var status = request.payload
  status.timeStamp = new Date().getTime()

  request.seneca.act({role: 'info', info: 'statuslog', msg: 'add', data: status})

  logs.update({'documentId': documentId}, {'$push': {documentStatus: status}}, function (error, data) {
    reply(error || data)
  })
}
