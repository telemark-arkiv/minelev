'use strict'

function prepareWarningPreview (item) {
  var now = new Date()
  var date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  var data = {
    dato: date,
    navnElev: item.studentName,
    navnAvsender: item.userName,
    navnSkole: item.schoolName,
    tlfSkole: item.schoolPhone,
    Arsak: item.behaviourCategories || item.orderCategories || item.gradesCategories || '',
    fag: item.coursesList || ''
  }
  // Windowsfix
  data.Arsak = data.Arsak.replace(/\n/g, '\r\n')
  data.fag = data.fag.replace(/\n/g, '\r\n')

  return data
}

function datePadding (date) {
  var padded = date.toString()
  if (padded.length === 1) {
    padded = '0' + date.toString()
  }
  return padded
}

module.exports = prepareWarningPreview
