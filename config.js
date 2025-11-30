// config.js
// ============================================
// Sistema de evoluciones y sprites del juego
// ============================================

// Define qué formas puede tomar una criatura según su nivel
// Nivel 2: forma y energía
// Nivel 3: animales pequeños (perro, gato, conejo)
// Nivel 4: animales medianos (gallo, loro, caballo)
// ...y así sucesivamente hasta el Nivel 7 (el dragon supremo)
export const ADN_EVOLUTIONS = {
  2: ["forma", "energia"],
  3: ["perro", "gato", "conejo"],
  4: ["gallo", "loro", "caballo"],
  5: ["leon", "tigre", "lobo"],
  6: ["tiburon"],
  7: ["supremo"]
};

// Mapeo entre nombres de formas y emojis visuales
// Cada forma tiene un emoji que la representa en la interfaz
export const SPRITES = {
  sombra: "🥚",      // Estado inicial: huevito (base)
  forma: "✨",      // Primera forma: energía
  energia: "🔆",    // Segunda forma: destello
  perro: "🐶",      // Nivel 3 opción 1
  gato: "🐱",       // Nivel 3 opción 2
  conejo: "🐰",     // Nivel 3 opción 3
  gallo: "🐓",      // Nivel 4 opción 1
  loro: "🦜",       // Nivel 4 opción 2
  caballo: "🐴",    // Nivel 4 opción 3
  leon: "🦁",       // Nivel 5 opción 1
  tigre: "🐯",      // Nivel 5 opción 2
  lobo: "🐺",       // Nivel 5 opción 3
  tiburon: "🦈",    // Nivel 6: forma única
  supremo: "🐉"     // Nivel 7: forma final
};
