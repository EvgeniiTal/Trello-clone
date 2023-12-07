import {
  toDoColumnElement,
  inProgressColumnElement,
  doneColumnElement
} from './app.js'
import {
  buildTemplateCard
} from './templates.js'

// функция отрисовки карточек
function render(renderData) {
  let html = ''
  renderData.forEach((task) => {
    if (task.status == 'todo') {
      html += buildTemplateCard(task)
      return toDoColumnElement.innerHTML = html
    } else if (task.status == 'inprogress') {
      html += buildTemplateCard(task)
      return inProgressColumnElement.innerHTML = html
    } else if (task.status == 'done') {
      html += buildTemplateCard(task)
      return doneColumnElement.innerHTML = html
    }
  })
}

export {
  render
}
