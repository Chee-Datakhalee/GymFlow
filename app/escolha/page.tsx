export const dynamic = 'force-static'

export default function EscolhaPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{margin:0;padding:0;background:#050505;color:#f5f7f5;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;display:flex;justify-content:center}
        :root{--bg:#0a0a0a;--bg-card:#16181a;--neon:#00FF87;--neon-glow:rgba(0,255,135,0.35);--text:#f5f7f5;--text-dim:#a3a8a5;--text-mute:#6b716e;--border:rgba(255,255,255,0.08);--glass:rgba(255,255,255,0.04)}
        .app{width:100%;max-width:430px;min-height:100vh;background:var(--bg);position:relative;overflow:hidden;display:flex;flex-direction:column;padding:24px 20px;justify-content:space-between}
        @media(min-width:500px){body{padding:24px 0}.app{min-height:calc(100vh - 48px);border-radius:36px;border:1px solid var(--border);box-shadow:0 40px 120px rgba(0,0,0,0.6),0 0 80px rgba(0,255,135,0.05)}}
        .logo{display:inline-flex;align-items:center;gap:8px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.02em;text-decoration:none;color:inherit}
        .logo-mark{width:28px;height:28px;border-radius:8px;background:var(--neon);display:grid;place-items:center;color:#001a0e;font-weight:900;font-size:14px;box-shadow:0 0 24px var(--neon-glow)}
        .choice-top{display:flex;align-items:center;justify-content:space-between;padding-top:8px}
        .choice-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-mute)}
        .choice-hero{text-align:center;padding:48px 0 16px;position:relative;z-index:2}
        .pill-row{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;border:1px solid var(--border);background:var(--glass);font-size:11px;color:var(--text-dim);font-family:'JetBrains Mono',monospace;letter-spacing:0.08em;margin-bottom:24px}
        .pill-dot{width:6px;height:6px;border-radius:50%;background:var(--neon);box-shadow:0 0 8px var(--neon);animation:pulse 1.8s infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        h1{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:44px;line-height:0.98;letter-spacing:-0.035em;margin-bottom:16px}
        h1 em{font-style:normal;color:var(--neon);text-shadow:0 0 50px var(--neon-glow)}
        .choice-hero p{color:var(--text-dim);font-size:15px;max-width:320px;margin:0 auto}
        .choice-cards{display:grid;gap:14px;padding:32px 0 20px;position:relative;z-index:2}
        .choice-card{position:relative;border-radius:22px;overflow:hidden;background:var(--bg-card);border:1px solid var(--border);padding:24px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;transition:transform 0.2s ease,border-color 0.2s,box-shadow 0.2s;cursor:pointer;text-decoration:none;color:inherit}
        .choice-card:hover{transform:translateY(-3px);border-color:rgba(0,255,135,0.5);box-shadow:0 20px 60px -20px var(--neon-glow)}
        .choice-card-aluno{background:linear-gradient(135deg,rgba(0,255,135,0.12) 0%,rgba(0,255,135,0) 60%),var(--bg-card)}
        .choice-card-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--neon);margin-bottom:8px}
        h2{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:24px;line-height:1;letter-spacing:-0.02em;margin-bottom:6px}
        .choice-card p{font-size:13px;color:var(--text-dim);line-height:1.4;max-width:200px}
        .choice-card-icon{width:64px;height:64px;border-radius:18px;background:rgba(0,255,135,0.08);border:1px solid rgba(0,255,135,0.2);display:grid;place-items:center;flex-shrink:0}
        .choice-card-icon svg{width:30px;height:30px;stroke:var(--neon);stroke-width:2;fill:none}
        .choice-card-arrow{position:absolute;bottom:18px;right:18px;width:36px;height:36px;border-radius:50%;background:var(--neon);display:grid;place-items:center;box-shadow:0 0 20px var(--neon-glow)}
        .choice-card-arrow svg{width:18px;height:18px;stroke:#001a0e;stroke-width:2.5;fill:none}
        .glow-tl,.glow-br{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:1}
        .glow-tl{width:280px;height:280px;background:rgba(0,255,135,0.18);top:-120px;left:-100px}
        .glow-br{width:320px;height:320px;background:rgba(0,255,135,0.1);bottom:-160px;right:-120px}
        .choice-footer{text-align:center;color:var(--text-mute);font-size:11px;padding-top:16px;position:relative;z-index:2;font-family:'JetBrains Mono',monospace;letter-spacing:0.1em}
        canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
      `}</style>

      <div className="app">
        <canvas id="particles" />
        <div className="glow-tl" />
        <div className="glow-br" />

        <header className="choice-top">
          <a href="/">
  <img src="/LOGO-GYN-FLOW.png" alt="GymFlow" style={{height:'32px'}} />
</a>
          <span className="choice-eyebrow">v1.0</span>
        </header>

        <section className="choice-hero">
          <div className="pill-row">
            <span className="pill-dot" />
            BEM-VINDO
          </div>
          <h1>Você é dono<br />ou você <em>treina?</em></h1>
          <p>Escolha sua jornada. Cada uma foi pensada de ponta a ponta para o que você precisa.</p>
        </section>

        <section className="choice-cards">
          <a className="choice-card choice-card-academia" href="/academia">
            <div>
              <div className="choice-card-label">Para gestores</div>
              <h2>Sou dono de academia</h2>
              <p>Reduza cancelamentos, engaje sua comunidade.</p>
            </div>
            <div className="choice-card-icon">
              <svg viewBox="0 0 24 24"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/><path d="M3 21h18"/></svg>
            </div>
            <div className="choice-card-arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>
          </a>

          <a className="choice-card choice-card-aluno" href="/aluno-lp">
            <div>
              <div className="choice-card-label">Para atletas</div>
              <h2>Sou aluno</h2>
              <p>Treino, evolução e ranking no seu bolso.</p>
            </div>
            <div className="choice-card-icon">
              <svg viewBox="0 0 24 24"><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></svg>
            </div>
            <div className="choice-card-arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>
          </a>
        </section>

        <footer className="choice-footer">
          <span>TREINE · EVOLUA · COMPETE</span>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const canvas=document.getElementById('particles');
          const ctx=canvas.getContext('2d');
          const DPR=Math.min(window.devicePixelRatio||1,2);
          let W,H,particles=[];
          const COUNT=36;
          function resize(){const rect=canvas.getBoundingClientRect();W=rect.width;H=rect.height;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}
          function reset(p){p.x=Math.random()*W;p.y=Math.random()*H;p.vx=(Math.random()-0.5)*0.15;p.vy=-0.15-Math.random()*0.25;p.r=0.6+Math.random()*1.6;p.a=0.2+Math.random()*0.6;p.tw=Math.random()*Math.PI*2}
          function init(){resize();particles=[];for(let i=0;i<COUNT;i++){const p={};reset(p);p.y=Math.random()*H;particles.push(p)}}
          function tick(){ctx.clearRect(0,0,W,H);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.tw+=0.03;if(p.y<-10||p.x<-10||p.x>W+10)reset(p);const a=p.a*(0.6+0.4*Math.sin(p.tw));ctx.beginPath();ctx.fillStyle='rgba(0,255,135,'+a+')';ctx.shadowBlur=8;ctx.shadowColor='rgba(0,255,135,0.6)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(tick)}
          window.addEventListener('resize',init);init();requestAnimationFrame(tick);
        })();
      `}} />
    </>
  )
}
