'use strict'

const handlers = require('../handlers/demo')

const routes = [
  {
    method: 'GET',
    path: '/demo/users/{userId}/search/{searchText}',
    config: {
      handler: handlers.doDemoSearch,
      description: 'Demoversion of the buddysearch',
      auth: false
    }
  }
]

module.exports = routes
