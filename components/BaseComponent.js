// BaseComponent.js
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    if (this.constructor.template) {
      this.attachShadow({ mode: 'open' }).appendChild(this.constructor.template.content.cloneNode(true));
    } else {
      this.attachShadow({ mode: 'open' });
    }
  }

  $(sel) { return this.shadowRoot.querySelector(sel); }
  $all(sel) { return this.shadowRoot.querySelectorAll(sel); }

  // convenience to dispatch global game events
  trigger(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}
