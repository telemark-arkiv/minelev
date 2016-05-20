'use strict'

// For OpenLDAP:
// searchFilter: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})'
// For Active Directory:
// searchFilter: '(sAMAccountName={{username}})'

var path = require('path')

const SERVER_PORT_WEB = process.env.SERVER_PORT_WEB || 8000

function ldapTlsSettings () {
  var fs = require('fs')
  var config = false

  if (process.env.LDAP_TLS_SETTINGS) {
    config = {
      rejectUnauthorized: process.env.LDAP_TLS_REJECT_UNAUTHORIZED ? true : false, // eslint-disable-line no-unneeded-ternary
      ca: [
        fs.readFileSync(path.join(__dirname, process.env.LDAP_TLS_CA_PATH))
      ]
    }
  }

  return config
}

var config = {
  SERVER_PORT_WEB: SERVER_PORT_WEB,
  DB_CONNECTION_LOG: process.env.DB_CONNECTION_LOG || 'mongodb://localhost/louie',
  DB_CONNECTION_QUEUE: process.env.DB_CONNECTION_QUEUE || 'mongodb://localhost/louie',
  BUDDY_API_URL: process.env.BUDDY_API_URL || 'http://localhost:' + SERVER_PORT_WEB + '/demo',
  CALLBACK_STATUS_URL: process.env.CALLBACK_STATUS_URL || 'https://api.buddy.com/status/',
  TEMPLATER_SERVICE_URL: process.env.TEMPLATER_SERVICE_URL || 'https://api.buddy.com/status/',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'Louie Louie, oh no, I got to go. Louie Louie, oh no, I got to go',
  GITHUB_FEEDBACK_URL: process.env.GITHUB_FEEDBACK_URL || 'https://api.github.com/repos/:user/:repo/issues',
  GITHUB_USER: process.env.GITHUB_USER || 'yourgithubuser',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || 'yourgithubtoken',
  LDAP: {
    url: process.env.LDAP_URL || 'ldap://ldap.forumsys.com:389',
    bindDn: process.env.LDAP_BIND_DN || 'cn=read-only-admin,dc=example,dc=com',
    bindCredentials: process.env.LDAP_BIND_CREDENTIALS || 'password',
    searchBase: process.env.LDAP_SEARCH_BASE || 'dc=example,dc=com',
    searchFilter: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})',
    tlsOptions: ldapTlsSettings()
  }
}

module.exports = config
