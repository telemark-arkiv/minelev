'use strict'

function init () {
  var radios = document.querySelectorAll('.warning-type-selector')
  var periods = document.querySelectorAll('.period-selector')
  var checkboxes = document.querySelectorAll('.mdl-checkbox')
  var form = document.getElementById('submitWarningForm')
  var submitButton = document.getElementById('submitWarning')
  hideAllCheckboxes()
  hideAllHeaders()
  validateWarning()
  Array.prototype.forEach.call(radios, function(el) {
    el.addEventListener('click', function (e) {
      hideAllCheckboxes()
      hideAllHeaders()
      showMe(e.target.value)
      validateWarning()
    })
    if (el.checked) {
      showMe(el.value)
    }
  })
  Array.prototype.forEach.call(checkboxes, function(el) {
    el.addEventListener('click', function (e) {
      validateWarning()
    })
  })
  Array.prototype.forEach.call(periods, function(el) {
    el.addEventListener('click', function (e) {
      validateWarning()
    })
  })
  submitButton.addEventListener('click', function (e) {
    submitWarning(e)
  })
  form.addEventListener('submit', function (e) {
    waitForPreview()
  })
  preselectFag()
}

function preselectFag () {
  var radios = document.querySelectorAll('.warning-type-selector')
  var arsakCourse = document.getElementById('courseChkboxCourse')
  if (radios.length === 1) {
    radios[0].checked = true
    showMe(radios[0].value)
    arsakCourse.checked = true
  }
}

function showMe (type) {
  var thisClass = '.chxBx' + type
  var checkBoxes = document.querySelectorAll(thisClass)
  Array.prototype.forEach.call(checkBoxes, function(el) {
    el.style.display = ''
  })
}

function hideAllCheckboxes () {
  var checkBoxes = document.querySelectorAll('.mdl-checkbox')
  Array.prototype.forEach.call(checkBoxes, function(el) {
    el.style.display = 'none'
  })
}

function hideAllHeaders () {
  var headers = document.querySelectorAll('.warning-form-header')
  Array.prototype.forEach.call(headers, function(el) {
    el.style.display = 'none'
  })
}

function validateWarning () {
  var submitButton = document.getElementById('submitWarning')
  var previewButton = document.getElementById('previewWarning')
  var warningTypes = document.querySelectorAll('.warning-type-selector')
  var periods = document.querySelectorAll('.period-selector')
  var checkBoxes = document.querySelectorAll('.mdl-checkbox__input')
  var arsakCourse = document.getElementById('courseChkboxCourse')
  var checkboxCount = 0
  var type = false
  var typeOK = false
  var periodOK = false
  var courseOK = false
  var reasonOK = false

  // Starts by disabling button
  submitButton.disabled = true
  previewButton.disabled = true

  Array.prototype.forEach.call(warningTypes, function(el) {
    if (el.checked) {
      type = el.value
      typeOK = true
    }
  })

  Array.prototype.forEach.call(periods, function(el) {
    if (el.checked) {
      periodOK = true
    }
  })

  Array.prototype.forEach.call(checkBoxes, function(el) {
    if (el.checked) {
      if (type === 'atferd' && /behaviour/.test(el.id)) {
        checkboxCount ++
      }
      if (type === 'orden' && /order/.test(el.id)) {
        checkboxCount ++
      }
      if (type === 'fag' && /course/.test(el.id)) {
        checkboxCount ++
      }
    }
  })

  if (type === 'fag' && arsakCourse.checked) {
    reasonOK = true
  }

  if (type === 'fag' && checkboxCount > 1) {
    courseOK = true
  }

  if (type !== 'fag' && checkboxCount > 0) {
    reasonOK = true
    courseOK = true
  }

  // If everything is OK let's go :-)
  if (typeOK && periodOK && courseOK && reasonOK) {
    submitButton.disabled = false
    previewButton.disabled = false
  }
}

function waitForPreview () {
  var previewButton = document.getElementById('previewWarning')
  var snackbarContainer = document.querySelector('.mdl-js-snackbar')
  var data = {
    message: 'Forhåndsvisning genereres nå. Vennligst vent...',
    timeout: 2000
  }

  snackbarContainer.MaterialSnackbar.showSnackbar(data)
  previewButton.disabled = true
  previewButton.textContent = 'cloud_download'
  setTimeout(function () {
    previewButton.textContent = 'description'
    validateWarning()
  }, 3000)
}

function submitWarning (e) {
  e.preventDefault()
  var form = document.getElementById('submitWarningForm')
  form.removeEventListener('submit')
  form.submit()
  return true
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
