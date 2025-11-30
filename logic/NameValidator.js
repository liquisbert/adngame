// NameValidator.js
// Reglas comunes para nombres de criaturas
export const NameValidator = {
  min: 2,
  max: 24,
  // Allow letters (including accents), numbers, spaces, hyphen, underscore and apostrophe
  re: /^[\p{L}\p{N}\s\-_'\.]{2,24}$/u,

  validate(name){
    const val = (name || '').trim();
    if(val.length === 0) return { valid:false, message: 'El nombre es requerido.' };
    if(val.length < this.min) return { valid:false, message: `El nombre debe tener al menos ${this.min} caracteres.` };
    if(val.length > this.max) return { valid:false, message: `El nombre no puede superar ${this.max} caracteres.` };
    if(!this.re.test(val)) return { valid:false, message: 'Sólo se permiten letras, números, espacios, guiones, guion bajo y .' };
    return { valid:true, message: '' };
  }
};
