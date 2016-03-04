'use strict'

var feedback = require('../handlers/feedback')

var routes = [
  {
    method: 'GET',
    path: '/feedback',
    config: {
      handler: feedback.showFeedbackPage,
      description: 'Show feedback page'
    }
  },
  {
    method: 'POST',
    path: '/feedback',
    config: {
      handler: feedback.addFeedback,
      description: 'Registers feedback'
    }
  }
]

module.exports = routes
