import { LitElement, html, css } from 'lit-element';
import './todo-item.js';

class TodoApp extends LitElement {
  static get properties() {
    return {
      todos: { type: Array }
    }
  }

  constructor() {
    super();
    this.todos = [
      { text: 'Recap', checked: true },
      { text: 'Properties and attributes', checked: false },
      { text: 'Lifecycle and rerendering', checked: false },
      { text: 'Conclusion', checked: false }
    ];
  }

  firstUpdated() {
    this.$input = this.shadowRoot.querySelector('input');
  }

  _removeTodo(e) {
    this.todos = this.todos.filter((todo,index) => {
      return index !== e.detail;
    });
  }

  _toggleTodo(e) {
    this.todos = this.todos.map((todo, index) => {
      return index === e.detail ? {...todo, checked: !todo.checked} : todo;
    });
  }

  _addTodo(e) {
    e.preventDefault();
    if(this.$input.value.length > 0) {
      this.todos = [...this.todos, { text: this.$input.value, checked: false }];
      this.$input.value = '';
    }
  }

  static get styles() {
    return css`
      host {
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

      input {
        width: 80%;
        height: 20px;
      }
      
      main {
        padding: 0 12px;
      }

      ul {
        list-style: none;
        padding: 0;
      }
    `;
  }

  render() {
    return html`
      <h1>To do</h1>
      <h3>LitElement</h3>
      <main>
        <form id="todo-input">
          <input type="text" placeholder="Add a new to do"></input>
          <button @click=${this._addTodo}>Add todo ✅</button>
        </form>
      </main>
      <ul id="todos">
        ${this.todos.map((todo, index) => html`
          <todo-item 
            ?checked=${todo.checked}
            .index=${index}
            text=${todo.text}
            @onRemove=${this._removeTodo}
            @onToggle=${this._toggleTodo}>    
          </todo-item>`
        )}
      </ul>
    `;
  }
}

window.customElements.define('todo-app', TodoApp);