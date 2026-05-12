import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════════════════

const MODES = [
  { id: "discipline", emoji: "🔥", label: "Discipline", color: "#c0392b", palette: { bg: "#0f0808", mid: "#1a0808", accent: "#c0392b" }, desc: "Ferme & structurée" },
  { id: "focus", emoji: "🎯", label: "Focus", color: "#5b8db8", palette: { bg: "#080f14", mid: "#0a1520", accent: "#5b8db8" }, desc: "Concentration totale" },
  { id: "glow_up", emoji: "✨", label: "Glow Up", color: "#d4af37", palette: { bg: "#0f0e08", mid: "#1a1808", accent: "#d4af37" }, desc: "Rayonnante & confiante" },
  { id: "healing", emoji: "🌸", label: "Healing", color: "#c084a0", palette: { bg: "#0f0810", mid: "#180a18", accent: "#c084a0" }, desc: "Douceur & bienveillance" },
  { id: "spiritual", emoji: "🌙", label: "Spiritual Reset", color: "#8b7ab5", palette: { bg: "#09080f", mid: "#100a1a", accent: "#8b7ab5" }, desc: "Sagesse & recentrage" },
  { id: "soft", emoji: "🕊️", label: "Soft Life", color: "#b8a9c9", palette: { bg: "#0c0a10", mid: "#160f1e", accent: "#b8a9c9" }, desc: "Grâce & douceur" },
];

const QUOTES = [
  "Tu es exactement là où tu dois être.",
  "Ta douceur est ta force, pas ta faiblesse.",
  "Le luxe commence par se choisir soi-même.",
  "Tu mérites tout ce que tu t'apprêtes à construire.",
  "Ton énergie est précieuse — protège-la.",
  "La discipline, c'est te donner ce que tu veux vraiment.",
  "Chaque jour est une nouvelle page de ton histoire.",
  "Prends soin de toi comme de ce que tu aimes le plus.",
];

const MOODS = [
  { id: "radiant", emoji: "🌟", label: "Rayonnante", color: "#d4af37" },
  { id: "soft", emoji: "🌸", label: "Douce", color: "#c084a0" },
  { id: "calm", emoji: "🕊️", label: "Calme", color: "#8ba8c4" },
  { id: "tired", emoji: "🌙", label: "Fatiguée", color: "#7a6b8a" },
  { id: "anxious", emoji: "🌊", label: "Anxieuse", color: "#5b7a8a" },
  { id: "powerful", emoji: "🔥", label: "Puissante", color: "#c0392b" },
];

const CYCLE_PHASES = [
  { id: "menstrual", label: "Menstruelle", days: "J1–J5", color: "#c0392b", emoji: "🌹", tip: "Repos & douceur. Ton corps travaille dur." },
  { id: "follicular", label: "Folliculaire", days: "J6–J13", color: "#d4af37", emoji: "🌱", tip: "Énergie montante. Parfaite pour créer & planifier." },
  { id: "ovulatory", label: "Ovulatoire", days: "J14–J16", color: "#f5c842", emoji: "✨", tip: "Pic d'énergie. Tu rayonnes naturellement !" },
  { id: "luteal", label: "Lutéale", days: "J17–J28", color: "#8b7ab5", emoji: "🌙", tip: "Introspection. Écoute tes besoins profonds." },
];

const RITUALS = [
  { id: "water", emoji: "💧", label: "Eau (2L)", cat: "santé" },
  { id: "skincare_am", emoji: "🧴", label: "Skincare matin", cat: "beauté" },
  { id: "skincare_pm", emoji: "✨", label: "Skincare soir", cat: "beauté" },
  { id: "hair", emoji: "🌿", label: "Soin cheveux", cat: "beauté" },
  { id: "sport", emoji: "🏃‍♀️", label: "Mouvement", cat: "santé" },
  { id: "prayer", emoji: "🤲", label: "Prière", cat: "spirituel" },
  { id: "journal", emoji: "📖", label: "Journaling", cat: "mental" },
  { id: "vitamins", emoji: "💊", label: "Vitamines", cat: "santé" },
];

