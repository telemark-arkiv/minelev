'use strict'

module.exports = function senecaHub (options) {
  const seneca = this

  seneca.add('role:info, info:preview', (args, callback) => {
    console.log(`Preview generated: ${args.data.studentUserName}`)
  })

  return options.tag || 'seneca-hub'
}
