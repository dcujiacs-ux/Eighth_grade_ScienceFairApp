// ═══════════════════════════════════════════════
//  MINDORA — data.js
//  Datos estáticos de la aplicación
// ═══════════════════════════════════════════════

const QUOTES = [
  { text: "La calma no es la ausencia de tormenta, sino la paz dentro de ella.", author: "Thich Nhat Hanh" },
  { text: "Respira. Es solo un momento difícil, no una vida difícil.", author: "Anónimo" },
  { text: "Cuida tu mente como cuidas tu cuerpo.", author: "Anónimo" },
  { text: "En el silencio encontrarás lo que necesitas.", author: "Anónimo" },
  { text: "No tienes que ser perfecto para ser increíble.", author: "Anónimo" },
  { text: "Hoy es un buen día para empezar.", author: "Anónimo" },
  { text: "El descanso no es rendirse. Es recargarse.", author: "Anónimo" },
  { text: "Tu bienestar es una prioridad.", author: "Anónimo" },
  { text: "Cada momento de paz que eliges importa.", author: "Anónimo" },
  { text: "Eres más fuerte de lo que crees.", author: "Anónimo" },
  { text: "Donde va tu atención, va tu energía.", author: "Anónimo" },
  { text: "La gentileza contigo mismo es el primer paso.", author: "Anónimo" }
];

const AFFIRMATIONS = [
  { text: "Soy suficiente tal como soy.", category: "autoestima" },
  { text: "Puedo manejar lo que venga hoy.", category: "motivacion" },
  { text: "Merezco paz y tranquilidad.", category: "calma" },
  { text: "Soy capaz de superar cualquier desafío.", category: "motivacion" },
  { text: "Mi mente y cuerpo merecen descanso.", category: "calma" },
  { text: "Elijo soltar lo que no puedo controlar.", category: "calma" },
  { text: "Soy digno/a de amor y respeto.", category: "autoestima" },
  { text: "Cada día es una nueva oportunidad.", category: "motivacion" },
  { text: "Confío en el proceso de mi vida.", category: "general" },
  { text: "Tengo todo lo que necesito dentro de mí.", category: "autoestima" },
  { text: "Mi calma es más poderosa que mi miedo.", category: "calma" },
  { text: "Avanzo con confianza y gratitud.", category: "motivacion" },
  { text: "Me permito sentir y luego seguir.", category: "general" },
  { text: "Soy la persona que necesito ser hoy.", category: "autoestima" },
  { text: "La paz comienza conmigo.", category: "calma" }
];

const SELF_CARE_TIPS = [
  { emoji: "💧", title: "Hidrátate", desc: "Tomar agua regularmente mejora el estado de ánimo y la concentración.", moods: ["Cansado", "Ansioso"] },
  { emoji: "🚶", title: "Sal a caminar", desc: "5 minutos al aire libre reducen el cortisol significativamente.", moods: ["Enojado", "Ansioso"] },
  { emoji: "🌬️", title: "Respira profundo", desc: "Tres respiraciones lentas activan el sistema nervioso parasimpático.", moods: ["Ansioso", "Enojado"] },
  { emoji: "📵", title: "Desconéctate", desc: "Pon el teléfono en silencio por 15 minutos.", moods: [] },
  { emoji: "📝", title: "Escribe", desc: "Plasmar emociones en papel las hace más manejables.", moods: ["Triste", "Ansioso"] },
  { emoji: "😴", title: "Descansa", desc: "Un descanso de 10 minutos restaura energía y claridad.", moods: ["Cansado"] },
  { emoji: "🥗", title: "Come bien", desc: "El estado de ánimo y la alimentación están conectados.", moods: [] },
  { emoji: "📞", title: "Llama a alguien", desc: "Conectar con alguien querido puede cambiar tu día.", moods: ["Triste"] },
  { emoji: "⭐", title: "Celebra lo pequeño", desc: "Reconoce al menos un logro del día.", moods: ["Triste"] },
  { emoji: "🧘", title: "Estira el cuerpo", desc: "2 minutos de estiramientos liberan tensión acumulada.", moods: ["Cansado", "Enojado"] }
];

const BREATHING_EXERCISES = [
  {
    name: "Box",
    desc: "Técnica cuadrada: equilibra mente y cuerpo",
    phases: [
      { label: "Inhala...", secs: 4 },
      { label: "Sostén...", secs: 4 },
      { label: "Exhala...", secs: 4 },
      { label: "Sostén...", secs: 4 }
    ]
  },
  {
    name: "4-7-8",
    desc: "Calma el sistema nervioso rápidamente",
    phases: [
      { label: "Inhala...", secs: 4 },
      { label: "Sostén...", secs: 7 },
      { label: "Exhala...", secs: 8 }
    ]
  },
  {
    name: "Calm",
    desc: "Respiración suave para reducir la ansiedad",
    phases: [
      { label: "Inhala suave...", secs: 5 },
      { label: "Exhala suave...", secs: 5 }
    ]
  }
];

const BUBBLE_EMOJIS   = ["💜","🌿","💙","🍑","🌸","⭐","🌊","🦋","🌙","☁️","🫧","✨"];
const BUBBLE_COLORS   = [
  "rgba(155,132,204,.62)", "rgba(168,197,160,.62)",
  "rgba(168,200,232,.62)", "rgba(232,197,168,.62)",
  "rgba(232,184,210,.62)", "rgba(200,220,200,.62)"
];
