'use strict'

module.exports.getNextFromQueue = (request, reply) => {
  request.seneca.act({role: 'queue', cmd: 'next'}, (error, data) => {
    reply(error || data)
  })
}

module.exports.deleteFromQueue = (request, reply) => {
  const queueId = request.params.queueId
  request.seneca.act({role: 'queue', cmd: 'delete', queueId: queueId}, (error, data) => {
    if (error) {
      reply(error)
    } else {
      reply(data)
    }
  })
}
