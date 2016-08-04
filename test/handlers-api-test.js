'use strict'

var tap = require('tap')
var handlers = require('../handlers/api')

tap.equal(Object.keys(handlers).length, 1, 'There are 1 different api-handlers')

tap.ok(handlers.addStatusToLog, 'Handler has method addStatusToLog')
