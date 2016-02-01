'use strict'

function prepareWarning (data) {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  var warning = {
    timeStamp: new Date().getTime(),
    userId: data.userId,
    userName: data.userName,
    studentName: data.studentName,
    studentId: data.studentId,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    documentType: 'varsel',
    documentCategory: data.type
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

  if (data.type === 'karakter') {
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
