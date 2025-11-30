// menu-main.js
import { storageAdapter } from '../logic/StorageAdapter.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    
    h3{
      margin:0 0 8px 0;
      color:#00e5cc;
      animation: slideInUp 0.4s ease-out;
    }
    
    ul{
      list-style:none;
      padding:0;
      margin:0;
    }
    
    li{
      padding:8px 0;
      border-bottom:1px solid rgba(0, 212, 170, 0.15);
      cursor:pointer;
      transition: all 0.2s ease;
      animation: slideInLeft 0.3s ease-out;
      color: #00d4aa;
    }
    
    li:nth-child(1) { animation-delay: 0.08s; }
    li:nth-child(2) { animation-delay: 0.16s; }
    li:nth-child(3) { animation-delay: 0.24s; }
    li:nth-child(4) { animation-delay: 0.32s; }
    li:nth-child(5) { animation-delay: 0.40s; }
    
    li:hover{
      color: #00e5cc;
      padding-left: 8px;
      background: rgba(0, 212, 170, 0.15);
      border-radius: 4px;
    }
    
    .reset{
      color:#ef4444;
    }
    
    .reset:hover{
      color: #dc2626;
      background: rgba(239, 68, 68, 0.1);
    }
  </style>
  <div>
    <h3>Menú</h3>
    <ul>
      <li id="create">Crear criatura</li>
      <li id="tutorial">Tutorial</li>
      <li id="reset" class="reset">Reiniciar juego</li>
      <br />
      <br />
      <li id="view">Cerrar menu</li>
    </ul>
  </div>
`;

class MenuMain extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
  }
  
  connectedCallback(){
    this.shadowRoot.getElementById('create').onclick = () => {
      this.closeSidebar();
      const modal = document.createElement('overlay-modal');
      modal.innerHTML = `<creature-create></creature-create>`;
      document.body.appendChild(modal);
    };
    
    this.shadowRoot.getElementById('reset').onclick = () => {
      if(confirm('Reiniciar borrará TODO. Continuar?')) {
        storageAdapter.reset();
        this.closeSidebar();
      }
    };
    
    // Abrir modal de tutorial
    const tutBtn = this.shadowRoot.getElementById('tutorial');
    if (tutBtn) {
      tutBtn.onclick = () => {
        this.closeSidebar();
        const modal = document.createElement('overlay-modal');
        modal.innerHTML = `
          <div style="padding:18px;max-width:480px;color:#001f3f;background:transparent;">
            <h3 style="margin-top:0;color:#001f3f;">Cómo jugar</h3>
            <ul style="margin:8px 0 12px 18px;line-height:1.5;color:#001f3f;">
              <li><strong>Crear criaturas:</strong> la primera es <em>GRATIS</em>, las siguientes cuestan 20 puntos.</li>
              <li><strong>Acariciar:</strong> toca "Acariciar" en el detalle para ganar +2 puntos.</li>
              <li><strong>Ver detalle:</strong> haz click en una tarjeta para abrir su ficha y opciones.</li>
              <li><strong>Fusionar:</strong> combina criaturas para crear híbridos con nuevas apariencias.</li>
              <li><strong>Puntos:</strong> compra puntos desde el menú secundario o consíguelos jugando.</li>
              <li><strong>Guardado:</strong> el juego guarda automáticamente en tu navegador.</li>
            </ul>
            <div style="text-align:right;margin-top:8px;">
              <button id="closeTut" style="background:#00d4aa;color:#012; padding:6px 8px;border-radius:6px;border:none;cursor:pointer;font-size:13px;">Cerrar</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        const closeBtn = modal.querySelector('#closeTut');
        if (closeBtn) closeBtn.onclick = () => modal.remove();
      };
    }

    this.shadowRoot.getElementById('view').onclick = () => {
      this.closeSidebar();
    };
    
    // Cerrar menú cuando se hace click fuera (en la página)
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }
  
  /**
   * Cierra el sidebar
   */
  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('visible');
    }
  }
  
  /**
   * Maneja clicks fuera del menú para cerrarlo
   */
  handleOutsideClick(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    // Si el sidebar está visible
    if (sidebar && sidebar.classList.contains('visible')) {
      // Si el click NO fue en el menú ni en el botón toggle
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        this.closeSidebar();
      }
    }
  }
}
customElements.define('menu-main', MenuMain);
