import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../components/navbar/public-navbar';
import { UserNavbarComponent } from '../../components/navbar/user-navbar';
import { AuthService } from '../../services/auth.service';
import { CampagnesService } from '../../services/campagnes.service';

interface Campaign {
  id: string;
  title: string;
  description: string;
  university: string;
  universityLogo: string;
  bannerUrl: string;
  domain: string;
  status: 'open' | 'closing-soon' | 'closed';
  funding: boolean;
}

@Component({
  selector: 'start-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent, UserNavbarComponent],
  templateUrl: './start-page.html',
  styles: [`
    :host { display:block }
    
    /* Global Dark Mode Support */
    .landing { min-height:100vh; background:#ffffff; transition:background 0.3s ease; overflow-x:hidden }
    :host-context(.dark) .landing { background:#000000 }
    
    /* Hero Section - use supplied banner image */
    .hero { position:relative; min-height:100vh; display:flex; align-items:center; justify-content:center; background:none; overflow:hidden }
    .hero-bg-gradient { position:absolute; inset:0; background-image: url('/assets/start-banner.jpg'); background-size:cover; background-position:center center; background-repeat:no-repeat; filter:contrast(0.95) saturate(1.03); opacity:1; }
    @keyframes gradientShift { 0%, 100% { transform:scale(1) rotate(0deg) } 50% { transform:scale(1.1) rotate(5deg) } }
    /* particles removed when using a photographic banner - keep for future use */
    .hero-particles { display:none }
    @keyframes particlesFloat { 0%, 100% { background-position:0% 0% } 50% { background-position:100% 100% } }
    /* subtle dark-blue filter for photographic banner to improve text contrast */
    .hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(2,10,36,0.18), rgba(2,10,36,0.32)); mix-blend-mode:multiply; pointer-events:none }
    :host-context(.dark) .hero { background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) }
    .hero-content { position:relative; z-index:2; text-align:center; max-width:920px; padding:0 24px }
    .hero-badge { display:inline-block; padding:8px 20px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:100px; color:#ffffff; font-size:0.875rem; font-weight:500; letter-spacing:0.5px; margin-bottom:24px; border:1px solid rgba(255,255,255,0.2); animation:fadeInUp 0.6s ease }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    .hero-title { font-size:5rem; font-weight:800; line-height:1.1; letter-spacing:-0.05em; color:#ffffff; margin:0 0 24px; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',system-ui,sans-serif; animation:fadeInUp 0.8s ease 0.2s both }
    /* replace warm orange gradient with dark-blue gradient per request */
    .gradient-text { background:linear-gradient(135deg, #092e6f 0%, #1e3a8a 50%, #2563eb 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:gradientFlow 3s ease infinite; background-size:200% 200% }
    @keyframes gradientFlow { 0%, 100% { background-position:0% 50% } 50% { background-position:100% 50% } }
    .hero-subtitle { font-size:1.375rem; line-height:1.6; color:rgba(255,255,255,0.95); margin:0 0 48px; font-weight:400; max-width:720px; margin-left:auto; margin-right:auto; animation:fadeInUp 1s ease 0.4s both }
    .hero-cta { display:flex; gap:16px; justify-content:center; align-items:center; margin-bottom:64px; animation:fadeInUp 1.2s ease 0.6s both; flex-wrap:wrap }
    .hero-stats { display:flex; gap:48px; justify-content:center; align-items:center; animation:fadeInUp 1.4s ease 0.8s both; flex-wrap:wrap }
    .stat-item { text-align:center }
    .stat-number { font-size:2.5rem; font-weight:700; color:#ffffff; margin-bottom:4px }
    .stat-label { font-size:0.875rem; color:rgba(255,255,255,0.8); text-transform:uppercase; letter-spacing:1px }
    .stat-divider { width:1px; height:48px; background:rgba(255,255,255,0.2) }
    
    /* Buttons - Enhanced Futuristic Style */
    .btn-primary, .btn-secondary, .btn-cta, .btn-cta-secondary { padding:0.875rem 2.25rem; border-radius:980px; font-weight:600; font-size:1.0625rem; border:none; cursor:pointer; transition:all 0.3s cubic-bezier(0.4,0,0.2,1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif; display:inline-flex; align-items:center; gap:8px }
    .btn-primary { background:rgba(255,255,255,0.95); color:#1e40af; box-shadow:0 4px 16px rgba(0,0,0,0.12); backdrop-filter:blur(20px) }
    .btn-primary:hover { background:rgba(255,255,255,1); transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(0,0,0,0.18) }
    .btn-secondary { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.98); border:1.5px solid rgba(255,255,255,0.2); backdrop-filter:blur(20px) }
    .btn-secondary:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.3); transform:translateY(-1px) }
    .btn-cta { background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; box-shadow:0 4px 16px rgba(59,130,246,0.3); padding:1.125rem 2.75rem; font-size:1.1875rem }
    .btn-cta:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(59,130,246,0.4) }
    .btn-cta-secondary { background:rgba(255,255,255,0.12); color:white; border:1.5px solid rgba(255,255,255,0.25); backdrop-filter:blur(10px); padding:1.125rem 2.75rem; font-size:1.1875rem }
    .btn-cta-secondary:hover { background:rgba(255,255,255,0.18); border-color:rgba(255,255,255,0.35); transform:translateY(-1px) }
    :host-context(.dark) .btn-primary { background:rgba(255,255,255,0.92); color:#0f172a }
    :host-context(.dark) .btn-cta { background:linear-gradient(135deg, #3b82f6, #60a5fa); box-shadow:0 4px 16px rgba(59,130,246,0.4) }
    :host-context(.dark) .btn-cta:hover { box-shadow:0 8px 24px rgba(59,130,246,0.5) }
    
    /* Stats Section - minimal, professional, with unified section-level background effect */
    .stats-section { padding:6.25rem 1.5rem; background:linear-gradient(180deg, rgba(8,12,20,0.02) 0%, rgba(255,255,255,0.0) 30%); border-top:1px solid rgba(0,0,0,0.04); position:relative; overflow:visible }
    /* a subtle multi-layer background glow behind the whole section */
    .stats-section::before { 
      content:'';
      position:absolute;
      left:50%;
      top:30px;
      transform:translateX(-50%);
      width:1200px;
      height:320px;
      border-radius:28px;
      pointer-events:none;
      z-index:0;
      filter:blur(34px);
      opacity:0.16;
      /* Layered: lightweight repeating dot pattern + soft color glow */
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px),
        radial-gradient(closest-side, rgba(99,102,241,0.18), rgba(59,130,246,0.10) 35%, rgba(56,189,248,0.02));
      background-size:12px 12px, cover;
      background-position:center, center;
      background-repeat:repeat, no-repeat;
    }
    .stats-section::after { content:''; position:absolute; right:5%; bottom:0; transform:translateY(6%); width:800px; height:260px; border-radius:120px; pointer-events:none; z-index:0; filter:blur(46px); opacity:0.10; background:linear-gradient(90deg, rgba(236,72,153,0.12), rgba(139,92,246,0.08)); }
    :host-context(.dark) .stats-section { background:linear-gradient(180deg, #071026 0%, #00040a 100%); border-top:1px solid rgba(255,255,255,0.03) }
    :host-context(.dark) .stats-section::before {
      /* darker mode: slightly stronger dots and a muted glow */
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px),
        radial-gradient(closest-side, rgba(96,165,250,0.06), rgba(99,102,241,0.04) 35%, rgba(99,102,241,0.01));
      background-size:12px 12px, cover;
      background-position:center, center;
      background-repeat:repeat, no-repeat;
      opacity:0.35;
    }
    .stats-container { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.5rem; align-items:stretch; position:relative; z-index:1 }
    /* motif behind stat cards: layered, lightweight geometric dots + soft linear wash */
    .stats-section .stats-container::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -20px;
      transform: translateX(-50%);
      width: 1100px;
      height: 420px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.10;
      background-image:
        radial-gradient(circle, rgba(13,71,161,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(13,71,161,0.03) 1px, transparent 1px),
        linear-gradient(180deg, rgba(13,71,161,0.02), rgba(255,255,255,0));
      background-size: 14px 14px, 28px 28px, cover;
      background-position: center 20%, center 60%, center center;
      background-repeat: repeat, repeat, no-repeat;
      filter: blur(0.2px);
    }
    :host-context(.dark) .stats-section .stats-container::before {
      opacity: 0.08;
      background-image:
        radial-gradient(circle, rgba(13,71,161,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(13,71,161,0.04) 1px, transparent 1px),
        linear-gradient(180deg, rgba(2,6,23,0.06), rgba(2,6,23,0));
      background-size: 14px 14px, 28px 28px, cover;
    }
    .stat-card { text-align:center; padding:1.75rem 1rem; background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96)); border-radius:14px; border:1px solid rgba(15,23,42,0.06); transition:transform 0.28s ease, box-shadow 0.28s ease; box-shadow:0 8px 24px rgba(15,23,42,0.03); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:visible; z-index:1 }
    .stat-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(12,18,32,0.06); border-color:rgba(96,165,250,0.08) }
    /* small colored accent bar at top of the card */
    .stat-accent { position:absolute; top:0; left:16px; right:16px; height:6px; border-radius:6px 6px 0 0; box-shadow:0 2px 10px rgba(0,0,0,0.06) }
    :host-context(.dark) .stat-card { background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border-color:rgba(255,255,255,0.04); box-shadow:0 8px 26px rgba(0,0,0,0.45) }
    :host-context(.dark) .stat-card:hover { box-shadow:0 22px 46px rgba(0,0,0,0.55); border-color:rgba(59,130,246,0.14) }
    .stat-icon { width:56px; height:56px; margin:0 auto 14px; border-radius:12px; background:linear-gradient(135deg, rgba(255,255,255,0.92), rgba(246,248,255,0.96)); color:#0f172a; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(16,24,40,0.06) }
    .stat-value { font-size:2.25rem; font-weight:800; margin-bottom:6px; color:#0f172a }
    :host-context(.dark) .stat-value { color:#e6f2ff }
    .stat-desc { font-size:0.95rem; color:#64748b; font-weight:600; margin:0 }
    :host-context(.dark) .stat-desc { color:#9fb6d9 }
    
    /* Section Headers */
    .section-header { text-align:center; margin-bottom:4rem }
    .section-badge { display:inline-block; padding:6px 18px; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:white; border-radius:100px; font-size:0.8125rem; font-weight:600; letter-spacing:0.5px; margin-bottom:1rem; text-transform:uppercase }
    .section-title { font-size:3rem; font-weight:700; margin:0 0 1rem; color:#1d1d1f; letter-spacing:-0.02em; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif; transition:color 0.3s ease }
    :host-context(.dark) .section-title { color:#f5f5f7 }
    .section-subtitle { font-size:1.25rem; color:#6e6e73; margin:0; max-width:640px; margin-left:auto; margin-right:auto }
    :host-context(.dark) .section-subtitle { color:#a1a1a6 }
    
    /* How It Works Section */
    .how-it-works { padding:7rem 2rem; background:#ffffff; position:relative; overflow:hidden }
    :host-context(.dark) .how-it-works { background:#000000 }
    /* Match badge color to the deep-blue timeline marker for this section */
    .how-it-works .section-badge { background:linear-gradient(135deg, #3b82f6, #1e3a8a); }
    :host-context(.dark) .how-it-works .section-badge { background:linear-gradient(135deg, #60a5fa, #1e3a8a); }
     /* decorative background covering the whole section; fixed attachment gives a sticky visual
       on desktop (background stays while content scrolls). Use absolute so it fills the section. */
     .how-it-works { position:relative }
      .how-bg { position:absolute; inset:0; background-image: url('/assets/how_it_works1.jpg'), url('/assets/how-bg.svg'); background-size:cover; background-position:center center; background-repeat:no-repeat; background-attachment:fixed; opacity:0.12; filter:contrast(1.05) saturate(1.06); pointer-events:none; z-index:0 }
      :host-context(.dark) .how-bg { opacity:0.08; filter:saturate(0.9) }
    .how-container { max-width:1100px; margin:0 auto; position:relative; z-index:2 }
    /* two-column alternating timeline using grid rows */
    .timeline { display:flex; flex-direction:column; gap:2.5rem; position:relative }
    .timeline-row { display:grid; grid-template-columns:1fr 96px 1fr; align-items:center; gap:20px }
    .timeline-marker { width:72px; height:72px; border-radius:50%; background:#0d47a1; color:white; display:flex; align-items:center; justify-content:center; font-size:1.75rem; font-weight:700; box-shadow:0 8px 24px rgba(13,71,161,0.28); justify-self:center }
    .timeline-col { display:flex; justify-content:flex-end }
    .timeline-col.right { justify-content:flex-start }
    .timeline-content { padding:1.75rem; background:rgba(249,250,251,0.95); backdrop-filter:blur(10px); border-radius:20px; border:1px solid rgba(0,0,0,0.06); transition:all 0.3s ease; max-width:520px }
    .timeline-content:hover { transform:translateY(-6px); box-shadow:0 8px 24px rgba(0,0,0,0.08); border-color:rgba(59,130,246,0.2) }
    :host-context(.dark) .timeline-content { background:rgba(28,28,30,0.9); border-color:rgba(255,255,255,0.06) }
    .timeline-content h3 { font-size:1.5rem; font-weight:700; margin:0 0 0.75rem; color:#1d1d1f }
    :host-context(.dark) .timeline-content h3 { color:#f5f5f7 }
    .timeline-content p { margin:0; color:#6e6e73; line-height:1.6; font-size:1.0625rem }
    :host-context(.dark) .timeline-content p { color:#a1a1a6 }
    /* central vertical axis */
    .timeline::before { content:''; position:absolute; left:50%; top:0; transform:translateX(-50%); width:2px; height:100%; background:linear-gradient(180deg, rgba(59,130,246,0.06), rgba(59,130,246,0.18)); z-index:1 }
    @media (max-width:900px) {
      .timeline-row { grid-template-columns:1fr; grid-auto-rows:auto }
      .timeline-marker { justify-self:center }
      .timeline-col { justify-content:center }
      .how-bg { display:none }
      .how-bg { background-attachment:scroll }
    }
    
    /* Features Section - Enhanced with Glowing Effects */
    .features { padding:6rem 2rem 7rem; background:linear-gradient(180deg, #ffffff 0%, #f9fafb 100%); transition:background 0.3s ease; position:relative }
    .features::before { content:''; position:absolute; top:10%; right:6%; width:420px; height:420px; background:radial-gradient(circle, rgba(13,71,161,0.06), transparent 70%); border-radius:50%; pointer-events:none }
    :host-context(.dark) .features { background:linear-gradient(180deg, #030412 0%, #071026 100%) }
    :host-context(.dark) .features::before { background:radial-gradient(circle, rgba(13,71,161,0.12), transparent 70%) }
    .features-container { max-width:1200px; margin:0 auto; position:relative; z-index:1 }

    /* hero layout: left artwork, right feature tiles */
    .features-hero { display:grid; grid-template-columns: 1fr 1.15fr; gap:2.5rem; align-items:center; margin-top:2.25rem }
    .features-hero-media { display:flex; align-items:center; justify-content:center }
    .features-hero-img { width:100%; max-width:520px; border-radius:18px; box-shadow:0 20px 40px rgba(16,24,40,0.06); border:1px solid #eef2ff }
    :host-context(.dark) .features-hero-img { border-color:rgba(59,130,246,0.06); box-shadow:0 20px 40px rgba(2,6,23,0.6) }

    .features-hero-list { padding:0 0 }
    .feature-grid.big-apps { display:grid; grid-template-columns:repeat(2, minmax(220px, 1fr)); gap:1.25rem }
    .feature-card.app-tile { padding:1.25rem; border-radius:16px; background:linear-gradient(180deg,#ffffff,#fbfdff); border:1px solid #eaf2ff; box-shadow:0 6px 20px rgba(16,24,40,0.04); display:flex; flex-direction:column; gap:10px }
    .feature-card.app-tile h3 { font-size:1.125rem; margin:0; color:#0f172a; font-weight:700 }
    .feature-card.app-tile p { margin:0; color:#475569; font-size:0.95rem; line-height:1.45 }
    .feature-card.app-tile:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(16,24,40,0.08); border-color:#dbeafe }
    :host-context(.dark) .feature-card.app-tile { background:linear-gradient(180deg,#0f172a,#0a1220); border-color:rgba(255,255,255,0.04); box-shadow:0 6px 18px rgba(0,0,0,0.45) }

    .feature-icon.large { width:72px; height:72px; border-radius:16px; background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 28px rgba(37,99,235,0.15); flex:0 0 auto }
    .feature-icon.large svg { width:36px; height:36px }

    @media (max-width:960px) {
      .features-hero { grid-template-columns:1fr; gap:1.5rem }
      .feature-grid.big-apps { grid-template-columns:repeat(2,1fr) }
      .features-hero-img { max-width:100%; height:auto }
    }
    @media (max-width:560px) {
      .feature-grid.big-apps { grid-template-columns:1fr }
      .feature-icon.large { width:56px; height:56px }
      .feature-icon.large svg { width:24px; height:24px }
    }
    
    /* Testimonials Section */
    .testimonials { padding:7rem 2rem; background:linear-gradient(180deg, #f9fafb 0%, #ffffff 100%); position:relative }
    .testimonials::after { content:''; position:absolute; bottom:20%; left:5%; width:400px; height:400px; background:radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%); border-radius:50%; pointer-events:none }
    :host-context(.dark) .testimonials { background:linear-gradient(180deg, #0a0a0a 0%, #000000 100%) }
    :host-context(.dark) .testimonials::after { background:radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%) }
    .testimonials-container { max-width:1200px; margin:0 auto; position:relative; z-index:1 }
    .testimonials-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2rem }
    .testimonial-card { padding:2.5rem; background:rgba(255,255,255,0.8); backdrop-filter:blur(20px); border-radius:24px; border:1px solid rgba(0,0,0,0.06); transition:all 0.4s ease; box-shadow:0 4px 16px rgba(0,0,0,0.04) }
    .testimonial-card:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,0.1); border-color:rgba(59,130,246,0.2) }
    :host-context(.dark) .testimonial-card { background:rgba(28,28,30,0.8); border-color:rgba(255,255,255,0.08); box-shadow:0 4px 16px rgba(0,0,0,0.3) }
    :host-context(.dark) .testimonial-card:hover { box-shadow:0 12px 32px rgba(0,0,0,0.5); border-color:rgba(59,130,246,0.3) }
    .testimonial-stars { color:#fbbf24; font-size:1.25rem; margin-bottom:1.25rem }
    .testimonial-text { font-size:1.125rem; line-height:1.7; color:#1d1d1f; margin:0 0 2rem; font-style:italic }
    :host-context(.dark) .testimonial-text { color:#f5f5f7 }
    .testimonial-author { display:flex; align-items:center; gap:1rem }
    .author-avatar { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1rem }
    .author-name { font-weight:700; color:#1d1d1f; margin-bottom:2px }
    :host-context(.dark) .author-name { color:#f5f5f7 }
    .author-title { font-size:0.875rem; color:#6e6e73 }
    :host-context(.dark) .author-title { color:#a1a1a6 }
    
    /* FAQ Section */
    .faq { padding:7rem 2rem; background:#ffffff }
    :host-context(.dark) .faq { background:#000000 }
    .faq-container { max-width:1000px; margin:0 auto }
    .faq-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:2rem }
    .faq-item { padding:2rem; background:#f9fafb; border-radius:20px; border:1px solid rgba(0,0,0,0.05); transition:all 0.3s ease }
    .faq-item:hover { background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.06); border-color:rgba(59,130,246,0.15) }
    :host-context(.dark) .faq-item { background:#1c1c1e; border-color:rgba(255,255,255,0.06) }
    :host-context(.dark) .faq-item:hover { background:#2a2a2e; box-shadow:0 8px 24px rgba(0,0,0,0.4); border-color:rgba(59,130,246,0.2) }
    .faq-item h3 { font-size:1.125rem; font-weight:700; margin:0 0 0.75rem; color:#1d1d1f }
    :host-context(.dark) .faq-item h3 { color:#f5f5f7 }
    .faq-item p { margin:0; color:#6e6e73; line-height:1.6; font-size:1rem }
    :host-context(.dark) .faq-item p { color:#a1a1a6 }
    
    /* CTA Section - Futuristic with Gradient Background */
    .cta-section { padding:8rem 2rem; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); position:relative; overflow:hidden }
    .cta-bg-gradient { position:absolute; inset:0; background:radial-gradient(circle at 70% 30%, rgba(236,72,153,0.3), transparent 60%), radial-gradient(circle at 30% 70%, rgba(59,130,246,0.3), transparent 60%); animation:ctaGlow 10s ease infinite }
    @keyframes ctaGlow { 0%, 100% { opacity:0.5 } 50% { opacity:0.8 } }
    :host-context(.dark) .cta-section { background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) }
    .cta-container { max-width:840px; margin:0 auto; text-align:center; position:relative; z-index:1 }
    .cta-badge { display:inline-block; padding:8px 20px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:100px; color:#ffffff; font-size:0.875rem; font-weight:600; letter-spacing:0.5px; margin-bottom:1.5rem; border:1px solid rgba(255,255,255,0.2) }
    .cta-container h2 { font-size:3.5rem; font-weight:700; margin:0 0 1.5rem; color:#ffffff; letter-spacing:-0.025em; line-height:1.08; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif }
    .cta-container p { font-size:1.375rem; color:rgba(255,255,255,0.95); margin:0 0 3rem; font-weight:400; line-height:1.5 }
    .cta-buttons { display:flex; gap:1.25rem; justify-content:center; margin-bottom:2.5rem; flex-wrap:wrap }
    .cta-trust { display:flex; align-items:center; justify-content:center; gap:0.75rem; color:rgba(255,255,255,0.9); font-size:0.9375rem }
    
    /* Campaigns Home Card Layout (aligned with campaigns page design) */
    .campaigns-home { padding:6rem 2rem; background:#ffffff; position:relative }
    :host-context(.dark) .campaigns-home { background:#000000 }
    /* Campaigns badge and call-to-action styled to single dark-blue for a professional look */
    .campaigns-home .section-badge { background:#0d47a1; color:#ffffff }
    :host-context(.dark) .campaigns-home .section-badge { background:#0d47a1; color:#ffffff }
    .campaigns-home .btn-view-all { background:#0d47a1; color:#ffffff; border:none; box-shadow:0 8px 24px rgba(13,71,161,0.18) }
    .campaigns-home .btn-view-all:hover { background:#0b3a85; transform:translateY(-2px) }
    /* Ensure campaign card apply button matches brand and is clearly primary when prompting signup */
    .campaigns-home .btn-apply { background:#0d47a1; color:#fff; border:none; box-shadow:0 6px 18px rgba(13,71,161,0.12) }
    .campaigns-home .btn-apply:hover { background:#0b3a85 }

    /* Smart CTA variant: pill-style anchor with icon motion and focus styles */
    .campaigns-home .btn-view-all.smart-cta { display:inline-flex; align-items:center; gap:10px; padding:10px 18px; border-radius:28px; font-weight:600; font-size:0.95rem; text-decoration:none; transition:transform .18s ease, box-shadow .18s ease, background .18s ease; will-change:transform; position:relative }
    .campaigns-home .btn-view-all.smart-cta .cta-text { display:inline-block; color:inherit }
    .campaigns-home .btn-view-all.smart-cta .cta-icon { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.06); transition:transform .18s cubic-bezier(.2,.8,.2,1), background .14s ease; flex:0 0 auto }
    .campaigns-home .btn-view-all.smart-cta:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(13,71,161,0.12) }
    .campaigns-home .btn-view-all.smart-cta:hover .cta-icon { transform:translateX(4px); background:rgba(255,255,255,0.08) }
    .campaigns-home .btn-view-all.smart-cta:active { transform:translateY(-1px) }
    .campaigns-home .btn-view-all.smart-cta:focus { outline:none; box-shadow:0 0 0 3px rgba(13,71,161,0.12) }
    .campaigns-home .btn-view-all.smart-cta svg { display:block }
    .campaigns-home-container { max-width:1200px; margin:0 auto }
    .campaigns-home-container .campaigns-toolbar { display:flex; gap:16px; align-items:center; justify-content:space-between; margin:0 0 1.25rem; padding:0 1.5rem }
    .campaigns-home-container .search-wrapper { flex:1 }
    .campaigns-home-container .search-input { display:flex; align-items:center; gap:10px; background:#f1f5f9; border-radius:12px; padding:9px 12px; border:1px solid rgba(15,23,42,0.04); max-width:720px; width:100%; }
    .campaigns-home-container .search-input svg { color:#64748b; flex:0 0 auto }
    .campaigns-home-container .search-input input { border:none; outline:none; background:transparent; font-size:1rem; padding:6px 0; width:100%; color:#0f172a }
    :host-context(.dark) .campaigns-home-container .search-input { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04) }
    :host-context(.dark) .campaigns-home-container .search-input input { color:#e6eef8 }
    .campaigns-home-container .toolbar-cta { flex:0 0 auto }
    @media (max-width:720px) {
      .campaigns-home-container .campaigns-toolbar { flex-direction:column; align-items:stretch; gap:12px; padding:0 0 }
      .campaigns-home-container .toolbar-cta { display:flex; justify-content:flex-end }
    }
    .campaigns-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:12px; padding:2.25rem 1rem; color:#64748b }
    .campaigns-empty .empty-illustration { width:140px; max-width:32%; height:auto; opacity:0.98 }
    .campaigns-empty .empty-text { margin:0; font-size:1rem; color:#475569 }
    :host-context(.dark) .campaigns-empty .empty-text { color:#9fb6d9 }
    @media (max-width:720px) {
      .campaigns-empty { padding:1.5rem 0 }
      .campaigns-empty .empty-illustration { width:110px; max-width:46% }
    }
    .campaign-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:2rem; margin-bottom:3rem }
    .campaign-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; transition:all .3s cubic-bezier(0.4,0,0.2,1); display:flex; flex-direction:column; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.04) }
    .campaign-card:hover { transform:translateY(-6px); box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.05); border-color:#cbd5e1 }
    :host-context(.dark) .campaign-card { background:#1e293b; border-color:#334155; box-shadow:0 4px 16px rgba(0,0,0,0.4) }
    :host-context(.dark) .campaign-card:hover { box-shadow:0 20px 40px rgba(0,0,0,0.55) }
    .card-header { position:relative; height:180px }
    .banner-wrapper { height:100%; width:100%; position:relative; overflow:hidden }
    .banner { width:100%; height:100%; object-fit:cover; transition:transform .7s ease }
    .campaign-card:hover .banner { transform:scale(1.08) }
    .overlay-gradient { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 65%) }
    .status-badge { position:absolute; top:12px; right:12px; padding:.4rem .8rem; border-radius:100px; font-size:.65rem; font-weight:700; letter-spacing:.05em; color:#fff; backdrop-filter:blur(4px); box-shadow:0 2px 4px rgba(0,0,0,0.1) }
    .st-open { background:rgba(22,163,74,0.9) }
    .st-closing-soon { background:rgba(234,88,12,0.9) }
    .st-closed { background:rgba(100,116,139,0.9) }
    .logo-box { position:absolute; bottom:-24px; left:1.5rem; width:64px; height:64px; background:#fff; border-radius:16px; padding:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); z-index:10; display:flex; align-items:center; justify-content:center; border:2px solid #fff }
    :host-context(.dark) .logo-box { background:#1e293b; border-color:#1e293b }
    .logo-box img { max-width:100%; max-height:100%; object-fit:contain; border-radius:12px }
    .card-body { padding:2rem 1.5rem 1.25rem; flex:1; display:flex; flex-direction:column }
    .uni-name { display:flex; align-items:center; gap:.5rem; font-size:.75rem; font-weight:600; color:#64748b; margin-bottom:.5rem }
    :host-context(.dark) .uni-name { color:#94a3b8 }
    .card-title { font-size:1.25rem; font-weight:700; line-height:1.4; margin:0 0 .75rem; color:#0f172a; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }
    :host-context(.dark) .card-title { color:#f8fafc }
    .card-desc { font-size:.85rem; color:#475569; line-height:1.5; margin:0 0 1rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden }
    :host-context(.dark) .card-desc { color:#a1a1a6 }
    .card-tags { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:auto }
    .tag { background:#f1f5f9; color:#475569; padding:.3rem .6rem; border-radius:6px; font-size:.65rem; font-weight:600 }
    :host-context(.dark) .tag { background:#334155; color:#cbd5e1 }
    .card-footer { padding:1rem 1.5rem 1.5rem; display:flex; gap:.75rem }
    .btn-details { flex:1; background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:.65rem .9rem; border-radius:10px; font-size:.8rem; font-weight:600; cursor:pointer; transition:.2s }
    .btn-details:hover { background:#f8fafc; border-color:#94a3b8 }
    :host-context(.dark) .btn-details { background:#0f172a; border-color:#334155; color:#e2e8f0 }
    :host-context(.dark) .btn-details:hover { background:#1e293b }
    .btn-apply { flex:1; background:#2563eb; color:#fff; border:none; padding:.65rem .9rem; border-radius:10px; font-size:.8rem; font-weight:600; cursor:pointer; transition:.2s; box-shadow:0 4px 6px -1px rgba(37,99,235,0.25) }
    .btn-apply:hover { background:#1d4ed8; transform:translateY(-1px) }
    :host-context(.dark) .btn-apply { background:#3b82f6 }
    :host-context(.dark) .btn-apply:hover { background:#2563eb }
    .campaigns-cta { text-align:center }
    .btn-view-all { padding:1rem 2.5rem; background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; border:none; border-radius:12px; font-size:1.0625rem; font-weight:600; cursor:pointer; transition:all 0.3s ease; display:inline-flex; align-items:center; gap:0.75rem; box-shadow:0 4px 16px rgba(59,130,246,0.3) }
    .btn-view-all:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(59,130,246,0.4) }
    :host-context(.dark) .btn-view-all { background:linear-gradient(135deg, #3b82f6, #60a5fa) }
    
    /* Responsive - Enhanced */
    @media (max-width:1024px){
      .hero-title { font-size:4rem }
      .section-title { font-size:2.5rem }
      .cta-container h2 { font-size:2.75rem }
      .stat-card { padding:2rem 1.25rem }
      .timeline-item { flex-direction:column; align-items:flex-start }
      .timeline-marker { margin-bottom:1rem }
      .timeline-connector { display:none }
    }
    @media (max-width:768px) {
      .hero { min-height:90vh; padding:2rem 0 }
      .hero-title { font-size:2.75rem; letter-spacing:-0.03em }
      .hero-subtitle { font-size:1.125rem }
      .hero-stats { gap:24px }
      .stat-number { font-size:2rem }
      .stat-label { font-size:0.75rem }
      .stat-divider { display:none }
      .section-title { font-size:2rem }
      .cta-container h2 { font-size:2rem }
      .cta-container p { font-size:1.125rem }
      .hero-cta, .cta-buttons { flex-direction:column; align-items:center; gap:1rem }
      .btn-primary, .btn-secondary, .btn-cta, .btn-cta-secondary { min-width:280px }
      .feature-grid, .testimonials-grid, .faq-grid { grid-template-columns:1fr; gap:2rem }
      .stats-container { grid-template-columns:1fr }
      .features, .testimonials, .faq, .how-it-works { padding:4rem 1.5rem 5rem }
      .cta-section { padding:5rem 1.5rem }
      .features::before, .testimonials::after { width:300px; height:300px }
    }
    @media (max-width:480px) {
      .hero-title { font-size:2rem }
      .hero-subtitle { font-size:1rem }
      .hero-badge { font-size:0.75rem; padding:6px 16px }
      .section-title { font-size:1.75rem }
      .cta-container h2 { font-size:1.75rem }
      .btn-cta, .btn-cta-secondary { padding:1rem 2rem; font-size:1.0625rem }
      .stat-number { font-size:1.75rem }
      .stat-icon { width:48px; height:48px }
      .stat-value { font-size:2.25rem }
      .timeline-marker { width:60px; height:60px; font-size:1.5rem }
      .feature-card, .testimonial-card, .faq-item { padding:1.75rem }
    }

    /* accessible visually-hidden text for screen readers */
    .sr-only { position:absolute !important; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0 }

    /* About Section */
    .about-section { padding:7rem 2rem; background:#ffffff; position:relative; overflow:hidden }
    :host-context(.dark) .about-section { background:#000000 }
    .about-container { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center }
    .about-content { max-width:540px }
    .about-text { font-size:1.125rem; line-height:1.7; color:#475569; margin-bottom:2.5rem }
    :host-context(.dark) .about-text { color:#a1a1a6 }
    .about-stats { display:flex; gap:2.5rem; margin-bottom:3rem; border-top:1px solid #e2e8f0; padding-top:2rem }
    :host-context(.dark) .about-stats { border-color:rgba(255,255,255,0.1) }
    .about-stat { display:flex; flex-direction:column }
    .about-stat strong { font-size:2rem; font-weight:800; color:#1e40af; line-height:1 }
    :host-context(.dark) .about-stat strong { color:#60a5fa }
    .about-stat span { font-size:0.875rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-top:0.5rem }
    :host-context(.dark) .about-stat span { color:#94a3b8 }
    
    .about-features { display:grid; gap:2rem }
    .about-feat { display:flex; gap:1rem }
    .feat-icon { width:48px; height:48px; border-radius:12px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
    :host-context(.dark) .feat-icon { background:rgba(37,99,235,0.2); color:#60a5fa }
    .about-feat h4 { font-size:1.125rem; font-weight:700; margin:0 0 0.5rem; color:#0f172a }
    :host-context(.dark) .about-feat h4 { color:#f1f5f9 }
    .about-feat p { font-size:0.95rem; color:#64748b; margin:0; line-height:1.5 }
    :host-context(.dark) .about-feat p { color:#94a3b8 }

    .about-image { position:relative; height:500px; border-radius:24px; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center }
    :host-context(.dark) .about-image { background:#1e293b }
    .about-image img { width:100%; height:100%; object-fit:cover }
    .about-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#cbd5e1 }
    .about-icon-bg { width:200px; height:200px; opacity:0.1 }

    .about-visual { position:relative; height:500px; width:100% }
    .visual-card { position:absolute; background:#fff; border-radius:16px; box-shadow:0 20px 40px -5px rgba(0,0,0,0.1); border:1px solid #e2e8f0; overflow:hidden }
    :host-context(.dark) .visual-card { background:#1e293b; border-color:#334155; box-shadow:0 20px 40px -5px rgba(0,0,0,0.4) }
    .visual-card.main { top:0; left:0; right:40px; bottom:40px; padding:1.5rem; display:flex; flex-direction:column }
    /* No-background variant for user-supplied images: remove card background and padding */
    .visual-card.main.no-bg { background:transparent; border:none; box-shadow:none; padding:0; right:0 }
    .about-visual-img { width:100%; height:100%; object-fit:cover; display:block; border-radius:16px }
    /* Floating info pill — redesigned: pill background, subtle shadow, tighter spacing */
    .visual-card.float { bottom:0; right:0; min-width:200px; max-width:320px; padding:10px 14px; display:flex; align-items:center; gap:12px; border-radius:16px; background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,255,0.95)); border:1px solid rgba(15,23,42,0.06); box-shadow:0 8px 28px rgba(15,23,42,0.08); position:relative; z-index:2 }
    @keyframes float { 0%, 100% { transform:translateY(0) } 50% { transform:translateY(-6px) } }
    
    .vc-header { display:flex; gap:6px; margin-bottom:2rem }
    .vc-dot { width:10px; height:10px; border-radius:50% }
    .vc-dot.red { background:#ef4444 }
    .vc-dot.yellow { background:#f59e0b }
    .vc-dot.green { background:#22c55e }
    
    .vc-body { flex:1; display:flex; flex-direction:column; gap:1.5rem }
    .vc-line { height:8px; background:#f1f5f9; border-radius:4px }
    :host-context(.dark) .vc-line { background:#334155 }
    .vc-line.w-75 { width:75% }
    .vc-line.w-50 { width:50% }
    .vc-graph { flex:1; display:flex; align-items:flex-end; justify-content:space-between; padding-top:1rem; gap:1rem }
    .bar { width:100%; background:#eff6ff; border-radius:8px 8px 0 0; position:relative; overflow:hidden }
    :host-context(.dark) .bar { background:rgba(37,99,235,0.1) }
    .bar::after { content:''; position:absolute; bottom:0; left:0; right:0; height:0; background:#3b82f6; transition:height 1s ease; animation:grow 2s ease forwards }
    .bar:nth-child(1)::after { height:40%; animation-delay:0.2s }
    .bar:nth-child(2)::after { height:70%; animation-delay:0.4s }
    .bar:nth-child(3)::after { height:55%; animation-delay:0.6s }
    .bar:nth-child(4)::after { height:85%; animation-delay:0.8s }
    @keyframes grow { from { height:0 } }

    /* pill icon + text styles for redesigned float card */
    .vc-icon { width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, rgba(236,253,245,1), rgba(235,250,255,1)); color:#059669; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.6) }
    :host-context(.dark) .vc-icon { background:linear-gradient(135deg, rgba(6,30,40,0.16), rgba(8,40,60,0.12)); color:#34d399 }
    .vc-text { display:flex; flex-direction:column; font-size:0.9rem; line-height:1.1 }
    .vc-text strong { font-size:0.95rem; font-weight:800; color:#0f172a; margin-bottom:2px }
    :host-context(.dark) .vc-text strong { color:#f8fafc }
    .vc-text span { color:#6b7280; font-weight:600; font-size:0.82rem }
    :host-context(.dark) .vc-text span { color:#9fb6d9 }

    /* compact float placement on small screens */
    @media (max-width:768px) {
      .visual-card.float { right:12px; left:auto; bottom:12px; min-width:160px; padding:10px; gap:8px }
      .vc-text strong { font-size:0.9rem }
    }

    /* secure-icon styling (deep-blue pill with white icon) */
    .secure-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#ffffff; background:#0d47a1; box-shadow:0 8px 20px rgba(13,71,161,0.12); flex-shrink:0 }
    :host-context(.dark) .secure-icon { background:#0d47a1; box-shadow:0 8px 24px rgba(5,20,50,0.6) }

    /* About section badge deep-blue variant */
    .about-section .section-badge { background:#0d47a1; color:#ffffff }
    :host-context(.dark) .about-section .section-badge { background:#0d47a1; color:#ffffff }

    /* Footer */
    .footer { background:#f8fafc; padding:4rem 2rem 2rem; border-top:1px solid #e2e8f0 }
    :host-context(.dark) .footer { background:#0f172a; border-color:#1e293b }
    .footer-content { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:3rem; margin-bottom:3rem }
    .footer-brand h3 { font-size:1.5rem; font-weight:800; margin:0 0 1rem; color:#1e40af }
    :host-context(.dark) .footer-brand h3 { color:#60a5fa }
    .footer-brand p { color:#64748b; line-height:1.6; font-size:0.95rem }
    :host-context(.dark) .footer-brand p { color:#94a3b8 }
    .footer-col h4 { font-size:0.95rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#0f172a; margin:0 0 1.25rem }
    :host-context(.dark) .footer-col h4 { color:#f1f5f9 }
    .footer-links { display:flex; flex-direction:column; gap:0.75rem }
    .footer-links a { color:#64748b; text-decoration:none; font-size:0.95rem; transition:color 0.2s }
    .footer-links a:hover { color:#2563eb }
    :host-context(.dark) .footer-links a { color:#94a3b8 }
    :host-context(.dark) .footer-links a:hover { color:#60a5fa }
    .footer-bottom { max-width:1200px; margin:0 auto; padding-top:2rem; border-top:1px solid #e2e8f0; text-align:center; color:#94a3b8; font-size:0.875rem }
    :host-context(.dark) .footer-bottom { border-color:#1e293b }

    @media (max-width: 900px) {
      .about-container { grid-template-columns:1fr }
      .about-image { height:300px }
    }
  `]
})
export class StartPage implements OnInit, AfterViewInit {
  featuredCampaigns: Campaign[] = [];
  // full list of campaigns loaded from the service (used for searching)
  allCampaigns: Campaign[] = [];
  // campaigns currently shown in the grid after filtering
  filteredCampaigns: Campaign[] = [];
  // professional, minimal stats model
  stats = [
    { id: 'researchers', value: 15000, suffix: '+', label: 'PhD Students Enrolled', displayValue: '0', accent: 'linear-gradient(90deg,#60a5fa,#7c3aed)', iconHref: '#icon-researchers', iconBgClass: 'bg-ivory' },
    { id: 'completion', value: 3.5, suffix: ' yrs', label: 'Avg. Completion', displayValue: '0', accent: 'linear-gradient(90deg,#34d399,#059669)', iconHref: '#icon-time', iconBgClass: 'bg-mist' },
    { id: 'universities', value: 500, suffix: '+', label: 'Partner Universities', displayValue: '0', accent: 'linear-gradient(90deg,#f97316,#fb923c)', iconHref: '#icon-universities', iconBgClass: 'bg-pearl' },
    { id: 'satisfaction', value: 4.9, suffix: '/5', label: 'User Satisfaction', displayValue: '0', accent: 'linear-gradient(90deg,#ef4444,#fb7185)', iconHref: '#icon-stars', iconBgClass: 'bg-rose' }
  ];

