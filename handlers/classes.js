'use strict'

const pkg = require('../package.json')

module.exports.showClasses = (request, reply) => {
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials
  }
  reply.view('klasseliste', viewOptions)
}
