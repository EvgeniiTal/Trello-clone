import * as bootstrap from 'bootstrap'

function $(selector) {
  return document.querySelector(selector)
}

function $$(selector) {
  return document.querySelectorAll(selector)
}

const clockElement = $('#clock')

setInterval(() => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  clockElement.textContent = time
}, 1000)
