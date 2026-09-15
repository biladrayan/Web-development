const storageKey = 'focus-list-tasks';
let tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
let filter = 'all';

const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#new-task');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const taskSummary = document.querySelector('#task-summary');
const clearCompleted = document.querySelector('#clear-completed');
const filterButtons = document.querySelectorAll('.filter');

function saveTasks() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
function visibleTasks() { return tasks.filter(task => filter === 'all' || (filter === 'active' ? !task.completed : task.completed)); }
function taskMarkup(task) {
  return `<li class="task-item${task.completed ? ' is-completed' : ''}" data-id="${task.id}">
    <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark ${escapeHtml(task.title)} as ${task.completed ? 'active' : 'completed'}">
    <span class="task-title">${escapeHtml(task.title)}</span>
    <button class="task-action" type="button" data-action="edit">Edit</button>
    <button class="task-action delete" type="button" data-action="delete">Delete</button>
  </li>`;
}
function escapeHtml(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
function render() {
  const shown = visibleTasks();
  taskList.innerHTML = shown.map(taskMarkup).join('');
  emptyState.hidden = shown.length > 0;
  const activeCount = tasks.filter(task => !task.completed).length;
  taskSummary.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
  clearCompleted.disabled = !tasks.some(task => task.completed);
}
function updateTask(id, changes) { tasks = tasks.map(task => task.id === id ? { ...task, ...changes } : task); saveTasks(); render(); }

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() });
  saveTasks(); form.reset(); taskInput.focus(); render();
});

taskList.addEventListener('change', event => {
  if (event.target.type !== 'checkbox') return;
  const id = event.target.closest('.task-item').dataset.id;
  const task = tasks.find(item => item.id === id);
  updateTask(id, { completed: !task.completed });
});

taskList.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = button.closest('.task-item');
  const id = item.dataset.id;
  if (button.dataset.action === 'delete') { tasks = tasks.filter(task => task.id !== id); saveTasks(); render(); return; }
  if (button.dataset.action === 'cancel') { render(); return; }
  const task = tasks.find(entry => entry.id === id);
  item.innerHTML = `<form class="edit-form"><label class="sr-only" for="edit-${id}">Edit task</label><input id="edit-${id}" value="${escapeHtml(task.title)}" maxlength="120" required><button>Save</button><button type="button" data-action="cancel">Cancel</button></form>`;
  item.querySelector('input').focus();
});

taskList.addEventListener('submit', event => {
  const editForm = event.target.closest('.edit-form');
  if (!editForm) return;
  event.preventDefault();
  const title = editForm.querySelector('input').value.trim();
  if (title) updateTask(editForm.closest('.task-item').dataset.id, { title });
});

filterButtons.forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  filterButtons.forEach(item => { const selected = item === button; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)); });
  render();
}));
clearCompleted.addEventListener('click', () => { tasks = tasks.filter(task => !task.completed); saveTasks(); render(); });
render();
