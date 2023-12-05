import {
  eventListeners
} from '@popperjs/core'
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
const inProgressColumnElement = $('#inProgressCards')
const doneColumnElement = $('#doneCards')
const columns = $$('.column')
const clockElement = $('#clock')
const createCardButton = $('#createTaskButton')
const modalCreateNewTaskElement = $('#modalCreateNewTask')
const modalCreateNewTask = new bootstrap.Modal(modalCreateNewTaskElement, {
  keyboard: false,
  backdrop: 'static',
})
const modalEditTaskElement = $('#modalEditTask')
const modalEditTask = new bootstrap.Modal(modalEditTaskElement, {
  keyboard: false,
})
const saveEditsButton = $('#saveEditsTaskButton')
const cancelEditsButton = $('#cancelEditsTaskButton')
const taskTitle = $('#taskTitleInput')
const taskDescription = $('#taskDescriptionInput')
const taskUserSelect = $('#taskUserSelect')
const saveTaskButton = $('#saveTaskButton')
const cancelTaskButton = $('#cancelTaskButton')
const editTaskTitle = $('#taskEditTitleInput')
const editTaskDescription = $('#taskEditDescriptionInput')
const editTaskUserSelect = $('#taskEditUserSelect')
let id
let users = []

function getData(key = '') {
  return localStorage.getItem(key)
}


function setData(key = '', value) {
  localStorage.setItem(key, JSON.stringify(value))
}


async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  users = await response.json()

  return users
}

getUsers().then(() => {
  users.forEach(user => {
    const option = document.createElement('option')
    option.value = user.name
    option.textContent = user.name
    userSelectElement.append(option)
  })
})

getUsers().then(() => {
  users.forEach(user => {
    const option = document.createElement('option')
    option.value = user.name
    option.textContent = user.name
    editTaskUserSelect.append(option)
  })
})


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

function showModal(event) {
  modalCreateNewTask.show()
}
createCardButton.addEventListener('click', showModal)

function saveTask() {
  const task = new Task(taskTitle.value, taskDescription.value, taskUserSelect.value)
  tasks.push(task)
  taskTitle.value = ''
  taskDescription.value = ''
  taskUserSelect.value = ''
  modalCreateNewTask.hide()
  render(tasks)
  setData('tasks', tasks)
}

saveTaskButton.addEventListener('click', saveTask)
cancelTaskButton.addEventListener('click', () => {
  modalCreateNewTask.hide()
})


function buildTemplateCard(task) {
  return `<div class="card mt-2" id="${task.id}" draggable="true">
    <div class="card-body">
      <button type="button" class="btn-close"></button>
      <h5 id="cardTitle" class="card-title">${task.title}</h5>
      <p id="cardDescription" class="card-text">${task.description}</p>
      <p id="cardUser" class="card-text">${task.user}</p>
      <button id="editTaskButton" type="button" class="btn btn-primary">Edit</button>
    </div>
  </div>`
}


function render(renderData) {
  let html = ''
  renderData.forEach((task) => {
    html += buildTemplateCard(task)
    if (task.status === 'todo') {
      toDoColumnElement.innerHTML = html
    } else if (task.status === 'inprogress') {
      inProgressColumnElement.innerHTML = html
    } else if (task.status === 'done') {
      doneColumnElement.innerHTML = html
    }
  })
  console.log(renderData)
}

function handleDeleteTask(event) {
  const target = event.target
  if (target.classList.contains('btn-close')) {
    const parent = target.closest('.card')
    parent.remove()
    const id = parent.getAttribute('id')
    const index = tasks.findIndex(task => task.id === Number(id))
    tasks.splice(index, 1)
    render(tasks)
    setData('tasks', tasks)
  }
}

toDoColumnElement.addEventListener('click', handleDeleteTask)

function handleEditTask(event) {
  const target = event.target
  if (target.id === 'editTaskButton') {
    const parent = target.closest('.card')
    id = parent.getAttribute('id')
    const index = tasks.findIndex(task => task.id === Number(id))
    const task = tasks[index]
    editTaskTitle.value = task.title
    editTaskDescription.value = task.description
    editTaskUserSelect.value = task.user
    modalEditTask.show()
  }
}

function saveEdits() {
  const index = tasks.findIndex(task => task.id === Number(id))
  const task = tasks[index]
  task.title = editTaskTitle.value
  task.description = editTaskDescription.value
  task.user = editTaskUserSelect.value
  render(tasks)
  setData('tasks', tasks)
  modalEditTask.hide()
}

toDoColumnElement.addEventListener('click', handleEditTask)
saveEditsButton.addEventListener('click', saveEdits)
cancelEditsButton.addEventListener('click', () => {
  modalEditTask.hide()
})

// drag and drop
let card

function dragStart(event) {
  card = event.target
  setTimeout(() => {
    card.classList.add('hide')
    console.log(card)
  }, 0)
}

function dragEnd() {
  card.classList.remove('hide')
}


columns.forEach((item) => {
  item.addEventListener('dragover', (event) => {
    event.preventDefault()
  })
  item.addEventListener('dragenter', (event) => {
    event.preventDefault()
  })
  item.addEventListener('dragleave', (event) => {
    event.preventDefault()
  })
  item.addEventListener('drop', () => {
    // card.classList.remove('hide')
    id = card.getAttribute('id')
    const column = item.getAttribute('data-status')
    const index = tasks.findIndex(task => task.id === Number(id))
    const task = tasks[index]
    task.status = column
    console.log(task)
    render(tasks)
    setData('tasks', tasks)
  })
  item.addEventListener('click', handleDeleteTask)
  item.addEventListener('click', handleEditTask)
  item.addEventListener('dragstart', dragStart)
  item.addEventListener('dragend', dragEnd)
  console.log(columns)
})



if (getData('tasks')) {
  tasks = JSON.parse(getData('tasks'))
  render(tasks)
}
