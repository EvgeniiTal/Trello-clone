import {
  columns,
  tasks,
  modalNoticeMoreInProgressTasks,
  handleEditTask
} from './app.js'
import {
  setData
} from './localStorage.js'
import {
  handleDeleteTask
} from './handlers.js'

// функция перетаскивания
function dragAndDrop() {
  let card
  let id
  columns.forEach((item) => {
    item.addEventListener('dragstart', (event) => {
      card = event.target
      id = card.getAttribute('id')
    })
    item.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    item.addEventListener('dragenter', (event) => {
      event.preventDefault()
    })
    item.addEventListener('dragleave', (event) => {
      event.preventDefault()
    })
    item.addEventListener('drop', function (event) {
      event.preventDefault()
      const {
        status: column
      } = item.dataset
      const index = tasks.findIndex(task => task.id === Number(id))
      const task = tasks[index]
      task.status = column
      const inProgressTasks = tasks.filter(task => task.status === 'inprogress')
      if (column === 'inprogress' && inProgressTasks.length > 6) {
        modalNoticeMoreInProgressTasks.show()
        return
      } else {
        this.append(card)
      }
      setData('tasks', tasks)
    })
    item.addEventListener('click', handleDeleteTask)
    item.addEventListener('click', handleEditTask)
  })
}

export {
  dragAndDrop
}
