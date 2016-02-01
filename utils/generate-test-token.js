'use strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var tokenOptions = {
  expiresIn: '1h',
  issuer: 'https://auth.t-fk.no'
}
var data = {
  cn: 'Bernhard Riemann',
  userId: 'riemann'
}

var token = jwt.sign(data, config.JWT_SECRET, tokenOptions)

console.log(token)
