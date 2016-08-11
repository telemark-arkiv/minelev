'use strict'

var tap = require('tap')
var handlers = require('../handlers/classes')

tap.equal(Object.keys(handlers).length, 2, 'There are 2 different classes handlers')

tap.ok(handlers.showClasses, 'Handler has method showClasses')

tap.ok(handlers.listStudentsInClass, 'Handler has method listStudentsInClass')
