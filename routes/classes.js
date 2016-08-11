'use strict'

const handlers = require('../handlers/classes')

module.exports = [
  {
    method: 'GET',
    path: '/classes',
    config: {
      handler: handlers.showClasses,
      description: 'Show the class'
    }
  }
]
