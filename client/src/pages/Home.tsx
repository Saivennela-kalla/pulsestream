import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, CheckCircle2, CircleDot, CloudCog, Database, LockKeyhole, Radio, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import { useLocation } from "wouter";

const highlights = [
  ["12", "events / min", "cyan"],
  ["324 ms", "end-to-end latency", "green"],
  ["99.98%", "pipeline availability", "blue"],
] as const;

const architecturePreview = [
  { icon: LockKeyhole, label: "Cognito", color: "violet" },
  { icon: Waypoints, label: "API Gateway", color: "cyan" },
  { icon: Radio, label: "Kinesis", color: "blue" },
  { icon: Sparkles, label: "Lambda", color: "green" },
  { icon: Database, label: "S3 + Athena", color: "amber" },
  { icon: CircleDot, label: "AppSync", color: "cyan" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  return <div className="app-shell landing-page"><AppHeader /><main>
    <section className="hero shell"><div className="hero-copy"><div className="eyebrow"><span className="status-light green" /> REAL-TIME SALES INTELLIGENCE</div><h1>See every sale <span>as it moves.</span></h1><p>PulseStream is a live operations workspace for secure sales events, streaming analytics, validation outcomes, and traceable data-pipeline performance.</p><div className="hero-actions"><Button className="hero-primary" onClick={() => setLocation("/dashboard")}><Activity size={17} /> Open live workspace <ArrowRight size={17} /></Button><Button className="hero-secondary" variant="outline" onClick={() => setLocation("/architecture")}><CloudCog size={17} /> Explore architecture</Button></div><div className="hero-trust"><ShieldCheck size={16} /> Authentication-aware interface <span /> <CheckCircle2 size={16} /> Streaming demo ready</div></div>
      <div className="hero-console" aria-label="Live pipeline status"><div className="console-top"><div><span>PIPELINE STATUS</span><strong>All systems operational</strong></div><div className="console-live"><span className="status-light green" /> LIVE</div></div><div className="console-wave"><div className="grid-lines" /> <svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="heroLine" x1="0" x2="1"><stop offset="0" stopColor="#1754ff"/><stop offset="0.56" stopColor="#1ad7f2"/><stop offset="1" stopColor="#67f7c3"/></linearGradient></defs><path d="M0,119 C35,105 48,135 78,115 S122,66 147,100 S196,143 222,93 S268,58 300,91 S344,113 371,76 S419,42 447,78 S500,117 528,58 S565,42 600,20" fill="none" stroke="url(#heroLine)" strokeWidth="4"/></svg><div className="stream-pulse pulse-one"/><div className="stream-pulse pulse-two"/><div className="stream-pulse pulse-three"/></div><div className="console-bottom"><div><small>ACCEPTED</small><strong>2,847</strong></div><div><small>VALIDATION</small><strong className="green-text">PASSING</strong></div><div><small>LATENCY</small><strong>324 ms</strong></div></div></div>
    </section>
    <section className="highlight-band"><div className="shell highlight-grid">{highlights.map(([value, label, tone]) => <article key={label}><span className={`highlight-dot ${tone}`} /><strong>{value}</strong><span>{label}</span></article>)}</div></section>
    <section className="overview shell"><div className="overview-copy"><span className="section-kicker">BUILT FOR THE MOMENT AFTER CHECKOUT</span><h2>From one sale event to a shared operational truth.</h2><p>Watch data enter the platform, pass validation, update low-latency aggregates, enter durable history, and arrive at the dashboard with a trace you can inspect.</p><Button variant="outline" onClick={() => setLocation("/dashboard")}>Run the proof demo <ArrowRight size={16} /></Button></div><div className="flow-card"><div className="flow-card-head"><span className="section-kicker">ARCHITECTURE OVERVIEW</span><span className="flow-status"><span className="status-light green" /> Health: nominal</span></div><div className="mini-flow">{architecturePreview.map((service, index) => <div className="mini-flow-step" key={service.label}><div className={`mini-service ${service.color}`}><service.icon size={18}/></div><strong>{service.label}</strong>{index < architecturePreview.length - 1 && <i />}</div>)}</div><div className="flow-footnote"><span><Radio size={14} /> Streaming boundary in place</span><span><CheckCircle2 size={14} /> Traceable event lifecycle</span></div></div></section>
    <section className="feature-slab shell"><div className="feature-heading"><span className="section-kicker">REVIEWER-READY WORKSPACE</span><h2>Designed to prove behavior, not just describe it.</h2></div><div className="feature-grid"><article><span>01</span><h3>Live pipeline control</h3><p>Start, pause, and stop synthetic traffic while a visible demo-mode badge identifies the active simulation.</p></article><article><span>02</span><h3>Evidence-rich validation</h3><p>Run a valid, duplicate, and invalid sale sequence with outcomes preserved in both live-feed and rejection views.</p></article><article><span>03</span><h3>Traceable architecture</h3><p>Inspect each AWS service stage and follow a concrete event lifecycle across the platform.</p></article></div></section>
  </main></div>;
}
