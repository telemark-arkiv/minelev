'use strict'

function isValid () {
  var searchText = document.getElementById('searchText')
  var submit = document.getElementById('SearchFormSubmit')

  if (searchText.value) {
    submit.disabled = false
  }
}

function init () {
  var searchText = document.getElementById('searchText')
  var submit = document.getElementById('SearchFormSubmit')

  submit.disabled = true

  searchText.addEventListener('input', function (e) {
    isValid()
  })

}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
