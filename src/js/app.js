import * as bootstrap from 'bootstrap'

function $(selector) {
  return document.querySelector(selector)
}

function $$(selector) {
  return document.querySelectorAll(selector)
}

let tasks = []
const userSelectElement = $('#taskUserSelect')
const toDoColumnElement = $('#toDoCards')
const inprogressColumnElement = $('#inprogressColumn')
const doneColumnElement = $('#doneColumn')
const clockElement = $('#clock')
const createCardButton = $('#createTaskButton')
const modalElement = $('#modal')
const modal = new bootstrap.Modal(modalElement, {
  keyboard: false,
  backdrop: 'static',
})
const modalTitle = $('#modalTitle')
const taskTitle = $('#taskTitleInput')
const taskDescription = $('#taskDescriptionInput')
const taskUserSelect = $('#taskUserSelect')
const saveTaskButton = $('#saveTaskButton')
const cancelTaskButton = $('#cancelTaskButton')


function getData(key = '') {
  return localStorage.getItem(key)
}


function setData(key = '', value) {
  localStorage.setItem(key, JSON.stringify(value))
}


async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  const users = await response.json()

  return users.forEach(user => {
    const option = document.createElement('option')
    option.value = user.name
    option.textContent = user.name
    userSelectElement.appendChild(option)
  })
}

getUsers()

setInterval(() => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  clockElement.textContent = time
  const titleElement = $('#title')
  if (now.getHours() >= 8 && now.getHours() < 18) {
    clockElement.classList.remove('text-white')
    clockElement.classList.add('text-dark')
    document.body.classList.add('bg-white')
    document.body.classList.remove('bg-dark')
    titleElement.classList.add('text-dark')
    titleElement.classList.remove('text-white')
  } else {
    clockElement.classList.remove('text-dark')
    clockElement.classList.add('text-white')
    document.body.classList.add('bg-dark')
    document.body.classList.remove('bg-white')
    titleElement.classList.add('text-white')
    titleElement.classList.remove('text-dark')
  }
}, 1000)

class Task {
  status = 'todo'
  id = Date.now()

  constructor(title, description, user) {
    this.title = title
    this.description = description
    this.user = user
  }
}

function showModal() {
  modal.show()
}
createCardButton.addEventListener('click', showModal)

function saveTask() {
  const task = new Task(taskTitle.value, taskDescription.value, taskUserSelect.value)
  tasks.push(task)
  console.log(tasks)
  modalTitle.textContent = 'Create Card'
  taskTitle.value = ''
  taskDescription.value = ''
  taskUserSelect.value = ''
  modal.hide()
  render(tasks)
  setData('tasks', tasks)
}

saveTaskButton.addEventListener('click', saveTask)
cancelTaskButton.addEventListener('click', () => {
  modal.hide()
})


function buildTemplateCard(task) {
  return `<div class="card mt-2" data-id="${task.id}">
    <div class="card-body">
      <button type="button" class="btn-close"></button>
      <h5 class="card-title">${task.title}</h5>
      <p class="card-text">${task.description}</p>
      <p class="card-text">${task.user}</p>
      <button type="button" class="btn btn-primary">Edit</button>
    </div>
  </div>`
}


function render(renderData) {
  let html = ''
  renderData.forEach((task) => {
    html += buildTemplateCard(task)
  })

  toDoColumnElement.innerHTML = html
}

function handleDeleteTask(event) {
  const target = event.target
  if (target.classList.contains('btn-close')) {
    const parent = target.closest('.card')
    parent.remove()
    const id = parent.getAttribute('data-id')
    const index = tasks.findIndex(task => task.id === Number(id))
    tasks.splice(index, 1)
    render(tasks)
    setData('tasks', tasks)
  }
}

toDoColumnElement.addEventListener('click', handleDeleteTask)

function handleEditTask(event) {
  const target = event.target
  if (target.classList.contains('btn')) {
    const parent = target.closest('.card')
    const id = parent.getAttribute('data-id')
    const index = tasks.findIndex(task => task.id === Number(id))
    const task = tasks[index]
    modalTitle.textContent = 'Edit Card'
    taskTitle.value = task.title
    taskDescription.value = task.description
    taskUserSelect.value = task.user
    modal.show()
  }
}

toDoColumnElement.addEventListener('click', handleEditTask)

if (getData('tasks')) {
  tasks = JSON.parse(getData('tasks'))
  render(tasks)
}