  @ViewChild('statsContainer', { static: true }) statsContainer!: ElementRef<HTMLElement>;
  private statsAnimated = false;

  constructor(private router: Router, public auth: AuthService, private campagnesService: CampagnesService, private ngZone: NgZone, private tx: TranslationService) {}

  // template helper to translate keys
  t(path: string) {
    return this.tx.t(path);
  }

  pageDir() {
    return this.tx.current() === 'ar' ? 'rtl' : 'ltr';
  }

  ngOnInit() {
    this.loadFeaturedCampaigns();
    // If user is logged in with role USER, redirect to profile selection
    if (this.isLoggedIn) {
      const role = this.auth.role ? this.auth.role() : null;
      const roleStr = String(role || '').toLowerCase();
      
      // Redirect to profile selection if user has no specific role yet
      if (roleStr === 'user' || roleStr === 'role_user' || !roleStr || roleStr === 'null') {
        console.log('[StartPage] User has role USER, redirecting to profile selection');
        this.router.navigate(['/profile-selection']);
      }
    }
  }

  ngAfterViewInit(): void {
    // start animation when container is visible
    if (!this.statsContainer) return;
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.ngZone.runOutsideAngular(() => this.animateStats());
            obs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      obs.observe(this.statsContainer.nativeElement);
    } else {
      // fallback
      this.animateStats();
    }
  }

  private animateStats() {
    this.stats.forEach(s => {
      if (Number.isInteger(s.value)) {
        this.countTo(s, s.value, s.value > 1000 ? 1400 : 1000);
      } else {
        this.countToFloat(s, s.value, 900, 1);
      }
    });
  }

  private countTo(stat: any, target: number, duration = 1200) {
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      stat.displayValue = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else stat.displayValue = target.toLocaleString();
    };
    requestAnimationFrame(step);
  }

  private countToFloat(stat: any, target: number, duration = 1200, decimals = 1) {
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      stat.displayValue = current.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
      else stat.displayValue = target.toFixed(decimals);
    };
    requestAnimationFrame(step);
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn ? this.auth.isLoggedIn() : false;
  }

  loadFeaturedCampaigns() {
    // Try to load active campaigns from the public inscriptions endpoint
    this.campagnesService.getActiveCampaigns().subscribe({
      next: (list) => {
        if (!Array.isArray(list) || list.length === 0) {
          // Nothing public — keep the homepage empty or you might prefer a fallback to admin getAll when user is logged
          this.featuredCampaigns = [];
          return;
        }

        // Map backend campaign objects to the simple Campaign shape used in the template
        const mapped = list.map((c: any) => {
          const now = new Date();
          const dateFermeture = c.dateFermeture ? new Date(c.dateFermeture) : null;
          let status: Campaign['status'] = 'closed';
          if (c.active && (!dateFermeture || dateFermeture > now)) {
            // check if closing within 7 days
            if (dateFermeture) {
              const diff = (dateFermeture.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              status = diff <= 7 ? 'closing-soon' : 'open';
            } else {
              status = 'open';
            }
          }

          return {
            id: String(c.id ?? (c.nom ? c.nom : '')), // ensure string id
            title: c.nom || c.title || 'Campagne',
            description: c.description || c.resume || '',
            university: c.etablissement || c.ecoleDoctorale || c.university || '',
            universityLogo: c.logoEcole || c.universityLogo || '',
            bannerUrl: c.photoCouverture || c.bannerUrl || '/assets/default-campaign.jpg',
            domain: c.type || c.domaine || c.domain || '',
            status,
            funding: !!c.funding || !!c.financement || false
          } as Campaign;
        });

        // keep full mapped set (for searching) and initialize filtered view
        this.allCampaigns = mapped;
        // the homepage shows a short featured list by default
        this.featuredCampaigns = mapped.slice(0, 3);
        this.filteredCampaigns = this.allCampaigns.slice(0, 3);
      },
      error: (err) => {
        console.error('[StartPage] failed to load active campaigns', err);
        // keep placeholders or empty — for now leave empty
        this.featuredCampaigns = [];
      }
    });
  }

  onSearch(term: string) {
    const q = (term || '').trim().toLowerCase();
    if (!q) {
      // restore default featured slice when query empty
      this.filteredCampaigns = this.allCampaigns.slice(0, 3);
      return;
    }

    const results = this.allCampaigns.filter(c => {
      const hay = `${c.title || ''} ${c.university || ''} ${c.domain || ''} ${c.description || ''}`.toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    // show up to 6 matching results on the homepage
    this.filteredCampaigns = results.slice(0, 6);
  }

  getStatusLabel(status: string): string {
    // Use translation service to return localized status labels
    try {
      return this.tx.t('status.' + status) || status;
    } catch (e) {
      return status;
    }
  }

  goToAuth(mode: 'signin'|'signup'){
    this.router.navigate(['/auth'], { queryParams: { mode } });
  }
}
