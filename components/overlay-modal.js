// overlay-modal.js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    @keyframes fadeInBackdrop { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleInBox { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes fadeOutBackdrop { from { opacity: 1; } to { opacity: 0; } }
    @keyframes scaleOutBox { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.9) translateY(20px); } }
    
    :host { 
      position: fixed; 
      inset: 0; 
      display:flex; 
      align-items:center; 
      justify-content:center; 
      z-index:120;
      animation: fadeInBackdrop 0.2s ease-out;
    }
    
    :host.closing {
      animation: fadeOutBackdrop 0.2s ease-in forwards;
    }
    
    .back { 
      position:absolute; 
      inset:0; 
      background: rgba(0,0,0,0.45);
      cursor: pointer;
    }
    
    .box { 
      width: 320px; 
      max-width: 92%; 
      background: white; 
      border-radius:12px; 
      padding:14px; 
      box-shadow: 0 10px 40px rgba(2,6,23,0.4); 
      z-index:121;
      animation: scaleInBox 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    :host.closing .box {
      animation: scaleOutBox 0.2s ease-in forwards;
    }
  </style>
  <div class="back"></div><div class="box"><slot></slot></div>
`;

class OverlayModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    this._isClosing = false;
    this.shadowRoot.querySelector('.back').addEventListener('click', ()=> this.closeModal());
  }
  
  closeModal() {
    if (this._isClosing) return;
    this._isClosing = true;
    this.classList.add('closing');
    // Esperar a que terminen las animaciones antes de remover
    setTimeout(() => this.remove(), 200);
  }
  
  connectedCallback(){}
}
customElements.define('overlay-modal', OverlayModal);
