'use strict'

const tap = require('tap')
const routes = require('../routes/index')

tap.equal(routes.length, 12, 'There are 12 routes')
