const STORAGE_KEY = "daymark-todos";

const state = {
  todos: loadTodos(),
  filter: "all",
};

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const emptyMessage = document.querySelector("#empty-message");
const taskCount = document.querySelector("#task-count");
const dateLabel = document.querySelector("#date-label");

dateLabel.textContent = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  state.todos.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });
  input.value = "";
  saveAndRender();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    render();
  });
});

document.querySelector("#clear-completed").addEventListener("click", () => {
  state.todos = state.todos.filter((todo) => !todo.completed);
  saveAndRender();
});

function loadTodos() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  render();
}

function render() {
  const visibleTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  list.replaceChildren(...visibleTodos.map(createTodoElement));
  emptyState.hidden = visibleTodos.length > 0;
  emptyMessage.textContent = state.filter === "completed" ? "Nothing completed yet." : state.filter === "active" ? "You are all caught up." : "Your list is clear.";

  const openCount = state.todos.filter((todo) => !todo.completed).length;
  taskCount.textContent = `${openCount} open`;
}

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = `todo-item${todo.completed ? " is-complete" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `Mark ${todo.text} ${todo.completed ? "open" : "done"}`);
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    saveAndRender();
  });

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "×";
  deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);
  deleteButton.addEventListener("click", () => {
    state.todos = state.todos.filter((item) => item.id !== todo.id);
    saveAndRender();
  });

  item.append(checkbox, text, deleteButton);
  return item;
}

render();