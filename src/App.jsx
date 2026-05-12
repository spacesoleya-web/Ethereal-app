import { useState } from "react";
import { HomeTab } from "./HomeTab.jsx";
import { TasksTab } from "./TasksTab.jsx";
import { LunaTab } from "./LunaTab.jsx";
import { TipsTab } from "./TipsTab.jsx";
import { BlockTab } from "./BlockTab.jsx";
import { Onboarding } from "./Onboarding.jsx";
import { MODES } from "./data.js";

const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function EtherealApp() {
  const [screen, setScreen] = useState(() => load("eth_onboarded", false) ? "app" : "onboarding");
  const [activeTab, setActiveTab] = useState("home");
  const [mode, setMode] = useState(() => load("eth_mode", "glow_up"));
  const [userName, setUserName] = useState(() => load("eth_name", ""));

  const currentMode = MODES.find(m => m.id === mode);
  const accent = currentMode?.color || "#d4af37";

  const completeOnboarding = (name, selectedMode) => {
    setUserName(name); save("eth_name", name);
    setMode(selectedMode); save("eth_mode", selectedMode);
    save("eth_onboarded", true);
    setScreen("app");
  };

  if (screen === "onboarding") return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", fontFamily:"'Cormorant Garamond',Georgia,serif", color:"#f0ebe3", paddingBottom:"72px", "--accent":accent }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px var(--accent)30}50%{box-shadow:0 0 24px var(--accent)60}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2a1a2a;border-radius:2px}
        .anim{animation:fadeUp .45s ease forwards;opacity:0}
        .card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:18px}
        .section-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:#4a3a4a;margin-bottom:14px}
        input,textarea{font-family:'Cormorant Garamond',Georgia,serif;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#f0ebe3;padding:10px 14px;font-size:14px;width:100%}
        input:focus,textarea:focus{outline:none;border-color:rgba(255,255,255,0.25)}
        textarea{resize:none}
        .btn-accent{border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;border-radius:40px;padding:12px 28px;background:var(--accent);color:#0d0d0d}
        .btn-ghost{background:none;border:1px solid rgba(255,255,255,0.1);color:#8a7a8a;cursor:pointer;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;border-radius:40px;padding:8px 18px}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:flex-end;justify-content:center;padding:0 8px}
        .modal{background:#130e18;border:1px solid rgba(255,255,255,0.08);border-radius:24px 24px 0 0;padding:28px 20px;width:100%;max-width:600px;max-height:88vh;overflow-y:auto}
        .tab-item{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 8px;font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px}
      `}</style>
      <div style={{ maxWidth:"600px", margin:"0 auto" }}>
        {activeTab === "home"  && <HomeTab accent={accent} mode={mode} setMode={m => { setMode(m); save("eth_mode",m); }} userName={userName} />}
        {activeTab === "tasks" && <TasksTab accent={accent} />}
        {activeTab === "luna"  && <LunaTab accent={accent} mode={mode} />}
        {activeTab === "tips"  && <TipsTab accent={accent} />}
        {activeTab === "block" && <BlockTab accent={accent} />}
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(6,4,10,0.95)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-around", padding:"8px 0 14px", zIndex:100 }}>
        {[{id:"home",emoji:"🏠",label:"Accueil"},{id:"tasks",emoji:"✦",label:"Tâches"},{id:"luna",emoji:"🌙",label:"Luna"},{id:"tips",emoji:"🌸",label:"Tips"},{id:"block",emoji:"🔒",label:"Blocage"}].map(t => (
          <button key={t.id} className="tab-item" onClick={() => setActiveTab(t.id)} style={{ color: activeTab===t.id ? accent : "#3a2a3a" }}>
            <span style={{ fontSize:"20px" }}>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  );
            }
