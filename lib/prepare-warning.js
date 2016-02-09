'use strict'

var config = require('../config')

function prepareWarning (data) {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  var warning = {
    timeStamp: new Date().getTime(),
    userId: data.userId,
    userName: data.userName,
    studentName: data.studentName,
    studentFirstName: data.studentFirstName,
    studentMiddleName: data.studentMiddleName,
    studentLastName: data.studentLastName,
    studentId: data.studentId,
    studentUserName: data.studentUserName,
    studentMail: data.studentMail,
    studentPhone: data.studentPhone,
    studentMainGroupName: data.studentMainGroupName,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    schoolPhone: data.schoolPhone,
    schoolOrganizationNumber: data.organizationNumber,
    period: data.warningPeriod,
    documentType: 'varsel',
    documentCategory: data.type,
    CALLBACK_STATUS_URL: config.CALLBACK_STATUS_URL
  }

  if (data.type === 'orden') {
    if (Array.isArray(data.orderCategories)) {
      data.orderCategories = data.orderCategories.join('\n')
    }
    warning.orderCategories = data.orderCategories
  }

  if (data.type === 'atferd') {
    if (Array.isArray(data.behaviourCategories)) {
      data.behaviourCategories = data.behaviourCategories.join('\n')
    }
    warning.behaviourCategories = data.behaviourCategories
  }

  if (data.type === 'fag') {
    if (Array.isArray(data.gradesCategories)) {
      data.gradesCategories = data.gradesCategories.join('\n')
    }
    if (Array.isArray(data.coursesList)) {
      data.coursesList = data.coursesList.join('\n')
    }

    warning.gradesCategories = data.gradesCategories
    warning.coursesList = data.coursesList
  }

  return warning
}

module.exports = prepareWarning
