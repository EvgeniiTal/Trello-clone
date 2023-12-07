import {
  tasks
} from './app.js'

// функция для создания шаблона карточки
function buildTemplateCard({
  id,
  title,
  description,
  user
}) {
  return `<div class="card task mt-2" id="${id}" draggable="true">
    <div class="card-body">
      <button id="deleteTaskButton" type="button" class="btn-close"></button>
      <h5 id="cardTitle" class="card-title">${title}</h5>
      <p id="cardDescription" class="card-text">${description}</p>
      <p id="cardUser" class="card-text">${user}</p>
      <button id = "editTaskButton" type="button" class="btn btn-primary">Edit</button>
    </div>
  </div>`
}

export {
  buildTemplateCard
}
