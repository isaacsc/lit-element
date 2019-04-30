const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    font-family: sans-serif;
  }

  h1 {
    background: var(--dark-color, #2a3443);
    color: var(--base-color, #fff);
    margin-top: 0;
    padding: 20px;
  }

  button {
    cursor: pointer;
  }
  
  main {
    padding: 0 12px;
  }

  ul {
    list-style: none;
    padding: 0;
  }
</style>
<h1>To do</h1>
<main>
  <input type="text" placeholder="Add a new to do"></input>
  <button>Add todo ✅</button>

  <ul id="todos"></ul>
</main>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$todoList = this._shadowRoot.querySelector('ul');
    this.$input = this._shadowRoot.querySelector('input');

    this.addEventListener('keyup', this._shortcutListener.bind(this));
    this.$submitButton = this._shadowRoot.querySelector('button');
    this.$submitButton.addEventListener('click', this._addTodo.bind(this));

    this._todos = [];
  }

  _addTodo() {
    if(this.$input.value.length > 0){
      this._todos.push({ text: this.$input.value, checked: false })
      this._renderTodoList();
      this.$input.value = '';
    }
  }

  _shortcutListener(e){
    if (e.key === 'Enter'){
      this._addTodo();
    }
  }

  _renderTodoList() {
    this.$todoList.innerHTML = '';

    this._todos.forEach((todo, index) => {
      let $todoItem = document.createElement('div');
      $todoItem.innerHTML = todo.text; 
      this.$todoList.appendChild($todoItem);
    });
  }

  set todos(value) {
    this._todos = value;
    this._renderTodoList();
  }

  get todos() {
    return this._todos;
  }
}

window.customElements.define('todo-app', TodoApp);