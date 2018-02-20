'use strict';
const taskList = document.querySelector('#taskList');
const deleteAll = document.querySelector('#deleteAll');
const failCounter = document.querySelector('#failed');
const doneCounter = document.querySelector('#done');
const form = document.querySelector('#addTask');
const reset = document.querySelector('#reset');
const filter = document.querySelector('#filterInput');

let done = 0;
let failed = 0;

//set up all event lsteners
setEventsListeners();
//rendering page at start
startupRender();

function setEventsListeners(){
  //Delete all button event listener
  deleteAll.addEventListener('click', clearTaskList);
  //Adding new elements to the list
  form.addEventListener('submit', formEvent);
  //Deleting the tasks from the list
  taskList.addEventListener('click', deleteTask);
  //Reset all button
  reset.addEventListener('click', resetAll);
  //adding oninput event
  filter.addEventListener('input', filterInput);
}

function formEvent(e) {
  const input = document.querySelector('#taskInput');
  const innerText = input.value;

  createNewLi(innerText);
  //saving value to local storage
  saveToStorage(innerText);

  input.value = "";
  hideDeleteAllBtn();
  e.preventDefault();
}

//Deleting the tasks from the list
function deleteTask(e) {
  //console.log(e.target.parentElement.parentElement);
  let link = e.target.parentElement.parentElement;
  if(link.classList.contains("failed")){
    link.parentElement.parentElement.remove();
    failed++;
    failCounter.innerHTML = failed;
  }
  if(link.classList.contains("done")){
    link.parentElement.parentElement.remove();
    done++;
    doneCounter.innerHTML = done;
  }
  deleteFromStorage(link.parentElement.parentElement.innerText);
  console.log(link.parentElement.parentElement.innerText);
  hideDeleteAllBtn();
};

function resetAll() {
  clearTaskList();
  failed = 0;
  failCounter.innerHTML = '';
  done = 0;
  doneCounter.innerHTML = '';
  localStorage.clear();
};

//rendering page at start
function startupRender() {
  let tasks;
  if(localStorage.getItem('tasks') !== null){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function(task, i, tasks) {
      createNewLi(task);
      hideDeleteAllBtn();
    });
  }
}
//saving to local storage
function saveToStorage(value) {
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(value);
  localStorage.setItem('tasks',JSON.stringify(tasks));
}
//deleting from local storage
function deleteFromStorage(value) {
  let tasks;
  if(localStorage.getItem('tasks') !== null){
      tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.splice(tasks.indexOf(value), 1);
  localStorage.setItem('tasks',JSON.stringify(tasks));
}
//Hiding delete button if list is empty
function hideDeleteAllBtn() {
  if (taskList.innerHTML == ''){
   deleteAll.style.display = 'none';
  } else {
    deleteAll.style.display = 'block';
  }
}

function clearTaskList() {
  taskList.innerHTML = '';
  hideDeleteAllBtn();
}

function createNewLi(value){
  let li = document.createElement('li');
  li.className = "list-group-item";

  let divText = document.createElement('div');
  divText.innerHTML = `${value}`;

  let divDone = document.createElement('div');
  divDone.style = "margin-left: auto";

  let done = document.createElement("a");
  done.href = "#";
  done.className = "done";
  let faCheck = document.createElement("i");
  faCheck.className = "fas fa-check";
  done.appendChild(faCheck);
  divDone.appendChild(done);

  let divFailed = document.createElement('div');

  let failed = document.createElement("a");
  failed.href = "#";
  failed.className = "failed";
  let faTimes = document.createElement("i");
  faTimes.className = "fas fa-times";
  failed.appendChild(faTimes);
  divFailed.appendChild(failed);

  li.appendChild(divText);
  li.appendChild(divDone);
  li.appendChild(divFailed);

  taskList.appendChild(li);
}

function filterInput(e) {
  let keyValue = e.target.value;
  let listOfTasks = document.querySelectorAll('.list-group-item');
  listOfTasks.forEach(function (task) {
    const item = task.firstChild.textContent;
    if(~item.indexOf(keyValue)){
      task.style.display = 'inline-flex';
    } else {
      task.style.display = 'none';
    }
  });
}
