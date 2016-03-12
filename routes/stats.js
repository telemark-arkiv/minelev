'use strict'

var stats = require('../handlers/stats')

var routes = [
  {
    method: 'GET',
    path: '/stats/schools',
    config: {
      handler: stats.getStatsSchools,
      description: 'Statistics for warnings pr school'
    }
  },
  {
    method: 'GET',
    path: '/stats/total',
    config: {
      handler: stats.getStatsTotal,
      description: 'Statistics for total warnings'
    }
  },
  {
    method: 'GET',
    path: '/stats/status',
    config: {
      handler: stats.getStatsStatus,
      description: 'Statistics for different statuses'
    }
  },
  {
    method: 'GET',
    path: '/stats/hours',
    config: {
      handler: stats.getStatsHours,
      description: 'Statistics for warnings per hour of the day'
    }
  }
]

module.exports = routes
