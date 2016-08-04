'use strict'

const Handlers = require('../handlers/queue')

module.exports = [
  {
    method: 'get',
    path: '/api/queue/next',
    config: {
      handler: Handlers.getNextFromQueue,
      description: 'Get next job from queue',
      auth: 'jwt'
    }
  },
  {
    method: 'delete',
    path: '/api/queue/{queueId}',
    config: {
      handler: Handlers.deleteFromQueue,
      description: 'Delete job from queue',
      auth: 'jwt'
    }
  }
]
