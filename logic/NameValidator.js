// NameValidator.js
// ============================================
// Validador de nombres para criaturas
// Asegura que los nombres cumplan con reglas básicas
// ============================================

export const NameValidator = {
  min: 2,    // Mínimo de caracteres
  max: 24,   // Máximo de caracteres
  
  // Expresión regular que permite letras, números, espacios, guiones, guion bajo, apóstrofe y punto
  re: /^[\p{L}\p{N}\s\-_'\.]{2,24}$/u,

  // Validar un nombre y devolver si es válido o un mensaje de error
  validate(name){
    const val = (name || '').trim();
    
    if(val.length === 0) {
      return { valid:false, message: 'El nombre es requerido.' };
    }
    if(val.length < this.min) {
      return { valid:false, message: `El nombre debe tener al menos ${this.min} caracteres.` };
    }
    if(val.length > this.max) {
      return { valid:false, message: `El nombre no puede superar ${this.max} caracteres.` };
    }
    if(!this.re.test(val)) {
      return { valid:false, message: 'Sólo se permiten letras, números, espacios, guiones, guion bajo y .' };
    }
    
    // Si pasó todas las validaciones, es válido
    return { valid:true, message: '' };
  }
};
