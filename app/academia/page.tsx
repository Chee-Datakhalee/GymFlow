export default function AcademiaLP() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{margin:0;padding:0;background:#050505;color:#f5f7f5;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;display:flex;justify-content:center}
        :root{--bg:#0a0a0a;--bg-soft:#111111;--bg-card:#16181a;--bg-elev:#1c1f22;--neon:#00FF87;--neon-dim:#00cc6c;--neon-glow:rgba(0,255,135,0.35);--text:#f5f7f5;--text-dim:#a3a8a5;--text-mute:#6b716e;--border:rgba(255,255,255,0.08);--border-soft:rgba(255,255,255,0.04);--glass:rgba(255,255,255,0.04);--radius:20px;--radius-sm:14px;--radius-lg:28px;--max-w:430px}
        .app{width:100%;max-width:430px;min-height:100vh;background:var(--bg);position:relative;overflow:hidden}
        @media(min-width:500px){body{background:#050505;padding:24px 0}.app{min-height:calc(100vh - 48px);border-radius:36px;border:1px solid var(--border);box-shadow:0 40px 120px rgba(0,0,0,0.6),0 0 80px rgba(0,255,135,0.05)}}
        h1,h2,h3,h4{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-0.025em;line-height:1.05}
        p{margin:0}a{color:inherit;text-decoration:none}
        .nav{position:sticky;top:0;z-index:50;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,10,10,0.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.04)}
        .logo{display:inline-flex;align-items:center;gap:8px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.02em}
        .logo-mark{width:28px;height:28px;border-radius:8px;background:var(--neon);display:grid;place-items:center;color:#001a0e;font-weight:900;font-size:14px;box-shadow:0 0 24px var(--neon-glow)}
        .nav-back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.04);border:1px solid var(--border);display:grid;place-items:center}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;border-radius:14px;font-weight:700;font-size:15px;font-family:inherit;border:none;cursor:pointer;transition:transform 0.15s ease,box-shadow 0.2s ease;text-decoration:none;letter-spacing:-0.01em}
        .btn-primary{background:var(--neon);color:#001a0e;box-shadow:0 0 0 1px var(--neon),0 12px 40px -10px var(--neon-glow)}
        .btn-primary:hover{transform:translateY(-1px)}
        .btn-ghost{background:rgba(255,255,255,0.04);color:var(--text);border:1px solid var(--border)}
        .btn-block{width:100%}
        .btn-lg{padding:18px 28px;font-size:16px}
        .hero{position:relative;padding:32px 20px 56px;min-height:600px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}
        .hero-bg{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center}
        .hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(10,10,10,0.75) 0%,rgba(10,10,10,0.55) 30%,rgba(10,10,10,0.97) 90%,var(--bg) 100%),radial-gradient(80% 60% at 20% 90%,rgba(0,255,135,0.35) 0%,rgba(0,255,135,0) 60%)}
        .hero-content{position:relative;z-index:2}
        .hero h1{font-size:44px;line-height:0.95;margin-bottom:16px}
        .hero h1 em{font-style:normal;color:var(--neon);text-shadow:0 0 40px var(--neon-glow)}
        .hero-sub{font-size:16px;color:var(--text-dim);margin-bottom:28px;max-width:360px}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:100px;background:rgba(0,255,135,0.1);border:1px solid rgba(0,255,135,0.3);font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;text-transform:uppercase;color:var(--neon);margin-bottom:20px}
        .hero-meta{display:flex;gap:18px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.04)}
        .hero-meta-item .num{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:22px;color:var(--neon);letter-spacing:-0.02em}
        .hero-meta-item .label{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-mute);font-family:'JetBrains Mono',monospace}
        .section{padding:64px 20px;position:relative}
        .section h2{font-size:34px;line-height:1.02;margin-bottom:16px}
        .section h2 em{font-style:normal;color:var(--neon)}
        .section-intro{color:var(--text-dim);font-size:15px;margin-bottom:28px;max-width:380px}
        .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--neon);font-weight:500}
        .problem-section{padding:56px 20px 32px;text-align:center;background:linear-gradient(180deg,rgba(255,107,107,0.05) 0%,rgba(0,0,0,0) 100%);border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)}
        .stat-num{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:96px;line-height:0.85;color:#ff6b6b;letter-spacing:-0.04em;text-shadow:0 0 60px rgba(255,107,107,0.35)}
        .stat-label{font-size:15px;color:var(--text-dim);margin-top:12px;max-width:280px}
        .feature-card{border:1px solid var(--border);border-radius:20px;padding:24px;background:var(--bg-card);position:relative;overflow:hidden;transition:transform 0.2s ease,border-color 0.2s}
        .feature-card:hover{border-color:rgba(0,255,135,0.3);transform:translateY(-2px)}
        .feature-num{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.15em;color:var(--neon);margin-bottom:16px;display:block}
        .feature-card h3{font-size:22px;margin-bottom:10px}
        .feature-card p{font-size:14px;color:var(--text-dim);line-height:1.5}
        .feature-visual{margin-top:18px;height:80px;border-radius:12px;background:var(--bg-elev);border:1px solid rgba(255,255,255,0.04);position:relative;overflow:hidden}
        .vis-bars{display:flex;align-items:flex-end;height:100%;padding:12px;gap:6px}
        .vis-bars .b{flex:1;background:linear-gradient(180deg,var(--neon),rgba(0,255,135,0.2));border-radius:4px 4px 0 0}
        .vis-alerts{display:flex;flex-direction:column;gap:6px;padding:14px;font-size:11px;font-family:'JetBrains Mono',monospace}
        .vis-alerts .a{display:flex;align-items:center;gap:8px;color:var(--text-dim)}
        .vis-alerts .a .dot{width:6px;height:6px;border-radius:50%;background:var(--neon);box-shadow:0 0 6px var(--neon)}
        .vis-ranking{display:flex;align-items:flex-end;justify-content:center;gap:8px;height:100%;padding:12px 16px}
        .vis-ranking .pillar{flex:1;max-width:38px;border-radius:6px 6px 0 0;background:linear-gradient(180deg,rgba(0,255,135,0.6),rgba(0,255,135,0.15));display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:9px;font-weight:800;color:#001a0e;font-family:'Bricolage Grotesque'}
        .vis-ranking .p1{height:100%;background:linear-gradient(180deg,var(--neon),rgba(0,255,135,0.3))}
        .vis-ranking .p2{height:70%}
        .vis-ranking .p3{height:50%}
        .step{display:grid;grid-template-columns:56px 1fr;gap:18px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.04)}
        .step:first-child{border-top:none}
        .step-num{width:56px;height:56px;border-radius:16px;background:var(--bg-elev);border:1px solid var(--border);display:grid;place-items:center}
        .step-num svg{width:26px;height:26px;stroke:var(--neon);fill:none;stroke-width:2}
        .step h3{font-size:19px;margin-bottom:6px}
        .step p{font-size:14px;color:var(--text-dim)}
        .step-idx{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--neon);letter-spacing:0.1em;margin-bottom:4px;display:block}
        .testimonial{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden}
        .testimonial-quote{font-size:19px;line-height:1.35;font-weight:600;letter-spacing:-0.015em;margin-bottom:24px;position:relative}
        .testimonial-author{display:flex;align-items:center;gap:14px}
        .testimonial-avatar{width:48px;height:48px;border-radius:50%;background-size:cover;background-position:center;border:2px solid var(--neon);box-shadow:0 0 20px var(--neon-glow)}
        .testimonial-name{font-weight:700;font-size:14px}
        .testimonial-role{font-size:12px;color:var(--text-dim)}
        .price-cards-grid{display:grid;gap:14px;margin-top:20px}
        .price-card{border:1px solid var(--border);border-radius:20px;padding:28px 22px;background:var(--bg-card);position:relative;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s}
        .price-card:hover{transform:translateY(-4px);border-color:rgba(0,255,135,0.4);box-shadow:0 20px 60px -20px var(--neon-glow)}
        .price-card.featured{border-color:var(--neon);background:linear-gradient(180deg,rgba(0,255,135,0.08),rgba(0,255,135,0) 60%),var(--bg-card);box-shadow:0 0 0 1px var(--neon),0 20px 60px -20px var(--neon-glow)}
        .price-card-tag{position:absolute;top:-10px;left:22px;background:var(--neon);color:#001a0e;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;padding:4px 10px;border-radius:100px}
        .price-name{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-dim);margin-bottom:14px}
        .price-amount{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:48px;letter-spacing:-0.03em;line-height:1}
        .price-amount-currency{font-size:20px;opacity:0.7;vertical-align:top;margin-right:4px}
        .price-amount-period{font-size:14px;color:var(--text-mute);font-weight:500}
        .price-features{list-style:none;padding:20px 0 0;margin:20px 0 24px;border-top:1px solid rgba(255,255,255,0.04);display:grid;gap:10px}
        .price-features li{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--text-dim)}
        .price-features svg{flex-shrink:0;width:16px;height:16px;stroke:var(--neon);stroke-width:2.5;fill:none;margin-top:2px}
        .cta-box{background:radial-gradient(80% 70% at 50% 0%,rgba(0,255,135,0.18),rgba(0,0,0,0) 65%),var(--bg-card);border:1px solid rgba(0,255,135,0.4);border-radius:28px;padding:36px 24px 32px;text-align:center;margin:12px 0;position:relative;overflow:hidden}
        .cta-box h2{font-size:34px;margin-bottom:12px}
        .cta-box h2 em{font-style:normal;color:var(--neon)}
        .cta-box p{color:var(--text-dim);margin-bottom:24px}
        .cta-box-meta{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.15em;color:var(--text-mute);margin-top:16px;text-transform:uppercase}
        .footer{padding:32px 20px;border-top:1px solid rgba(255,255,255,0.04);color:var(--text-mute);font-size:12px;text-align:center}
        .footer a{color:var(--text-dim);margin:0 8px}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(.2,.7,.2,1)}
        .reveal.in{opacity:1;transform:translateY(0)}
        .reveal-delay-1{transition-delay:0.08s}
        .reveal-delay-2{transition-delay:0.16s}
        .reveal-delay-3{transition-delay:0.24s}
        .card-stack{display:grid;gap:14px}
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
          <div className="hero-bg" style={{backgroundImage:"url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80')"}} />
          <div className="hero-overlay" />
          <div className="hero-content reveal">
            <div className="hero-tag">Para academias</div>
            <h1>Sua academia no<br /><em>próximo nível.</em></h1>
            <p className="hero-sub">Gerencie alunos, reduza cancelamentos e engaje sua comunidade com tecnologia de ponta.</p>
           <a href="/" className="btn btn-primary btn-lg">
              Quero para minha academia
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <div className="hero-meta">
              <div className="hero-meta-item"><div className="num">+340</div><div className="label">Academias</div></div>
              <div className="hero-meta-item"><div className="num">98%</div><div className="label">Retenção</div></div>
              <div className="hero-meta-item"><div className="num">30 dias</div><div className="label">Grátis</div></div>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section className="problem-section">
          <div className="reveal">
            <span className="eyebrow">O PROBLEMA</span>
            <div className="stat-num" style={{marginTop:'16px'}}>30%</div>
            <p className="stat-label" style={{margin:'12px auto 0'}}>dos alunos cancelam todo mês — e você só descobre quando já foi tarde demais.</p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="reveal">
            <span className="eyebrow">O QUE FAZEMOS</span>
            <h2 style={{marginTop:'12px'}}>Tudo que sua academia<br /><em>precisa.</em></h2>
          </div>
          <div className="card-stack" style={{marginTop:'24px'}}>
            <div className="feature-card reveal reveal-delay-1">
              <span className="feature-num">01 — GESTÃO</span>
              <h3>Controle total dos alunos</h3>
              <p>Cadastro, mensalidades, frequência e histórico em um só lugar. Chega de planilha.</p>
              <div className="feature-visual">
                <div className="vis-bars">
                  <div className="b" style={{height:'40%'}} /><div className="b" style={{height:'70%'}} /><div className="b" style={{height:'55%'}} /><div className="b" style={{height:'90%'}} /><div className="b" style={{height:'65%'}} /><div className="b" style={{height:'80%'}} /><div className="b" style={{height:'45%'}} />
                </div>
              </div>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <span className="feature-num">02 — IA</span>
              <h3>Alertas antes do cancelamento</h3>
              <p>Nossa IA detecta padrões de risco e avisa você antes que o aluno suma. Recupere até 40% dos churns.</p>
              <div className="feature-visual">
                <div className="vis-alerts">
                  <div className="a"><span className="dot" />João sumiu há 8 dias — risco alto</div>
                  <div className="a"><span className="dot" />Maria vencendo amanhã — alertar</div>
                  <div className="a"><span className="dot" />Pedro treinou 5x essa semana 🔥</div>
                </div>
              </div>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <span className="feature-num">03 — COMUNIDADE</span>
              <h3>Ranking e engajamento</h3>
              <p>Competições mensais, conquistas e feed social mantêm seus alunos motivados — e dentro da academia.</p>
              <div className="feature-visual">
                <div className="vis-ranking">
                  <div className="pillar p2">2</div>
                  <div className="pillar p1">1</div>
                  <div className="pillar p3">3</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="section" style={{paddingTop:'24px'}}>
          <div className="reveal">
            <span className="eyebrow">COMO FUNCIONA</span>
            <h2 style={{marginTop:'12px'}}>Pronto em <em>3 passos.</em></h2>
          </div>
          <div style={{marginTop:'24px'}}>
            <div className="step reveal reveal-delay-1">
              <div className="step-num"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
              <div>
                <span className="step-idx">PASSO 01</span>
                <h3>Conecte sua academia</h3>
                <p>Importamos seu cadastro de alunos em 24h. Sem dor de cabeça com migração.</p>
              </div>
            </div>
            <div className="step reveal reveal-delay-2">
              <div className="step-num"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg></div>
              <div>
                <span className="step-idx">PASSO 02</span>
                <h3>A IA aprende sua operação</h3>
                <p>Em 7 dias, nossa IA mapeia padrões de frequência, planos e riscos da sua academia.</p>
              </div>
            </div>
            <div className="step reveal reveal-delay-3">
              <div className="step-num"><svg viewBox="0 0 24 24"><path d="M3 12l5 5L21 4"/></svg></div>
              <div>
                <span className="step-idx">PASSO 03</span>
                <h3>Receba insights diários</h3>
                <p>Alertas, relatórios e ações sugeridas direto no seu celular.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTO */}
        <section className="section" style={{paddingTop:'24px'}}>
          <div className="testimonial reveal">
            <span className="eyebrow">DEPOIMENTO</span>
            <p className="testimonial-quote" style={{marginTop:'18px'}}>
              Em 4 meses cortamos cancelamentos pela metade. O GymFlow virou um sócio da operação.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{backgroundImage:"url('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80')"}} />
              <div>
                <div className="testimonial-name">Ricardo Mendes</div>
                <div className="testimonial-role">Sócio · Forge Studio Fitness (SP)</div>
              </div>
            </div>
          </div>
        </section>

        {/* PREÇOS */}
        <section className="section" id="pricing">
          <div className="reveal">
            <span className="eyebrow">PLANOS</span>
            <h2 style={{marginTop:'12px'}}>Escolha o plano da sua<br /><em>academia.</em></h2>
            <p className="section-intro" style={{marginTop:'14px'}}>Sem fidelidade. 30 dias grátis em qualquer plano.</p>
          </div>
          <div className="price-cards-grid">
            <div className="price-card reveal reveal-delay-1">
              <div className="price-name">Starter</div>
              <div className="price-amount"><span className="price-amount-currency">R$</span>197<span className="price-amount-period">/mês</span></div>
              <ul className="price-features">
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Até 200 alunos</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Gestão completa</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Alertas de frequência</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Suporte via chat</li>
              </ul>
              <a href="/" className="btn btn-ghost btn-block">Começar grátis</a>
            </div>
            <div className="price-card featured reveal reveal-delay-2">
              <span className="price-card-tag">Mais escolhido</span>
              <div className="price-name">Pro</div>
              <div className="price-amount"><span className="price-amount-currency">R$</span>347<span className="price-amount-period">/mês</span></div>
              <ul className="price-features">
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Até 600 alunos</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Tudo do Starter</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>IA preditiva de churn</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Ranking e gamificação</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>WhatsApp automático</li>
              </ul>
              <a href="/" className="btn btn-primary btn-block">Começar grátis</a>
            </div>
            <div className="price-card reveal reveal-delay-3">
              <div className="price-name">Elite</div>
              <div className="price-amount"><span className="price-amount-currency">R$</span>597<span className="price-amount-period">/mês</span></div>
              <ul className="price-features">
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Alunos ilimitados</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Tudo do Pro</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Multi-unidades</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>API + integrações</li>
                <li><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Gerente de conta dedicado</li>
              </ul>
              <a href="/" className="btn btn-ghost btn-block">Falar com vendas</a>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section" id="cta">
          <div className="cta-box reveal">
            <span className="eyebrow">VAMOS COMEÇAR</span>
            <h2 style={{marginTop:'14px'}}>Comece <em>30 dias grátis.</em></h2>
            <p>Sem cartão. Sem fidelidade. Cancele a qualquer momento.</p>
            <a href="/" className="btn btn-primary btn-lg btn-block">
              Quero para minha academia
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <div className="cta-box-meta">SETUP EM 24H · SUPORTE EM PT-BR</div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div style={{marginBottom:'10px'}}>
            <a href="/escolha">Início</a> ·
            <a href="/aluno-lp">Para alunos</a> ·
            <a href="#pricing">Planos</a>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.12em'}}>© 2026 GYMFLOW</div>
        </footer>
      </main>

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const els=document.querySelectorAll('.reveal');
          if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
          const io=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
          els.forEach(el=>io.observe(el));
        })();
      `}} />
    </>
  )
}
