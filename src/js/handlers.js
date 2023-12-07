import {
  eventListeners
} from '@popperjs/core'
import * as bootstrap from 'bootstrap'
import {
  modalCreateNewTask,
  tasks,
  taskTitle,
  taskDescription,
  taskUserSelect,
  toDoColumnElement,
  Task,
  id,
  modalEditTask,
  editTaskTitle,
  editTaskUserSelect,
  editTaskDescription,
  columns,
  modalNoticeMoreInProgressTasks,
  modalNoticeDeleteAllTasks
} from './app.js'
import {
  setData
} from './localStorage.js'
import {
  buildTemplateCard
} from './templates.js'
import {
  render
} from './render.js'

// обработчик отображения модального окна создания новой задачи
function showModal() {
  modalCreateNewTask.show()
}

// обработчик создания новой задачи
function saveTask() {
  const task = new Task(taskTitle.value, taskDescription.value, taskUserSelect.value)
  tasks.push(task)
  taskTitle.value = ''
  taskDescription.value = ''
  taskUserSelect.value = ''
  modalCreateNewTask.hide()
  toDoColumnElement.insertAdjacentHTML('beforeend', buildTemplateCard(task))
  setData('tasks', tasks)
}

// обработчик удаления задачи
function handleDeleteTask(event) {
  const target = event.target
  if (target.id === 'deleteTaskButton') {
    const parent = target.closest('.task')
    parent.remove()
    const id = parent.getAttribute('id')
    const index = tasks.findIndex(task => task.id === Number(id))
    tasks.splice(index, 1)
    setData('tasks', tasks)
  }
}

// обработчик сохранения изменений
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

// обработчик удаления всех задач
function deleteAllTasks() {
  const doneTasks = tasks.filter(task => task.status === 'done')
  doneTasks.forEach(task => {
    const index = tasks.findIndex(t => t.id === task.id)
    tasks.splice(index, 1)
  })
  columns[2].innerHTML = ''
  modalNoticeDeleteAllTasks.hide()
  setData('tasks', tasks)
}

export {
  showModal,
  saveTask,
  handleDeleteTask,
  saveEdits,
  deleteAllTasks
}
