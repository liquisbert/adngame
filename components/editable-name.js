// editable-name.js
// ============================================
// Componente reutilizable para editar nombres
// Funciona en 2 modos:
// 1. Modo "vista" (data-id): muestra el nombre con botón lápiz para editar
// 2. Modo "formulario" (sin data-id): input para crear nuevas criaturas
// Valida que los nombres cumplan con las reglas (2-24 caracteres, caracteres permitidos)
// ============================================

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
      background:transparent;border:none;color:#60A5FA;cursor:pointer;padding:5px;border-radius:6px;font-size:14px;
    }
    button.icon:hover{background:rgba(29,78,216,0.06)}
    .editor{display:flex;gap:8px;align-items:center}
    input{name:input; padding:6px 8px;border-radius:6px;border:1px solid rgba(29,78,216,0.12);background:rgba(13,31,60,0.85);color:#dffbf0}
    input:focus{outline:none;box-shadow:0 0 0 3px rgba(29,78,216,0.06);border-color:#1D4ED8}
    .error{border-color:#ef4444}
    .msg{font-size:12px;color:#ffb4b4;margin-left:4px}
    button.save{background:#1D4ED8;color:#001f3f;padding:5px 8px;border-radius:6px;border:none;cursor:pointer;font-size:13px}
    button.cancel{background:transparent;color:#60A5FA;border:1px solid rgba(96,165,250,0.18);padding:5px 8px;border-radius:6px;font-size:13px}
  </style>
  <span class="root">
    <span class="view">
      <span class="name-label" id="label">Nombre</span>
      <!-- Botón lápiz para editar el nombre (solo en modo vista) -->
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
    // Verificar si estamos en modo vista (con data-id) o modo formulario
    this._id = this.getAttribute('data-id') || null;
    this._label = this.shadowRoot.getElementById('label');
    this._editBtn = this.shadowRoot.getElementById('editBtn');

    if(this._id){
      // Modo vista: mostrar nombre actual con botón para editar
      const c = CreatureManager.instance().get(this._id);
      this._label.textContent = c ? c.name : 'Sin nombre';
      // Al click en el lápiz, iniciar edición
      this._editBtn.onclick = (e) => { e.stopPropagation(); this.startEdit(); };
    } else {
      // Modo formulario: mostrar solo el input (sin botones Guardar/Cancelar)
      this.renderInput('', false);
    }
  }

  // Renderizar el input de edición para crear o editar nombres
  renderInput(initial='', showButtons = true){
    this._editing = true;
    this.shadowRoot.innerHTML = '';
    const wrap = document.createElement('span');
    wrap.className = 'root';
    if (showButtons) {
      wrap.innerHTML = `
        <span class="editor">
          <!-- Input del nombre -->
          <input id="input" placeholder="Nombre de tu criatura" maxlength="24" />
          <!-- Botón guardar cambios -->
          <button class="save" id="saveBtn">Guardar</button>
          <!-- Botón cancelar edición -->
          <button class="cancel" id="cancelBtn">Cancelar</button>
        </span>
        <!-- Mensaje de error si el nombre no es válido -->
        <div class="msg" id="msg"></div>
      `;
    } else {
      wrap.innerHTML = `
        <span class="editor">
          <!-- Input del nombre (solo input en formularios) -->
          <input id="input" placeholder="Nombre de tu criatura" maxlength="24" />
        </span>
        <!-- Mensaje de error si el nombre no es válido -->
        <div class="msg" id="msg"></div>
      `;
    }
    this.shadowRoot.appendChild(document.createElement('style')).textContent = tpl.content.querySelector('style').textContent;
    this.shadowRoot.appendChild(wrap);

    this._input = this.shadowRoot.getElementById('input');
    this._msg = this.shadowRoot.getElementById('msg');
    this._saveBtn = this.shadowRoot.getElementById('saveBtn');
    this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    this._input.value = initial || this.getAttribute('value') || '';

    // Función para validar el nombre en tiempo real
    const validate = () => {
      const res = NameValidator.validate(this._input.value);
      if(!res.valid){
        // Si hay error, mostrar mensaje y desactivar botón guardar
        this._msg.textContent = res.message;
        this._input.classList.add('error');
        if(this._saveBtn) this._saveBtn.disabled = true;
      } else {
        // Si es válido, limpiar mensaje y activar botón
        this._msg.textContent = '';
        this._input.classList.remove('error');
        if(this._saveBtn) this._saveBtn.disabled = false;
      }
      return res.valid;
    };

    // Validar mientras se escribe
    this._input.addEventListener('input', (e) => {
      validate();
      // Si estamos en modo formulario, notificar cambios para que el formulario padre pueda leer el valor
      if (!showButtons) {
        this.dispatchEvent(new CustomEvent('name-changed', { detail: { value: this._input.value } }));
      }
    });
    // Permitir guardar con Enter o cancelar con Escape
    this._input.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && validate()){ 
        this.finishEdit(true); 
      } else if(e.key==='Escape'){ 
        this.finishEdit(false); 
      } 
    });
    // Si se mostraron botones (modo edición en línea), conectar sus handlers
    if (showButtons) {
      this._saveBtn = this.shadowRoot.getElementById('saveBtn');
      this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');
      this._saveBtn.onclick = ()=> { if(validate()) this.finishEdit(true); };
      this._cancelBtn.onclick = ()=> this.finishEdit(false);
    }

    // Validar al inicial y poner foco en el input
    validate();
    setTimeout(()=> this._input.focus(), 50);
  }

  // Iniciar modo edición (desde modo vista con data-id)
  startEdit(){
    if(this._editing) return;
    const current = this._label ? this._label.textContent : this.getAttribute('value') || '';
    this.shadowRoot.innerHTML = '';
    // Reutilizar el input renderizado
    this.renderInput(current);
  }

  // Finalizar edición: guardar cambios o cancelar
  finishEdit(save){
    const val = this._input ? this._input.value.trim() : null;
    if(save && val && NameValidator.validate(val).valid){
      if(this._id){
        // Modo vista: guardar en el CreatureManager y actualizar la criatura
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
