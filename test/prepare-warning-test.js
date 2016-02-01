'use strict'

var tap = require('tap')
var prepareWarning = require('../lib/prepare-warning')

tap.throws(
  function () {
    var data = false
    prepareWarning(data)
  },
  {message: 'Missing required input: data object'},
  'Requires data object'
)

tap.test('It returns expected result from adferd', function (test) {
  var data = require('./data/atferd-post-data.json')
  var expected = require('./data/atferd-prepared-data.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Adferd prepared correct')
  test.done()
})

tap.test('It returns expected result from adferd single', function (test) {
  var data = require('./data/atferd-post-data-single.json')
  var expected = require('./data/atferd-prepared-data-single.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Adferd single prepared correct')
  test.done()
})

tap.test('It returns expected result from karakter', function (test) {
  var data = require('./data/karakter-post-data.json')
  var expected = require('./data/karakter-prepared-data.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Karakter prepared correct')
  test.done()
})

tap.test('It returns expected result from karakter single', function (test) {
  var data = require('./data/karakter-post-data-single.json')
  var expected = require('./data/karakter-prepared-data-single.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Karakter single prepared correct')
  test.done()
})

tap.test('It returns expected result from orden', function (test) {
  var data = require('./data/orden-post-data.json')
  var expected = require('./data/orden-prepared-data.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Orden prepared correct')
  test.done()
})

tap.test('It returns expected result from orden single', function (test) {
  var data = require('./data/orden-post-data-single.json')
  var expected = require('./data/orden-prepared-data-single.json')
  var result = prepareWarning(data)
  tap.ok(result.timeStamp, 'timeStamp exists')
  delete result.timeStamp
  tap.equal(JSON.stringify(result).trim(), JSON.stringify(expected).trim(), 'Orden single prepared correct')
  test.done()
})
