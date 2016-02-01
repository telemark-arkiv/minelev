'use strict'

var handlers = require('../handlers')
var api = require('../handlers/api')

var routes = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: handlers.getFrontpage,
      description: 'Show the frontpage'
    }
  },
  {
    method: 'GET',
    path: '/logs',
    config: {
      handler: handlers.getLogspage,
      description: 'Show the logspage'
    }
  },
  {
    method: 'GET',
    path: '/help',
    config: {
      handler: handlers.getHelppage,
      description: 'Show the helppage'
    }
  },
  {
    method: 'GET',
    path: '/login',
    config: {
      handler: handlers.showLogin,
      description: 'Show the Logingpage',
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/login',
    config: {
      handler: handlers.doLogin,
      description: 'Login',
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      handler: handlers.doLogout
    }
  },
  {
    method: 'POST',
    path: '/search',
    config: {
      handler: handlers.doSearch
    }
  },
  {
    method: 'GET',
    path: '/warning/{studentID}',
    config: {
      handler: handlers.writeWarning,
      description: 'Get student by {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/warning/{studentID}',
    config: {
      handler: handlers.submitWarning,
      description: 'Get student by {studentID}'
    }
  },
  {
    method: 'get',
    path: '/api/queue/next',
    config: {
      handler: api.getNextFromQueue,
      description: 'Get next job from queue',
      auth: false
    }
  },
  {
    method: 'delete',
    path: '/api/queue/{jobId}',
    config: {
      handler: api.deleteFromQueue,
      description: 'Delete job from queue',
      auth: false
    }
  },
  {
    method: 'post',
    path: '/api/logs/{documentId}',
    config: {
      handler: api.addStatusToLog,
      description: 'Adds status to log',
      auth: false
    }
  }
]

module.exports = routes
