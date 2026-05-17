"use client"
import { useState } from "react"

export default function AlunoLP() {
  const [nutriUnlocked, setNutriUnlocked] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{margin:0;padding:0;background:#050505;color:#f5f7f5;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;display:flex;justify-content:center}
        :root{--bg:#0a0a0a;--bg-soft:#111;--bg-card:#16181a;--bg-elev:#1c1f22;--neon:#00FF87;--neon-glow:rgba(0,255,135,0.35);--text:#f5f7f5;--text-dim:#a3a8a5;--text-mute:#6b716e;--border:rgba(255,255,255,0.08);--border-soft:rgba(255,255,255,0.04);--glass:rgba(255,255,255,0.04);--radius:20px;--radius-lg:28px;--max-w:430px}
        .app{width:100%;max-width:430px;min-height:100vh;background:var(--bg);position:relative;overflow:hidden}
        @media(min-width:500px){body{background:#050505;padding:24px 0}.app{min-height:calc(100vh - 48px);border-radius:36px;border:1px solid var(--border);box-shadow:0 40px 120px rgba(0,0,0,0.6),0 0 80px rgba(0,255,135,0.05)}}
        h1,h2,h3,h4{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-0.025em;line-height:1.05}
        p{margin:0}a{color:inherit;text-decoration:none}
        .nav{position:sticky;top:0;z-index:50;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,10,10,0.7);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-soft)}
        .logo{display:inline-flex;align-items:center;gap:8px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.02em}
        .logo-mark{width:28px;height:28px;border-radius:8px;background:var(--neon);display:grid;place-items:center;color:#001a0e;font-weight:900;font-size:14px;box-shadow:0 0 24px var(--neon-glow)}
        .nav-back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.04);border:1px solid var(--border);display:grid;place-items:center;color:var(--text)}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;border-radius:14px;font-weight:700;font-size:15px;font-family:inherit;border:none;cursor:pointer;transition:transform 0.15s ease,box-shadow 0.2s;text-decoration:none;letter-spacing:-0.01em}
        .btn-primary{background:var(--neon);color:#001a0e;box-shadow:0 0 0 1px var(--neon),0 12px 40px -10px var(--neon-glow)}
        .btn-primary:hover{transform:translateY(-1px)}
        .btn-ghost{background:rgba(255,255,255,0.04);color:var(--text);border:1px solid var(--border)}
        .btn-block{width:100%}
        .btn-lg{padding:18px 28px;font-size:16px}
        .hero{position:relative;padding:32px 20px 56px;min-height:600px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}
        .hero-bg{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center}
        .hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(10,10,10,0.5) 0%,rgba(10,10,10,0.2) 30%,rgba(10,10,10,0.95) 90%,var(--bg) 100%),radial-gradient(80% 60% at 20% 90%,rgba(0,255,135,0.35) 0%,rgba(0,255,135,0) 60%)}
        .hero-content{position:relative;z-index:2}
        .hero h1{font-size:44px;line-height:0.95;margin-bottom:16px}
        .hero h1 em{font-style:normal;color:var(--neon);text-shadow:0 0 40px var(--neon-glow)}
        .hero-sub{font-size:16px;color:var(--text-dim);margin-bottom:28px}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:100px;background:rgba(0,255,135,0.1);border:1px solid rgba(0,255,135,0.3);font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;text-transform:uppercase;color:var(--neon);margin-bottom:20px}
        .store-btns{display:flex;gap:8px;margin-top:16px}
        .store-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid var(--border);font-size:12px;color:var(--text);font-weight:600}
        .store-btn svg{width:16px;height:16px}
        .store-btn .sub{font-size:9px;color:var(--text-mute);display:block;line-height:1;margin-bottom:2px}
        .store-btn .main{font-size:13px;line-height:1}
        .section{padding:64px 20px;position:relative}
        .section h2{font-size:34px;line-height:1.02;margin-bottom:16px}
        .section h2 em{font-style:normal;color:var(--neon)}
        .section-intro{color:var(--text-dim);font-size:15px;margin-bottom:28px}
        .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--neon);font-weight:500}
        .phone-mock{position:relative;width:260px;margin:0 auto;border-radius:36px;background:#1a1c1e;padding:8px;border:1px solid var(--border);box-shadow:0 30px 80px -10px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04),0 0 60px -20px var(--neon-glow)}
        .phone-screen{border-radius:28px;background:#050505;overflow:hidden;aspect-ratio:9/19.5;position:relative}
        .phone-notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:80px;height:22px;background:#050505;border-radius:100px;z-index:10}
        .feed-screen{padding:36px 12px 16px;height:100%;overflow:hidden;color:var(--text);font-size:11px}
        .feed-head{display:flex;justify-content:space-between;align-items:center;padding:0 4px 14px}
        .feed-head-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:18px}
        .feed-post{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:10px;margin-bottom:10px}
        .feed-post-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .feed-av{width:24px;height:24px;border-radius:50%;background-size:cover;background-position:center}
        .feed-author{font-weight:700;font-size:11px}
        .feed-time{font-size:9px;color:var(--text-mute);font-family:'JetBrains Mono'}
        .feed-body{font-size:10px;color:var(--text-dim);margin-bottom:8px;line-height:1.4}
        .feed-stats{display:flex;gap:10px;font-size:9px;color:var(--text-mute);font-family:'JetBrains Mono';letter-spacing:0.06em}
        .neon-pill{background:rgba(0,255,135,0.12);color:var(--neon);padding:2px 6px;border-radius:4px;font-weight:700}
        .feed-workout{display:flex;gap:4px;font-size:8px;font-family:'JetBrains Mono';color:var(--text-dim);margin-bottom:8px}
        .feed-workout span{background:var(--bg-elev);padding:3px 6px;border-radius:4px}
        .feed-tab-bar{position:absolute;bottom:8px;left:12px;right:12px;background:rgba(20,22,25,0.85);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:16px;padding:8px 12px;display:flex;justify-content:space-around}
        .feed-tab{width:22px;height:22px;display:grid;place-items:center}
        .feed-tab svg{width:16px;height:16px;stroke:var(--text-dim);fill:none;stroke-width:2}
        .feed-tab.active svg{stroke:var(--neon);filter:drop-shadow(0 0 4px var(--neon))}
        .chart-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;position:relative;overflow:hidden}
        .chart-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
        .chart-card h3{font-size:18px;margin-bottom:4px}
        .chart-card .meta{font-size:11px;color:var(--text-mute);font-family:'JetBrains Mono'}
        .chart-card .delta{font-family:'Bricolage Grotesque';font-weight:800;font-size:24px;color:var(--neon);letter-spacing:-0.02em;text-shadow:0 0 24px var(--neon-glow)}
        .chart-svg-wrap{height:160px;position:relative}
        .chart-axis{display:flex;justify-content:space-between;padding-top:6px;font-size:9px;color:var(--text-mute);font-family:'JetBrains Mono';letter-spacing:0.08em}
        .ai-suggestion{margin-top:18px;padding:12px;background:rgba(0,255,135,0.06);border:1px solid rgba(0,255,135,0.18);border-radius:10px;display:flex;gap:10px;align-items:flex-start}
        .ai-suggestion .badge{background:var(--neon);color:#001a0e;font-size:9px;font-weight:800;padding:3px 6px;border-radius:4px;font-family:'JetBrains Mono';letter-spacing:0.06em;flex-shrink:0}
        .ai-suggestion .txt{font-size:12px;line-height:1.4;color:var(--text)}
        .ai-suggestion .txt strong{color:var(--neon);font-weight:700}
        .podium-card{background:linear-gradient(180deg,rgba(0,255,135,0.04),rgba(0,0,0,0) 60%),var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
        .podium-card h3{font-size:18px;margin-bottom:4px}
        .podium-card .meta{font-size:11px;color:var(--text-mute);font-family:'JetBrains Mono';margin-bottom:20px}
        .podium-stage{display:grid;grid-template-columns:1fr 1fr 1fr;align-items:end;gap:8px;height:200px}
        .podium-col{display:flex;flex-direction:column;align-items:center;gap:8px}
        .podium-av{width:48px;height:48px;border-radius:50%;background-size:cover;background-position:center;border:2px solid var(--border);margin-bottom:4px}
        .podium-av.gold{border-color:var(--neon);box-shadow:0 0 18px var(--neon-glow);width:56px;height:56px}
        .podium-name{font-weight:700;font-size:11px}
        .podium-pts{font-family:'JetBrains Mono';font-size:9px;color:var(--neon);letter-spacing:0.06em}
        .podium-block{width:100%;border-radius:8px 8px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:8px;font-family:'Bricolage Grotesque';font-weight:800;font-size:20px;color:rgba(0,255,135,0.5)}
        .podium-block.gold{background:linear-gradient(180deg,var(--neon),rgba(0,255,135,0.25));color:#001a0e;height:140px}
        .podium-block.silver{background:linear-gradient(180deg,rgba(0,255,135,0.6),rgba(0,255,135,0.15));height:100px}
        .podium-block.bronze{background:linear-gradient(180deg,rgba(0,255,135,0.35),rgba(0,255,135,0.08));height:70px}
        .nutri-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;position:relative}
        .nutri-macros{padding:24px;filter:blur(6px);transition:filter 0.4s ease}
        .nutri-macros.unlocked{filter:none}
        .nutri-lock-overlay{position:absolute;inset:0;background:rgba(10,10,10,0.65);backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:24px;transition:opacity 0.4s ease}
        .nutri-lock-overlay.unlocked{opacity:0;pointer-events:none}
        .lock-icon{width:56px;height:56px;border-radius:16px;background:rgba(0,255,135,0.1);border:1px solid rgba(0,255,135,0.3);display:grid;place-items:center}
        .lock-icon svg{width:26px;height:26px;stroke:var(--neon);fill:none;stroke-width:2}
        .nutri-lock-overlay h4{font-size:17px;margin:0}
        .nutri-lock-overlay p{font-size:13px;color:var(--text-dim);max-width:260px}
        .macro-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid var(--border-soft)}
        .macro-row:first-child{border-top:none;padding-top:0}
        .macro-name{font-size:13px;color:var(--text-dim)}
        .macro-val{font-family:'Bricolage Grotesque';font-size:22px;font-weight:800;color:var(--neon)}
        .macro-unit{font-size:11px;color:var(--text-mute)}
        .testimonial{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden}
        .testimonial-quote{font-size:19px;line-height:1.35;font-weight:600;letter-spacing:-0.015em;margin-bottom:24px}
        .testimonial-author{display:flex;align-items:center;gap:14px}
        .testimonial-avatar{width:48px;height:48px;border-radius:50%;background-size:cover;background-position:center;border:2px solid var(--neon);box-shadow:0 0 20px var(--neon-glow)}
        .testimonial-name{font-weight:700;font-size:14px}
        .testimonial-role{font-size:12px;color:var(--text-dim)}
        .cta-box{background:radial-gradient(80% 70% at 50% 0%,rgba(0,255,135,0.18),rgba(0,0,0,0) 65%),var(--bg-card);border:1px solid rgba(0,255,135,0.4);border-radius:28px;padding:36px 24px 32px;text-align:center;margin:12px 0}
        .cta-box h2{font-size:34px;margin-bottom:12px}
        .cta-box h2 em{font-style:normal;color:var(--neon)}
        .cta-box p{color:var(--text-dim);margin-bottom:24px}
        .footer{padding:32px 20px;border-top:1px solid var(--border-soft);color:var(--text-mute);font-size:12px;text-align:center}
        .footer a{color:var(--text-dim);margin:0 8px}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(.2,.7,.2,1)}
        .reveal.in{opacity:1;transform:translateY(0)}
        .reveal-delay-1{transition-delay:0.08s}
        .reveal-delay-2{transition-delay:0.16s}
        .reveal-delay-3{transition-delay:0.24s}
        .section-bg-tint{background:radial-gradient(60% 50% at 80% 0%,rgba(0,255,135,0.06),rgba(0,0,0,0) 70%)}
      `}</style>

      <main className="app">
        {/* NAV */}
        <nav className="nav">
          <a className="nav-back" href="/escolha">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </a>
          <a className="logo" href="/escolha">
            <span className="logo-mark">G</span>
            GymFlow
          </a>
          <a className="btn btn-primary" href="/" style={{padding:'8px 16px',fontSize:'13px'}}>Entrar</a>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" style={{backgroundImage:"url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80')"}} />
          <div className="hero-overlay" />
          <div className="hero-content reveal">
            <div className="hero-tag">Para alunos</div>
            <h1>Treine.<br />Evolua.<br /><em>Compete.</em></h1>
            <p className="hero-sub">Seu personal trainer com IA, rede social do seu treino e plano nutricional no bolso.</p>
            <a href="/" className="btn btn-primary btn-lg btn-block">
  Usar no navegador — grátis
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
</a>
            <div className="store-btns" style={{marginTop:'14px'}}>
              <a className="store-btn" href="/"><span><span className="sub">Baixar na</span><span className="main">App Store</span></span></a>
              <a className="store-btn" href="/"><span><span className="sub">Baixar no</span><span className="main">Google Play</span></span></a>
            </div>
          </div>
        </section>

        {/* FEED MOCKUP */}
        <section className="section">
          <div className="reveal">
            <span className="eyebrow">REDE SOCIAL</span>
            <h2 style={{marginTop:'12px'}}>Seu treino no <em>feed.</em></h2>
            <p className="section-intro" style={{marginTop:'12px'}}>Poste, curta e compete com quem treina na mesma academia.</p>
          </div>
          <div className="phone-mock reveal" style={{marginTop:'32px'}}>
            <div className="phone-screen">
              <div className="phone-notch" />
              <div className="feed-screen">
                <div className="feed-head">
                  <span className="feed-head-title">Gym<span style={{color:'var(--neon)'}}>Flow</span></span>
                </div>
                <div className="feed-post">
                  <div className="feed-post-head">
                    <div className="feed-av" style={{backgroundImage:"url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80')"}} />
                    <div><div className="feed-author">Marina C.</div><div className="feed-time">há 2h · sua academia</div></div>
                  </div>
                  <div className="feed-workout"><span>Peito</span><span>4 séries</span><span>Supino 65kg</span></div>
                  <div className="feed-stats"><span className="neon-pill">🔥 48</span><span>💬 12</span></div>
                </div>
                <div className="feed-post" style={{background:'linear-gradient(135deg,rgba(0,255,135,0.08),rgba(0,0,0,0)),var(--bg-card)',borderColor:'rgba(0,255,135,0.3)'}}>
                  <div className="feed-post-head">
                    <div className="feed-av" style={{backgroundImage:"url('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&q=80')"}} />
                    <div><div className="feed-author">Lucas S.</div><div className="feed-time">há 3h</div></div>
                  </div>
                  <div className="feed-body">🏆 <strong style={{color:'var(--neon)'}}>Lucas bateu PR — Supino 85kg</strong></div>
                  <div className="feed-stats"><span className="neon-pill">🔥 124</span></div>
                </div>
                <div className="feed-tab-bar">
                  <div className="feed-tab active"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg></div>
                  <div className="feed-tab"><svg viewBox="0 0 24 24"><path d="M6 4h12M6 20h12M6 12h12"/></svg></div>
                  <div className="feed-tab"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EVOLUÇÃO */}
        <section className="section">
          <div className="reveal">
            <span className="eyebrow">IA PERSONAL</span>
            <h2 style={{marginTop:'12px'}}>Evolução que você <em>vê.</em></h2>
            <p className="section-intro" style={{marginTop:'12px'}}>A IA registra cada série, detecta PRs e sugere progressão automática.</p>
          </div>
          <div className="chart-card reveal" style={{marginTop:'24px'}}>
            <div className="chart-card-header">
              <div><h3>Supino Reto</h3><div className="meta">Últimas 8 semanas</div></div>
              <div className="delta">+73kg</div>
            </div>
            <div className="chart-svg-wrap">
              <svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF87" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#00FF87" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path id="evo-area" d="M6,148 L48,130 L90,118 L132,90 L174,98 L216,62 L258,28 L302,148 Z" fill="url(#areaGrad)" opacity="0.8"/>
                <path id="evo-line" d="M6,148 L48,130 L90,118 L132,90 L174,98 L216,62 L258,28" fill="none" stroke="#00FF87" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle id="evo-dot" cx="258" cy="28" r="5" fill="#00FF87" style={{filter:'drop-shadow(0 0 6px #00FF87)'}}/>
              </svg>
            </div>
            <div className="chart-axis"><span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5</span><span>S6</span><span>S7</span><span>S8</span></div>
            <div className="ai-suggestion">
              <span className="badge">IA</span>
              <div className="txt">Você progrediu <strong>+8kg</strong> esse mês. Tente <strong>87kg</strong> na próxima sessão.</div>
            </div>
          </div>
        </section>

        {/* RANKING */}
        <section className="section">
          <div className="reveal">
            <span className="eyebrow">RANKING</span>
            <h2 style={{marginTop:'12px'}}>Compete com sua <em>academia.</em></h2>
            <p className="section-intro" style={{marginTop:'12px'}}>Ranking semanal, conquistas e desafios entre alunos da mesma academia.</p>
          </div>
          <div className="podium-card reveal" style={{marginTop:'24px'}}>
            <h3>Ranking da Semana</h3>
            <div className="meta">SUA ACADEMIA · SEMANA 20</div>
            <div className="podium-stage">
              <div className="podium-col">
                <div className="podium-av" style={{backgroundImage:"url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80')"}} />
                <div className="podium-name">Lucas</div>
                <div className="podium-pts">388🔥</div>
                <div className="podium-block silver">2</div>
              </div>
              <div className="podium-col">
                <div className="podium-av gold" style={{backgroundImage:"url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80')"}} />
                <div className="podium-name">Marina</div>
                <div className="podium-pts">412🔥</div>
                <div className="podium-block gold">1</div>
              </div>
              <div className="podium-col">
                <div className="podium-av" style={{backgroundImage:"url('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80')"}} />
                <div className="podium-name">Pedro</div>
                <div className="podium-pts">301🔥</div>
                <div className="podium-block bronze">3</div>
              </div>
            </div>
          </div>
        </section>

        {/* NUTRIÇÃO */}
        <section className="section">
          <div className="reveal">
            <span className="eyebrow">NUTRIÇÃO</span>
            <h2 style={{marginTop:'12px'}}>Plano feito para <em>você.</em></h2>
            <p className="section-intro" style={{marginTop:'12px'}}>IA gera seu plano nutricional completo baseado no seu objetivo e rotina.</p>
          </div>
          <div className="nutri-card reveal" style={{marginTop:'24px'}}>
            <div className={`nutri-macros${nutriUnlocked ? ' unlocked' : ''}`}>
              <div style={{marginBottom:'16px'}}><span className="eyebrow">Plano — Hipertrofia</span><div style={{fontSize:'13px',color:'var(--text-dim)',marginTop:'4px'}}>3.200 kcal · 5 refeições</div></div>
              {[['Proteínas','185','g'],['Carboidratos','380','g'],['Gorduras','89','g']].map(([name,val,unit])=>(
                <div key={name} className="macro-row">
                  <span className="macro-name">{name}</span>
                  <span><span className="macro-val">{val}</span><span className="macro-unit"> {unit}</span></span>
                </div>
              ))}
            </div>
            <div className={`nutri-lock-overlay${nutriUnlocked ? ' unlocked' : ''}`}>
              <div className="lock-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              </div>
              <h4>Desbloqueie seu plano</h4>
              <p>Disponível para alunos de academias parceiras GymFlow.</p>
              <button className="btn btn-primary btn-block" onClick={() => setNutriUnlocked(true)}>Desbloquear agora</button>
            </div>
          </div>
        </section>

        {/* DEPOIMENTO */}
        <section className="section section-bg-tint">
          <div className="testimonial reveal">
            <span className="eyebrow">DEPOIMENTO</span>
            <p className="testimonial-quote" style={{marginTop:'18px'}}>
              Em 6 meses subi 18kg no agachamento e fiz amizade com gente que nunca tinha falado na academia. O app virou parte do meu treino.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{backgroundImage:"url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80')"}} />
              <div>
                <div className="testimonial-name">Marina Castro</div>
                <div className="testimonial-role">Aluna · Forge Studio Fitness</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" id="cta">
          <div className="cta-box reveal">
            <span className="eyebrow">DOWNLOAD</span>
            <h2 style={{marginTop:'14px'}}>Comece agora<br />— <em>é grátis.</em></h2>
            <p>Crie sua conta em 30 segundos. Use mesmo se sua academia ainda não usa GymFlow.</p>
            <a href="/" className="btn btn-primary btn-lg btn-block">
  Usar no navegador — grátis
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
</a>
            <div className="store-btns" style={{marginTop:'14px'}}>
              <a className="store-btn" href="/"><span><span className="sub">Baixar na</span><span className="main">App Store</span></span></a>
              <a className="store-btn" href="/"><span><span className="sub">Baixar no</span><span className="main">Google Play</span></span></a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div style={{marginBottom:'10px'}}>
            <a href="/escolha">
  <img src="/LOGO-GYN-FLOW.png" alt="GymFlow" style={{height:'32px'}} />
</a>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.12em'}}>© 2026 GYMFLOW</div>
        </footer>
      </main>

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const els=document.querySelectorAll('.reveal');
          if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
          const io=new IntersectionObserver((e)=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
          els.forEach(el=>io.observe(el));
        })();
      `}} />
    </>
  )
}
