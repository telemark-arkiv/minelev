'use strict'

const tap = require('tap')
const routes = require('../routes/classes')

tap.equal(routes.length, 2, 'There are 2 classes routes')
