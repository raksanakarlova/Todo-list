const inputBox = document.querySelector('#input-box');
const mainList = document.querySelector('#todo-list');
const addBtn = document.querySelector('.add-button');
const completedList = document.querySelector('#completed-list');
const counter = document.querySelector('.counter');

const container = document.querySelector('.todo-content');

// Счетчик задач
let i = 0;
function updateCounter () {
  counter.textContent = i;
}
// Выбор при редактировании
let isEditing = false;

let selectedTask = null;

// Добавление задачи по кнопке
addBtn.addEventListener('click', addTask);

// Добавление задачи по Enter
inputBox.addEventListener('keypress', function(event) {
  if(event.key === 'Enter') {
    addTask(inputBox.value)
    inputBox.value = '';
    inputBox.focus();
  };
});

// Выполненные задачи
mainList.addEventListener('change', doneTask);

// Перемещение задач из Today Tasks в Completed Tasks
completedList.addEventListener('change', moveTaskBack);

// Редактирование задач
mainList.addEventListener('dblclick', editTask);

// Выбор задач
document.addEventListener('click', function(event) {
  const clickedTask = event.target.closest('.todo-item');
  
  if (clickedTask) {
    if (selectedTask === clickedTask) {
      selectedTask.classList.remove('edit-task');
      selectedTask = null;
    } else {
      if (selectedTask) {
        selectedTask.classList.remove('edit-task');
      }
      selectedTask = clickedTask;
      selectedTask.classList.add('edit-task');
    }
  } else {
    if (selectedTask) {
      selectedTask.classList.remove('edit-task');
      selectedTask = null;
    };
  };
});

// Удаление задач
document.addEventListener('keydown', function(event) {
  if(event.key === 'Backspace' && !isEditing && selectedTask) {
    selectedTask.remove();
    selectedTask = null;
    isEditing = false;

    i--;
    updateCounter();
  };
});

// Сохранение задач
mainList.addEventListener('keypress', saveTask);

// Функции
function addTask(event) {
  const newTaskText = inputBox.value;
  if(newTaskText) {
    const taskHTML = ` 
                    <li class="todo-item">
                       <label>
                          <input class="todo-input" type="checkbox">
                          <span class="todo-checkbox"></span>
                        </label>
                       <span class="todo-text">${newTaskText}</span>
                    </li> `;
    
    mainList.insertAdjacentHTML('beforeend', taskHTML);

    inputBox.value = '';
    inputBox.focus();

    i++;
    updateCounter();
  } else {
    alert('Please, write a task!');
  };

};

function editTask(event) {
  if(!isEditing && event.target.classList.contains('todo-item')) {
    const parentNode = event.target.closest('.todo-item');
    const text = parentNode.querySelector('.todo-text');
    parentNode.classList.add('edit-task');
    text.setAttribute('contentEditable', true);

    text.focus();
    isEditing = true;

    text.addEventListener('keydown', handleTextEditKey);
  };
};

function auxiliaryDelete() {
  const parentNode = document.querySelector('.todo-item');
  if(parentNode) {
    parentNode.remove();

    isEditing = false;
    i--;
    updateCounter();
  };
};

function handleTextEditKey(event) {
  if(event.key === 'Backspace' && !event.target.textContent.trim()) {
    auxiliaryDelete();
  };
};

function auxiliarySaving() {
  const parentNode = document.querySelector('.edit-task');
  if (parentNode) {
    const text = parentNode.querySelector('.todo-text');
    parentNode.classList.remove('edit-task');
    text.removeAttribute('contentEditable');
    isEditing = false;

    text.removeEventListener('keydown', handleTextEditKey);
  };
};

function saveTask(event) {
  if (event.key === 'Enter' && isEditing) {
    auxiliarySaving();
  };
};

function doneTask(event) {
  const parentNode = event.target.closest('.todo-item');
  const checkbox = parentNode.querySelector('.todo-input');
  const text = parentNode.querySelector('.todo-text');

  if(checkbox.checked) {
    text.classList.add('task-done');
    let completedItems = completedList.querySelectorAll('.todo-item');

    if(completedItems.length > 0) {
      completedList.insertBefore(parentNode, completedItems[0]);
    } else {
      completedList.appendChild(parentNode);
    };
  

    i--;
    updateCounter();
  };
};

function moveTaskBack(event) {
  const parentNode = event.target.closest('.todo-item');
  const checkbox = parentNode.querySelector('.todo-input');
  const text = parentNode.querySelector('.todo-text');
  
  if (!checkbox.checked) {
    text.classList.remove("task-done");
    mainList.appendChild(parentNode);

    i++;
    updateCounter();
  };
};

updateCounter();