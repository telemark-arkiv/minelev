'use strict'

function doDemoSearch (request, reply) {
  const students = require('../test/data/demo-students.json')
  reply(students)
}

module.exports.doDemoSearch = doDemoSearch
