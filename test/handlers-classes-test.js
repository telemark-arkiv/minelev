'use strict'

var tap = require('tap')
var handlers = require('../handlers/classes')

tap.equal(Object.keys(handlers).length, 1, 'There are 1 different classes handler')

tap.ok(handlers.showClasses, 'Handler has method showClasses')
