'use strict'

var tap = require('tap')
var handlers = require('../handlers')

tap.equal(Object.keys(handlers).length, 9, 'There are 9 different handlers')

tap.ok(handlers.getFrontpage, 'Handler has method getFrontpage')

tap.ok(handlers.getLogspage, 'Handler has method getLogspage')

tap.ok(handlers.getHelppage, 'Handler has method getHelppage')

tap.ok(handlers.showLogin, 'Handler has method showLogin')

tap.ok(handlers.doLogin, 'Handler has method doLogin')

tap.ok(handlers.doLogout, 'Handler has method doLogout')

tap.ok(handlers.doSearch, 'Handler has method doSearch')

tap.ok(handlers.writeWarning, 'Handler has method writeWarning')

tap.ok(handlers.submitWarning, 'Handler has method submitWarning')
