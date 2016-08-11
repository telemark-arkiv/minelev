'use strict'

const tap = require('tap')
const routes = require('../routes/index')

tap.equal(routes.length, 11, 'There are 11 routes')