const TASK_TEMPLATES = [
  { emoji: "📚", label: "Réviser", proof: "summary", duration: 60 },
  { emoji: "🏃‍♀️", label: "Sport", proof: "timer", duration: 30 },
  { emoji: "💧", label: "Boire 2L d'eau", proof: "photo", duration: null },
  { emoji: "🤲", label: "Prière", proof: "timer", duration: 10 },
  { emoji: "📖", label: "Lire", proof: "timer", duration: 20 },
  { emoji: "🧘‍♀️", label: "Méditer", proof: "timer", duration: 15 },
  { emoji: "📱", label: "Publier du contenu", proof: "summary", duration: null },
  { emoji: "🧹", label: "Ranger", proof: "photo", duration: null },
  { emoji: "🎬", label: "Monter une vidéo", proof: "summary", duration: null },
  { emoji: "😴", label: "Dormir plus tôt", proof: "timer", duration: null },
];

const BLOCKED_APPS = [
  { id: "tiktok", emoji: "🎵", label: "TikTok" },
  { id: "instagram", emoji: "📷", label: "Instagram" },
  { id: "snapchat", emoji: "👻", label: "Snapchat" },
  { id: "youtube", emoji: "▶️", label: "YouTube" },
  { id: "games", emoji: "🎮", label: "Jeux" },
];

