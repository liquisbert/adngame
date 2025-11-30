// editable-name.js
import { CreatureManager } from '../logic/CreatureManager.js';
import { NameValidator } from '../logic/NameValidator.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host{display:inline-block;font-family:inherit;color:inherit}
    .view{
      display:flex;align-items:center;gap:8px;
    }
    .name-label{
      font-size:18px;font-weight:700;color:#001f3f;
      word-break:break-word;
    }
    button.icon{
      background:transparent;border:none;color:#9eeed4;cursor:pointer;padding:5px;border-radius:6px;font-size:14px;
    }
    button.icon:hover{background:rgba(0,212,170,0.06)}
    .editor{display:flex;gap:8px;align-items:center}
    input{name:input; padding:6px 8px;border-radius:6px;border:1px solid rgba(0,212,170,0.12);background:rgba(13,31,60,0.85);color:#dffbf0}
    input:focus{outline:none;box-shadow:0 0 0 3px rgba(0,212,170,0.06);border-color:#00d4aa}
    .error{border-color:#ef4444}
    .msg{font-size:12px;color:#ffb4b4;margin-left:4px}
    button.save{background:#00d4aa;color:#001f3f;padding:5px 8px;border-radius:6px;border:none;cursor:pointer;font-size:13px}
    button.cancel{background:transparent;color:#9eeed4;border:1px solid rgba(158,238,212,0.08);padding:5px 8px;border-radius:6px;font-size:13px}
  </style>
  <span class="root">
    <span class="view">
      <span class="name-label" id="label">Nombre</span>
      <button class="icon" id="editBtn" title="Editar nombre">✏️</button>
    </span>
  </span>
`;

class EditableName extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this._editing = false;
  }

  connectedCallback(){
    this._id = this.getAttribute('data-id') || null;
    this._label = this.shadowRoot.getElementById('label');
    this._editBtn = this.shadowRoot.getElementById('editBtn');

    if(this._id){
      const c = CreatureManager.instance().get(this._id);
      this._label.textContent = c ? c.name : 'Sin nombre';
      this._editBtn.onclick = (e) => { e.stopPropagation(); this.startEdit(); };
    } else {
      // input mode for forms
      this.renderInput();
    }
  }

  renderInput(initial=''){
    this._editing = true;
    this.shadowRoot.innerHTML = '';
    const wrap = document.createElement('span');
    wrap.className = 'root';
    wrap.innerHTML = `
      <span class="editor">
        <input id="input" placeholder="Nombre de tu criatura" />
        <button class="save" id="saveBtn">Guardar</button>
        <button class="cancel" id="cancelBtn">Cancelar</button>
      </span>
      <div class="msg" id="msg"></div>
    `;
    this.shadowRoot.appendChild(document.createElement('style')).textContent = tpl.content.querySelector('style').textContent;
    this.shadowRoot.appendChild(wrap);

    this._input = this.shadowRoot.getElementById('input');
    this._msg = this.shadowRoot.getElementById('msg');
    this._saveBtn = this.shadowRoot.getElementById('saveBtn');
    this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    this._input.value = initial || this.getAttribute('value') || '';

    const validate = () => {
      const res = NameValidator.validate(this._input.value);
      if(!res.valid){ this._msg.textContent = res.message; this._input.classList.add('error'); this._saveBtn.disabled = true; }
      else { this._msg.textContent = ''; this._input.classList.remove('error'); this._saveBtn.disabled = false; }
      return res.valid;
    };

    this._input.addEventListener('input', validate);
    this._input.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && validate()){ this.finishEdit(true); } else if(e.key==='Escape'){ this.finishEdit(false); } });
    this._saveBtn.onclick = ()=> { if(validate()) this.finishEdit(true); };
    this._cancelBtn.onclick = ()=> this.finishEdit(false);

    // initial validate
    validate();
    setTimeout(()=> this._input.focus(), 50);
  }

  startEdit(){
    if(this._editing) return;
    const current = this._label ? this._label.textContent : this.getAttribute('value') || '';
    this.shadowRoot.innerHTML = '';
    // reuse input rendering
    this.renderInput(current);
  }

  finishEdit(save){
    const val = this._input ? this._input.value.trim() : null;
    if(save && val && NameValidator.validate(val).valid){
      if(this._id){
        CreatureManager.instance().update(this._id, { name: val });
        window.dispatchEvent(new Event('game:storageChanged'));
        // restore view
        this.shadowRoot.innerHTML = '';
        this.attachShadow({mode:'open'}); // noop but keep consistent
        this.shadowRoot.appendChild(tpl.content.cloneNode(true));
        this._label = this.shadowRoot.getElementById('label');
        this._editBtn = this.shadowRoot.getElementById('editBtn');
        this._label.textContent = val;
        this._editBtn.onclick = (e) => { e.stopPropagation(); this.startEdit(); };
        this._editing = false;
      } else {
        // fire event for forms
        this.dispatchEvent(new CustomEvent('name-changed', { detail: { value: val } }));
      }
    } else {
      // cancel or invalid
      if(this._id){
        // restore existing name
        const c = CreatureManager.instance().get(this._id);
        const name = c ? c.name : '';
        this.shadowRoot.innerHTML = '';
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(tpl.content.cloneNode(true));
        this._label = this.shadowRoot.getElementById('label');
        this._editBtn = this.shadowRoot.getElementById('editBtn');
        this._label.textContent = name;
        this._editBtn.onclick = (e) => { e.stopPropagation(); this.startEdit(); };
        this._editing = false;
      } else {
        // restore default input view
        this.shadowRoot.innerHTML = '';
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(tpl.content.cloneNode(true));
        this.renderInput(this.getAttribute('value')||'');
      }
    }
  }

  // For form usage
  get value(){
    if(this._input) return this._input.value.trim();
    return this.getAttribute('value') || '';
  }

  isValid(){
    return NameValidator.validate(this.value).valid;
  }
}

customElements.define('editable-name', EditableName);
