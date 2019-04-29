---
layout: post
title: The future of Polymer & lit-html
description: A summary of the future of Polymer and a path to follow going ahead.
---

# Polymer & Lit Element

El futuro de [Polymer](https://www.polymer-project.org/) es algo que muchas personas se han estado preguntando desde la introducción de la versión 3 y la creación de [lit-html](https://github.com/polymer/lit-html).

En uno de nuestros proyectos más grandes, comencé a migrar (lentamente) de 1.x a 2.x aproximadamente al mismo tiempo que el equipo de Polymer estaba trabajando en la construcción de 3.x y lit-html.

Polymer 3.x y [lit-element](https://github.com/polymer/lit-element) parecen lograr el mismo objetivo de diferentes maneras.

**Entonces, ¿a dónde vamos después de Polymer 2.x?**

Por un tiempo esta pregunta no ha tenido una respuesta clara. Sin embargo, parece que ahora tenemos una idea aproximada:

* **Si proviene de Polymer 2**, Polymer 3 es algo a lo que debe actualizarse, ya que puede ser automatizado en su mayoría a través de [modulizer](https://www.polymer-project.org/3.0/docs/upgrade)
* **Si comienza desde cero**, debes usar [lit-element](https://github.com/polymer/lit-element)
* Si quieres ir con todo, haz una conversión completa y bebe cubos de café (como he hecho yo), ve directo a [lit-element](https://github.com/polymer/lit-element)

Me parece a mi que Polymer 3 va a ser la última libreria independiente de Polymer. En el futuro probablemente de dividirá en un "legacy" (`PolymerElement`) y un "core", el cual es la librería núcleo sin las clases accesorias.

Con este post resumiré la migración básica de Polymer a Lit.


## Para los recien llegados a los Web Components

Este post está dirigida principalmente a ayudar a los desarrolladores que ya utilizan Polymer a comprender el camino que tomará en el futuro. 

Sin embargo, si eres nuevo en esto, te recomiendo además la web de [lit-html](https://polymer.github.io/lit-html/) para ver cómo funciona todo esto. 

Actualmente, los web components tienen un amplio soporte en todos los navegadores principales y los recomendaría a menudo sobre el uso de un marco completo.

# Definiendo un elemento

## Polymer 2.x

```html
<dom-module id="my-polymer-element">
  <template>My element!</template>
  <script>
    class MyPolymerElement extends Polymer.Element {
      static get is() { return 'my-polymer-element'; }
    }
    customElements.define('my-polymer-element', MyPolymerElement);
  </script>
</dom-module>
```

## Polymer 3.x

```js
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class MyPolymerElement extends PolymerElement {
  static get is() { return 'my-polymer-element'; }
  static get template() {
    return html`My element!`;
  }
}

customElements.define('my-polymer-element', MyPolymerElement);
```

## LitElement

```js
import {LitElement, html} from '@polymer/lit-element';

class MyLitElement extends LitElement {
  render() {
    return html`My element!`;
  }
}

customElements.define('my-lit-element', MyLitElement);
```

Como se puede ver, no hay muchas diferencias entre Polymer 3 y Lit.

La gran diferencia entre Polymer 2 y Lit es la eliminación de `dom-module`. Ahora los templates se definen desde el Javascript.... Lo que genera una especie de amor odio.

Hay una [propuesta](https://github.com/w3c/webcomponents/issues/645) que permite traer los templates desde un archivo HTML, para los que lo prefieran por separado.

# Bindings

Todos los bindings en LitElements son expresiones nativas de Javascript, no como la sitaxis customizada de Polymer.

Aqui dejo un resumen rápido de como han cambiado los bindings:

| Polymer | Lit |
| --- | --- |
| `[[foo]]` | `${this.foo}` |
| `{% raw %}{{foo}}{% endraw %}` | `${this.foo}` con un event listener (e.g. `input` en los inputs) |
| `<my-el prop="[[foo]]">` | `<my-el .prop=${this.foo}>` |
| `<my-el prop$="[[foo]]">` | `<my-el prop=${this.foo}>` |
| `<input checked="[[checked]]">` | `<input ?checked=${this.checked}>` |
| `<button on-click="_onClick">` | `<button @click=${(e) => this._onClick(e)}>` |

## Two-way bindings

En Lit solo hay bindings de una dirección, ya que simplemente se transmiten hacia abajo en expresiones Javascript. No existe el concepto del binding bi-direccional o de empujar variables hacia arriba en el árbol de nodos.

En lugar del two-way bindings, ahora se pueden usar eventos o un store de estados.

Esto puede ser muy sencillo de implementar si el evento ya existe como un elemento input:

```js
render() {
  return html`<input type="text" @input=${(e) => this._onInput(e)}>`;
}

_onInput(e) {
  this._value = e.currentTarget.value;
}
```
Como se puede ver, se usa simplemente un evento `input` nativo y actualizamos el valor de la propiedad al cambiar el valor.

# Elementos de ayuda

Polymer tiene algunos elementos de ayuda para proveer una solución a lo conceptos/funcionalidades más comunes.

En lugar de estos elementos DOM, simplemente puedes implementar la misma lógica de una mejor manera que como lo hace javascript de menera nativa, usando condicionales y controladores de flujo como lo haces en cualquier otra parte de la aplicación.

## `dom-repeat`

`dom-repeat` es innecesari ya que en Lit podemos hacer un map de una lista al renderizar.

### Polymer

```html
Item List:
<dom-repeat items="[[foo]]">
  <template>
    <span>[[item.prop]]</span>
  </template>
</dom-repeat>
```

### Lit

```js
const items = this.foo.map(item => html`<span>${item.prop}</span>`);

return html`
  Item List:
  ${items}
`;
```

## `dom-if`

De una manera similar el `dom-if` es simplemente una condición ternaria en el metodo render.

### Polymer

```html
<template is="dom-if" if="[[condition]]">
  <span>Condition was truthy</span>
</template>
<template is="dom-if" if="[[!condition]]">
  <span>Condition was falsy</span>
</template>
```

### Lit

```js
return html`<span>Condition was ${this.condition ? 'truthy' : 'falsy'}</span>`;
```

# Custom Styles

Los Custom styles exiten para permitir compartir estilos entre elementos:

```html
<dom-module id="my-custom-style">
  <template>
    <style>* { color: hotpink; }</style>
  </template>
</dom-module>

<!-- meanwhile, elsewhere... -->

<style include="my-custom-style">
/* ... */
</style>
```

Con Lit, ya no es necesario ese concepto ya que los estilos pueden ser compartidos por interpolación:

```js
render() {
  const sharedStyles = getSharedStyles(); // Could come from a file, wherever.
  return html`
    <style>${sharedStyles}</style>
    <span>My element!</span>`;
}
```

Como se puede ver, el CSS se puede importar en el template desde cualquier parte. Ya no es necesario de crear un módulo.

# Propiedades

Ahora la parte divertida!! Propiedades....

Las Propiedades en Lit se configuran de una manera muy similar a Polymer. Definen el tipo y un par de opciones.

## Polymer

```js
static get properties() {
  return {
    myProperty: Boolean,
    mySecondProperty: {
      type: String,
      reflectToAttribute: true
    }
  };
}
```

## Lit

```js
static get properties() {
  return {
    myProperty: { type: Boolean },
    mySecondProperty: {
      type: String,
      reflect: true
    }
  };
}
```

Como se puede ver, las dos definiciones son muy parecidas. Aunque Lit elimina alguna de las opciones. Además Lit va un poco más alla ya que tambien usa un decorador para esto:

```js
@property({ type: Boolean })
myProperty = false;
```

Hay que tener en cuenta que los decoradores necesitan algo tipo TypeScript o Babel, por ahora, para que se pueda usar.

## Propiedades privadas y protegidas

Merece la pena destacar que las propiedades protegidas y protegidas deben definirse en Lit en el método get de `properties`:

```js
static get properties() {
  return {
    myProp: { type: String },
    _myProtectedProp: { type: String },
    __myPrivateProp: { type: String }
  }
}
```

La razón de esto, por defecto es **Lit no refleja las propiedades en atributos**. Esto significa que nuestros métodos protegidos/privados serán invisibles en el DOM, pero aún se pueden observar por Lit para activar repeticiones.

## Configuración de propiedades

Como se mencionó anteriormente, algunas opciones de propiedades han desaparecido. Así que aquí está lo que podemos hacer en lugar de...

### `reflectToAttribute`

Lit mantiene esta funcionalidad pero como `reflect`:

```js
class MyElement extends LitElement {
  static get properties() {
    return {
      myProp: {
        type: String,
        reflect: true
      }
    };
  }
}
```

### `value`

Los valores por defecto se definen en el constructor:

```js
class MyElement extends LitElement {
  static get properties() {
    return { myProp: { type: String } };
  }

  constructor() {
    super();
    this.myProp = 'default value';
  }
}
```

### `readOnly`

No existe el concepto de propieded read-only en Lit, pero podemos simularlo un método get regular de javascript:

```js
class MyElement extends LitElement {
  static get properties() {
    return { _myProperty: { type: String } };
  }

  get readOnlyProperty() {
    return this._myProperty;
  }
}
```

Entonces cada vez que queramos actulizarla, simplemtente damos valor a `_myProperty` y Lit sabrá que tiene que repintarla. Podemos usar los métodos mencionados anteriormente en el post tambien para reflejar la propiedad de solo lectura del atributo en `_didRender`
Then any time we want to update it, we simply set `_myProperty` and Lit will
know to trigger a re-render. We can use the methods discussed earlier in this
post to also reflect the read-only property to the attribute in `_didRender`.

### `notify`

Viendo que no hay "two-way bindings" en Lit, la opción de `notify` desaparece. Ya no es necesario usarla

Para implementar algo parecido, lo que realmente se debe usar es algún tipo de almacen de estados o crear el tuyo propio (si necesitas uno realmente simple). Algo tipo [Redux](https://redux.js.org/) funcionará bien.

Si aun usas elementos de Polymer, puedes lanzar un evento `my-property-changed` para que el elemento padre lo recoja:

```js
this.dispatchEvent(new CustomEvent('my-property-changed'));
```

### `computed`

En lugar de la opción `computed`de polymer, simplemente se puede usar un método get:

```js
class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: { type: String },
      prop2: { type: String }
    };
  }

  get computedProperty() {
    return `${this.prop1}${this.prop2}`;
  }

  render() {
    return html`Value is: ${this.computedProperty}`;
  }
}
```

Viendo que el método render se llama cada vez que hay un cambio en las propiedades, esto debería de funcionar bien.

# Observers

Aun no he pensado en una buena forma de hacer observer, pero creo que la necesidad de usarlos se desvanece al poder llamar a otros métodos en nuestro método render.

Sin embargo, si quieres hacer algo  cuando una propiedad cambia, se supone que el mejor luegar para hacerlo es el metodo `update`:

```js
updated(changedProps) {
  if (changedProps.has('myProp')) {
    this._onMyPropChanged(this.myProp, changedProps.get('myProp'));
  }
}
```

If you were using Polymer to observe deep changes like sub-properties of
objects and splices of arrays, you can consider one of the following solutions:

* Use a state store
* Use something like [immutable](https://facebook.github.io/immutable-js/)
so deep changes will create a new object and thus trigger a re-render
* Implement (or use a library) a deep-comparison method to behave as a dirty
check.

# Events

Event handlers can be added to elements in a similar way to Polymer:

```js
render() {
  return html`<button @click=${(e) => this._onClick(e)}>`;
}
```

Though it is probably a good idea to create these handlers in your
constructor to avoid re-creating the function every time:

```js
constructor() {
  super();
  this._boundOnClick = this._onClick.bind(this);
}

render() {
  return html`<button @click=${this._boundOnClick}>`;
}
```

For adding events to the current element, it makes sense to simply use
the native `connectedCallback`:

```js
constructor() {
  super();
  this._boundOnClick = this._onClick.bind(this);
}

connectedCallback() {
  super.connectedCallback();
  this.addEventListener('click', this._boundOnClick);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.removeEventListener('click', this._boundOnClick);
}
```

# Routing

The `app-route` element is a bit of an anti-pattern. It was always a little
unusual to define routing information in markup. It was pretty much a wrapper
around a useful library.

Anyhow, when using Lit we have no such element so you may be wondering what
we should use instead.

The answer to this is: whatever you want.

Here are a few libraries:

* [page.js](https://github.com/visionmedia/page.js)
* [director](https://github.com/flatiron/director)
* Create your own!

I opted with [page.js](https://github.com/visionmedia/page.js) as I have a fairly
simple routing strategy and only need to re-render when one parameter changes:

```js
class MyElement extends LitElement {
  static get properties() {
    return { _view: { type: String } };
  }

  constructor() {
    page('/view/:view', (ctx) => {
      this._view = ctx.params.view;
    });
    page();
  }
}
```

However, this is just a quick example and should be taken with a grain of
salt. There are several problems, like re-using this element will try to
re-define the routes and make bad things happen!

Also, I only ever have one instance of this element so don't have to worry
about doing this logic in the constructor.

# Wrap up

As you can see, [lit-element](https://github.com/polymer/lit-element) is
quite different from [Polymer](https://www.polymer-project.org/).

The migration between the two isn't something you can easily do in a large
project, it will definitely take some of time.

I asked a few questions when looking into Lit:

* Will it keep its name and location (in the polymer project)?
* Will it look anything like it does now when it reaches 1.0?
* Will the browser APIs it depends on change as drastically as they did with
Polymer? (even sometimes disappearing from underneath us, HTML imports...)

These and plenty more questions are really to be asked to the Polymer team,
but I personally would hold off on using it in production until they have
answers.

The last question is one a lot of people will be asking because Polymer
experienced it a few times. Most or all of the specs are now stable and
widely accepted, so its safe to say Lit likely won't go through those
same drastic changes.

My opinion on this is that you let Lit settle a bit, see it reach 1.0 and
then make your decision.

If you want to move from Polymer 2.x, it is probably best to go to Polymer
3.x for now using the [modulizer](https://www.polymer-project.org/3.0/docs/upgrade)
and then gradually migrate to LitElement how you like.

For a long time, Web Components and Polymer were seen as unstable, ever-changing
and experimental. Maybe now we can see some wider adoption and grow our community
more than ever before.