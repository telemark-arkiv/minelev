'use strict'

function init () {
  var radios = document.querySelectorAll('.warning-type-selector')
  var checkboxes = document.querySelectorAll('.mdl-checkbox')
  hideAllCheckboxes()
  hideAllHeaders()
  validateWarning()
  Array.prototype.forEach.call(radios, function(el) {
    el.addEventListener('click', function (e) {
      hideAllCheckboxes()
      hideAllHeaders()
      showMe(e.target.value)
      buildPreview()
      validateWarning()
    })
    if (el.checked) {
      showMe(el.value)
    }
  })
  Array.prototype.forEach.call(checkboxes, function(el) {
    el.addEventListener('click', function (e) {
      buildPreview()
      validateWarning()
    })
  })


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

function addLi(txt) {
  var ul = document.getElementById('warningPreviewText')
  var li = document.createElement('li')
  li.innerHTML = txt
  ul.appendChild(li)
}

function buildPreview () {
  var ul = document.getElementById('warningPreviewText')
  var warningTypes = document.querySelectorAll('.warning-type-selector')
  var periods = document.querySelectorAll('.period-selector')
  var checkBoxes = document.querySelectorAll('.mdl-checkbox__input')
  var printCourse = true
  var arsakCourse = document.getElementById('courseChkboxCourse')

  ul.innerHTML = ''

  Array.prototype.forEach.call(warningTypes, function(el) {
    if (el.checked) {
      var msg = 'Type: ' + '<strong>' + el.value + '</strong>'
      addLi(msg)
    }
  })

  Array.prototype.forEach.call(periods, function(el) {
    if (el.checked) {
      var msg = 'Periode: ' + '<strong>' + el.value + '</strong>'
      addLi(msg)
    }
  })

  addLi('Årsak til varsel:')
  if (arsakCourse.checked) {
    addLi(arsakCourse.value)
  }

  Array.prototype.forEach.call(checkBoxes, function(el) {
    if (el.checked && printCourse && /courseChkbox/.test(el.id)) {
      addLi('Varselet gjelder følgende fag:')
      printCourse = false
    }
    if (el.checked && el.id !== 'courseChkboxCourse') {
      addLi('<strong>' + el.value + '</strong>')
    }
  })

}

function validateWarning () {
  var button = document.getElementById('submitWarning')
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
  button.disabled = true

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
      if (type === 'karakter' && /course/.test(el.id)) {
        checkboxCount ++
      }
    }
  })

  if (type === 'karakter' && arsakCourse.checked) {
    reasonOK = true
  }

  if (type === 'karakter' && checkboxCount > 1) {
    courseOK = true
  }

  if (type !== 'karakter' && checkboxCount > 0) {
    reasonOK = true
    courseOK = true
  }

  // If everything is OK let's go :-)
  if (typeOK && periodOK && courseOK && reasonOK) {
    button.disabled = false
  }

}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)