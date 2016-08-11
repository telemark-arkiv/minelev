'use strict'

const tap = require('tap')
const routes = require('../routes/classes')

tap.equal(routes.length, 1, 'There are 1 classes route')
