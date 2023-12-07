import {
  eventListeners
} from '@popperjs/core'
import * as bootstrap from 'bootstrap'
import {
  showModal,
  saveTask,
  saveEdits,
  deleteAllTasks
} from './handlers.js'
import {
  getData,
} from './localStorage.js'
import {
  render
} from './render.js'
import {
  dragAndDrop
} from './dragAndDrop.js'

// Функция $ принимает селектор и возвращает первый элемент, соответствующий этому селектору, найденный в DOM дереве.

function $(selector) {
  return document.querySelector(selector)
}

// Функция $$ принимает селектор и возвращает псевдомассив из всех элементов на странице, которые соответствуют этому селектору.
function $$(selector) {
  return document.querySelectorAll(selector)
}

// переменные
let tasks = []
const userSelectElement = $('#taskUserSelect')
const toDoColumnElement = $('#toDoCards')
const inProgressColumnElement = $('#inProgressCards')
const doneColumnElement = $('#doneCards')
const columns = $$('.column')
const clockElement = $('#clock')
const createTaskButton = $('#createTaskButton')
const modalCreateNewTaskElement = $('#modalCreateNewTask')
const modalCreateNewTask = new bootstrap.Modal(modalCreateNewTaskElement, {
  keyboard: false,
  backdrop: 'static',
})
const modalEditTaskElement = $('#modalEditTask')
const modalEditTask = new bootstrap.Modal(modalEditTaskElement, {
  keyboard: false,
})

const modalNoticeDeleteAllTasksElement = $('#modalNoticeDeleteAllTasks')
const modalNoticeDeleteAllTasks = new bootstrap.Modal(modalNoticeDeleteAllTasksElement, {
  keyboard: false,
})
const modalNoticeMoreInProgressTasksElement = $('#modalNoticeMoreInProgressTasks')
const modalNoticeMoreInProgressTasks = new bootstrap.Modal(modalNoticeMoreInProgressTasksElement, {
  keyboard: false,
})
const completeNoticeButton = $('#completeNotice')
const cancelNoticeButton = $('#cancelNotice')
const completeDeleteAllTasks = $('#completeDeleteAllTasks')
const cancelDeleteAllTasks = $('#cancelDeleteAllTasks')
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
const deleteAllDoneTasksButton = $('#deleteAlDoneTasksButton')
let id
let users = []

if (getData('tasks')) {
  tasks = JSON.parse(getData('tasks'))
  render(tasks)
}

// запрос на получение юзеров
async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  users = await response.json()

  return users
}

// заполнение селекта в создании задачи юзерами
getUsers().then(() => {
  users.forEach(user => {
    const option = document.createElement('option')
    option.value = user.name
    option.textContent = user.name
    userSelectElement.append(option)
  })
})

// заполнение селекта в редактировании задачи юзерами
getUsers().then(() => {
  users.forEach(user => {
    const option = document.createElement('option')
    option.value = user.name
    option.textContent = user.name
    editTaskUserSelect.append(option)
  })
})

// отображение времени
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

// обработчик кнопки изменения задачи
function handleEditTask(event) {
  const target = event.target
  if (target.id === 'editTaskButton') {
    const parent = target.closest('.card')
    id = parent.getAttribute('id')
    const index = tasks.findIndex(task => task.id === Number(id))
    const {
      title,
      description,
      user
    } = tasks[index]
    editTaskTitle.value = title
    editTaskDescription.value = description
    editTaskUserSelect.value = user
    modalEditTask.show()
  }
}
// добавление обработчиков на различные элементы
createTaskButton.addEventListener('click', showModal)
saveTaskButton.addEventListener('click', saveTask)
cancelTaskButton.addEventListener('click', () => {
  modalCreateNewTask.hide()
})
saveEditsButton.addEventListener('click', saveEdits)
cancelEditsButton.addEventListener('click', () => {
  modalEditTask.hide()
})
completeDeleteAllTasks.addEventListener('click', deleteAllTasks)
deleteAllDoneTasksButton.addEventListener('click', () => {
  modalNoticeDeleteAllTasks.show()
})
cancelDeleteAllTasks.addEventListener('click', () => {
  modalNoticeDeleteAllTasks.hide()
})
completeNoticeButton.addEventListener('click', () => {
  modalNoticeMoreInProgressTasks.hide()
})
cancelNoticeButton.addEventListener('click', () => {
  modalNoticeMoreInProgressTasks.hide()
})
dragAndDrop()

export {
  Task,
  modalCreateNewTask,
  tasks,
  taskTitle,
  taskDescription,
  taskUserSelect,
  toDoColumnElement,
  inProgressColumnElement,
  doneColumnElement,
  id,
  modalEditTask,
  editTaskTitle,
  editTaskUserSelect,
  editTaskDescription,
  columns,
  modalNoticeDeleteAllTasks,
  modalNoticeMoreInProgressTasks,
  handleEditTask
}