const TIPS_DATA = [
  {
    id: "visage", emoji: "🌹", label: "Visage", color: "#c084a0",
    tips: [
      { title: "Double nettoyage le soir", tag: "Essentiel", content: "Commence par une huile nettoyante pour dissoudre maquillage et SPF, puis un nettoyant moussant doux. Ne jamais aller au lit avec du maquillage — même une fois." },
      { title: "L'ordre des produits", tag: "Routine", content: "Du plus léger au plus épais : tonique → sérum → contour des yeux → hydratant → huile → SPF (matin). L'huile scelle tout, ne l'applique jamais avant un sérum à base d'eau." },
      { title: "Gua sha & ice rolling", tag: "Massage", content: "Le gua sha chaque matin sur peau huilée draine, sculpte l'ovale et réduit les poches. Toujours vers le haut et l'extérieur. L'ice roller dégonfle instantanément — garde-le au frigo." },
      { title: "SPF même en intérieur", tag: "Protection", content: "Les UVA traversent les vitres et accélèrent le vieillissement. SPF 30 minimum chaque matin, même les jours nuageux ou à la maison." },
      { title: "Exfoliation douce 1-2x/semaine", tag: "Éclat", content: "Un AHA (acide glycolique ou lactique) est plus efficace et moins agressif que les scrubs physiques. Utilise le soir, jamais avant exposition solaire." },
      { title: "Taie d'oreiller en satin", tag: "Anti-âge", content: "Le coton frictionne et absorbe tes soins pendant ton sommeil. Une taie en satin préserve l'hydratation et évite les marques au réveil." },
    ]
  },
  {
    id: "cheveux", emoji: "🌿", label: "Cheveux", color: "#8ba870",
    tips: [
      { title: "Massage du cuir chevelu quotidien", tag: "Pousse", content: "4 à 5 minutes de massage circulaire stimulent la circulation et activent les follicules. Fais-le sec ou avec une huile (ricin, jaborandi). Les résultats se voient en 3 mois minimum." },
      { title: "L'huile de ricin pour la pousse", tag: "Pousse", content: "La black castor oil jamaïcaine (JBCO) est la référence. Applique sur le cuir chevelu 2x/semaine en massage. Elle épaissit aussi les cils et les sourcils." },
      { title: "Méthode LOC ou LCO", tag: "Hydratation", content: "Pour les cheveux bouclés/crépus : Liquid → Oil → Cream. Ou LCO si tes cheveux sont très poreux. Scelle l'hydratation dans cet ordre précis." },
      { title: "Manipulation minimale", tag: "Longueur", content: "Moins tu manipules, moins tu as de casse. Les tresses, vanilles, wigs protègent les pointes. La longueur se garde aux pointes — hydrate-les toujours en premier." },
      { title: "Masque protéiné vs hydratant", tag: "Équilibre", content: "Cheveux mous, élastiques → masque protéiné. Cheveux secs, rêches, cassants → masque hydratant. L'équilibre protéine/hydratation est la clé." },
      { title: "Alimentation & cheveux", tag: "Interne", content: "Protéines, fer, zinc, biotine et oméga-3 sont les nutriments clés. Les cheveux qui ne poussent pas ou cassent trop signalent souvent une carence." },
    ]
  },
  {
    id: "corps", emoji: "✨", label: "Corps", color: "#d4af37",
    tips: [
      { title: "Huile sur peau encore humide", tag: "Hydratation", content: "Applique ton huile (amande douce, jojoba, rose musquée) immédiatement après la douche, avant de te sécher. L'eau aide à sceller l'hydratation dans la peau." },
      { title: "Eau froide pour finir", tag: "Tonus", content: "30 secondes d'eau froide à la fin de ta douche resserrent les pores, tonifient la peau, améliorent la circulation et boostent l'énergie. Game changer." },
      { title: "Dry brushing avant la douche", tag: "Cellulite", content: "Brossage à sec (brosse naturelle, mouvements vers le cœur) stimule la circulation et améliore l'apparence de la peau sur le long terme. 5 minutes avant la douche." },
      { title: "Exfoliation 2x/semaine", tag: "Éclat", content: "Un gommage sur peau sèche avant la douche ou un gant exfoliant coréen. Exfolie avant de t'épiler — jamais après." },
      { title: "Zones souvent oubliées", tag: "Complétude", content: "Coudes, genoux, talons, nuque, décolleté et mains vieillissent vite et sont souvent négligés. Hydrate-les à chaque routine. Le décolleté mérite même du SPF." },
    ]
  },
  {
    id: "intime", emoji: "🌸", label: "Soin intime", color: "#c084a0",
    tips: [
      { title: "La vulve est auto-nettoyante", tag: "Fondamental", content: "Le vagin se nettoie seul. La vulve (partie externe) se nettoie uniquement avec de l'eau tiède ou un savon intime sans parfum, pH adapté (entre 4 et 5)." },
      { title: "Coton = meilleur ami", tag: "Respiration", content: "Les sous-vêtements synthétiques créent chaleur et humidité — terrain idéal pour les bactéries. Le coton laisse la peau respirer. Évite les strings tous les jours." },
      { title: "Après les rapports", tag: "Hygiène", content: "Uriner après un rapport intime réduit significativement le risque d'infection urinaire. Un réflexe simple à adopter systématiquement." },
      { title: "Huile de calendula pour la vulve", tag: "Soin", content: "Pour les irritations, sécheresses ou après l'épilation, l'huile de calendula pure est apaisante pour les peaux sensibles. Quelques gouttes suffisent sur la zone externe." },
      { title: "Alimentation & flore intime", tag: "Interne", content: "Les probiotiques (yaourt, kéfir, lactobacillus) nourrissent la flore vaginale. Réduire le sucre raffiné diminue les risques de mycoses récurrentes." },
    ]
  },
  {
    id: "pieds", emoji: "🦋", label: "Pieds & mains", color: "#8ba8c4",
    tips: [
      { title: "Bain de pieds hebdomadaire", tag: "Rituel", content: "Eau chaude + sel d'Epsom + quelques gouttes d'huile essentielle (lavande, tea tree). 15 à 20 minutes. Le sel ramollit les callosités, le tea tree est antifongique naturel." },
      { title: "Talons craquelés : la recette", tag: "Réparation", content: "Exfolie après le bain de pieds, puis couche épaisse de karité ou vaseline, chaussettes en coton toute la nuit. 3x par semaine jusqu'à résultat." },
      { title: "Hydrater les cuticules", tag: "Mains", content: "Quelques gouttes d'huile de jojoba massées sur les cuticules chaque soir transforment les résultats en 2 semaines. Ne jamais les couper — repousser doucement." },
      { title: "Gants de nuit", tag: "Anti-âge", content: "Crème riche (karité, glycérine) + gants en coton pour dormir 2-3x par semaine. Les mains révèlent l'âge avant le visage." },
      { title: "SPF sur les mains", tag: "Protection", content: "Les taches pigmentaires sur les mains sont une des premières causes de vieillissement visible. Crème mains avec SPF chaque matin, surtout en voiture." },
    ]
  },
  {
    id: "levres", emoji: "💋", label: "Lèvres & dents", color: "#c0392b",
    tips: [
      { title: "Gommage lèvres maison", tag: "Lissant", content: "1 c.à.c sucre + 1 c.à.c miel + huile. Masse en cercles 1 minute, rince. 2x par semaine pour des lèvres parfaitement lisses avant tout gloss." },
      { title: "Baume la nuit, SPF le jour", tag: "Protection", content: "Les lèvres n'ont pas de mélanocytes — elles ne se protègent pas du soleil. Baume SPF 30 le jour, couche épaisse de baume réparateur la nuit." },
      { title: "Oil pulling", tag: "Dents", content: "1 c.à.s d'huile de coco dans la bouche 10-15 min à jeun. Réduit les bactéries, assainit les gencives, contribue à l'éclat du sourire. Crache dans la poubelle." },
      { title: "Gratte-langue", tag: "Hygiène", content: "80% des bactéries buccales se logent sur la langue. Un gratte-langue en cuivre chaque matin améliore l'haleine et la santé bucco-dentaire de façon spectaculaire." },
    ]
  },
  {
    id: "interne", emoji: "💫", label: "Beauté interne", color: "#8b7ab5",
    tips: [
      { title: "L'eau : ta routine beauté n°1", tag: "Hydratation", content: "2 litres par jour minimum. La déshydratation se lit immédiatement : teint terne, cernes, pores dilatés. Commence par un grand verre d'eau tiède avec citron le matin." },
      { title: "Sommeil & régénération", tag: "Anti-âge", content: "La peau se régénère entre 22h et 2h du matin. 7 à 9h de sommeil réduisent les inflammations, les cernes et accélèrent la production de collagène." },
      { title: "Les aliments pro-beauté", tag: "Nutrition", content: "Avocat (acides gras), saumon (oméga-3), patate douce (bêta-carotène), myrtilles (antioxydants), noix du Brésil (sélénium), graines de lin (hormones équilibrées)." },
      { title: "Stress & peau", tag: "Cortisol", content: "Le cortisol déclenche l'inflammation, favorise l'acné et accélère le vieillissement. Méditation, respiration, journaling — trouve ce qui te calme et fais-en un rituel." },
      { title: "Hormones & cycle beauté", tag: "Cycle", content: "Ta peau et tes cheveux changent avec ton cycle. Phase folliculaire : peau lumineuse. Ovulatoire : pic d'éclat. Lutéale : sébum ↑, rétention d'eau. Adapte tes soins." },
    ]
  },
];

