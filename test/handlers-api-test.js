'use strict'

var tap = require('tap')
var handlers = require('../handlers/api')

tap.equal(Object.keys(handlers).length, 3, 'There are 3 different api-handlers')

tap.ok(handlers.getNextFromQueue, 'API handler has method getNextFromQueue')

tap.ok(handlers.deleteFromQueue, 'Handler has method deleteFromQueue')

tap.ok(handlers.addStatusToLog, 'Handler has method addStatusToLog')
