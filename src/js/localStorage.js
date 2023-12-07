// получение данных из локалсторэдж
function getData(key = '') {
  return localStorage.getItem(key)
}

// сохранение данных в локалсторэдж
function setData(key = '', value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export {
  getData,
  setData
}