const LUNA_PROMPTS = {
  discipline: "Tu es LUNA en mode Discipline. Parle avec énergie, structure et clarté. Aide l'utilisatrice à rester focus et à ne pas procrastiner. Ton français est élégant et direct.",
  focus: "Tu es LUNA en mode Focus. Parle de façon concise et structurée. Aide l'utilisatrice à organiser ses pensées et tâches avec clarté. Ton français est précis et calme.",
  glow_up: "Tu es LUNA en mode Glow Up. Encourage l'utilisatrice à briller, à prendre soin d'elle, à se sentir belle et puissante. Donne des conseils beauté, style, self-care. Ton français est enthousiaste et élégant.",
  healing: "Tu es LUNA en mode Healing. Parle avec beaucoup de tendresse et compassion. L'utilisatrice traverse peut-être une période difficile. Ton français est doux et réconfortant.",
  spiritual: "Tu es LUNA en mode Spiritual Reset. Parle avec sagesse et profondeur. Aide l'utilisatrice à se recentrer et trouver la paix intérieure. Ton français est serein et inspirant.",
  soft: "Tu es LUNA en mode Soft Life. Parle avec élégance et sérénité. Encourage l'utilisatrice à savourer les petits plaisirs et à vivre avec grâce. Ton français est raffiné et doux.",
};

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const pad = (n) => String(n).padStart(2, "0");
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function EtherealApp() {
  const [screen, setScreen] = useState(() => load("eth_onboarded", false) ? "app" : "onboarding");
  const [activeTab, setActiveTab] = useState("home");
  const [mode, setMode] = useState(() => load("eth_mode", "glow_up"));
  const [userName, setUserName] = useState(() => load("eth_name", ""));

  const currentMode = MODES.find(m => m.id === mode);
  const accent = currentMode?.color || "#d4af37";
  const bg = currentMode?.palette?.bg || "#0d0d0d";
  const mid = currentMode?.palette?.mid || "#141414";

  const completeOnboarding = (name, selectedMode) => {
    setUserName(name); save("eth_name", name);
    setMode(selectedMode); save("eth_mode", selectedMode);
    save("eth_onboarded", true);
    setScreen("app");
  };

  if (screen === "onboarding") return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 0%, ${mid} 0%, ${bg} 60%, #080808 100%)`, fontFamily:"'Cormorant Garamond',Georgia,serif", color:"#f0ebe3", paddingBottom:"72px", "--accent":accent }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px var(--accent,#d4af37)30}50%{box-shadow:0 0 24px var(--accent,#d4af37)60}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2a1a2a;border-radius:2px}
        .anim{animation:fadeUp .45s ease forwards;opacity:0}
        .card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:18px;transition:all .3s}
        .section-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:#4a3a4a;margin-bottom:14px}
        input,textarea{font-family:'Cormorant Garamond',Georgia,serif;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#f0ebe3;padding:10px 14px;font-size:14px;width:100%;transition:border-color .2s}
        input:focus,textarea:focus{outline:none;border-color:rgba(255,255,255,0.25)}
        textarea{resize:none}
        .btn-accent{border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;border-radius:40px;padding:12px 28px;transition:all .3s;background:var(--accent);color:#0d0d0d}
        .btn-ghost{background:none;border:1px solid rgba(255,255,255,0.1);color:#8a7a8a;cursor:pointer;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;border-radius:40px;padding:8px 18px;transition:all .3s}
        .btn-ghost:hover{border-color:rgba(255,255,255,0.25);color:#f0ebe3}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:flex-end;justify-content:center;padding:0 8px}
        .modal{background:#130e18;border:1px solid rgba(255,255,255,0.08);border-radius:24px 24px 0 0;padding:28px 20px;width:100%;max-width:600px;max-height:88vh;overflow-y:auto}
        .tab-item{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 8px;transition:all .2s;font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px}
      `}</style>

      {/* TAB CONTENT */}
      <div style={{ maxWidth:"600px", margin:"0 auto" }}>
        {activeTab === "home"     && <HomeTab accent={accent} mode={mode} setMode={m => { setMode(m); save("eth_mode",m); }} userName={userName} />}
        {activeTab === "tasks"    && <TasksTab accent={accent} mode={mode} />}
        {activeTab === "luna"     && <LunaTab accent={accent} mode={mode} />}
        {activeTab === "tips"     && <TipsTab accent={accent} />}
        {activeTab === "block"    && <BlockTab accent={accent} mode={mode} />}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(6,4,10,0.95)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-around", padding:"8px 0 14px", zIndex:100 }}>
        {[
          { id:"home",  emoji:"🏠", label:"Accueil" },
          { id:"tasks", emoji:"✦",  label:"Tâches" },
          { id:"luna",  emoji:"🌙", label:"Luna" },
          { id:"tips",  emoji:"🌸", label:"Tips" },
          { id:"block", emoji:"🔒", label:"Blocage" },
        ].map(t => (
          <button key={t.id} className="tab-item" onClick={() => setActiveTab(t.id)}
            style={{ color: activeTab===t.id 
