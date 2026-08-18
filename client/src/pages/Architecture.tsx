import AppHeader from "@/components/AppHeader";
import { ArrowRight, Check, CircleDot, Database, LockKeyhole, MousePointer2, Radio, ServerCog, Sparkles, Waypoints, Workflow } from "lucide-react";
import { useState } from "react";

const services = [
  { name: "Cognito", eyebrow: "Identity boundary", description: "Authenticates users and establishes scoped application access before any sales event can enter the system.", icon: LockKeyhole, tone: "violet" },
  { name: "API Gateway", eyebrow: "Ingress contract", description: "Receives protected requests, enforces authorization, and applies a durable API contract to the event producer.", icon: Waypoints, tone: "cyan" },
  { name: "Kinesis", eyebrow: "Streaming backbone", description: "Creates the event boundary that keeps producers and consumers decoupled while preserving durable ordered delivery.", icon: Radio, tone: "blue" },
  { name: "Lambda", eyebrow: "Validation & enrichment", description: "Validates each sale, prevents duplicated processing, adds trace metadata, and routes failures safely.", icon: Sparkles, tone: "green" },
  { name: "S3", eyebrow: "Durable data lake", description: "Retains raw, curated, rejected, and query-result records so events can be replayed and audited.", icon: Database, tone: "amber" },
  { name: "Glue/Athena", eyebrow: "Historical intelligence", description: "Catalogs curated records and makes sales history available to analytical SQL and downstream reporting.", icon: Workflow, tone: "cyan" },
  { name: "DynamoDB", eyebrow: "Hot aggregates", description: "Serves low-latency recent events and materialized KPI counters for the live workspace.", icon: ServerCog, tone: "blue" },
  { name: "AppSync", eyebrow: "Realtime delivery", description: "Publishes updated aggregate and event state to authorized dashboard subscribers without page refreshes.", icon: CircleDot, tone: "green" },
];

const lifecycle = ["Authenticated request", "Contract validation", "Stream accepted", "Event normalized", "Hot aggregate updated", "Live dashboard published"];

export default function Architecture() {
  const [selected, setSelected] = useState(services[0]!);
  return <div className="app-shell architecture-page"><AppHeader /><main className="shell architecture-shell">
    <section className="architecture-hero"><div><div className="eyebrow"><Workflow size={14} /> SYSTEM MAP</div><h1>Design for a sale that never disappears.</h1><p>PulseStream separates identity, event ingestion, validation, real-time operations, and historical analytics into observable stages. Select a service node to inspect its responsibility.</p></div><div className="architecture-score"><span>EVENT PATH</span><strong>08 <small>services</small></strong><p><span className="status-light green" /> All stages observable</p></div></section>
    <section className="architecture-canvas panel"><div className="panel-heading"><div><span className="section-kicker">CLICKABLE SERVICE MAP</span><h2>AWS service stages</h2></div><div className="canvas-help"><MousePointer2 size={15} /> Select any node</div></div>
      <div className="architecture-grid">{services.map((service, index) => <button key={service.name} className={`service-node ${service.tone} ${selected.name === service.name ? "selected" : ""}`} onClick={() => setSelected(service)}><span className="node-index">0{index + 1}</span><service.icon size={24}/><strong>{service.name}</strong><span>{service.eyebrow}</span></button>)}</div>
      <div className={`service-inspector ${selected.tone}`}><div className="inspector-icon"><selected.icon size={22}/></div><div><span>{selected.eyebrow}</span><h3>{selected.name}</h3><p>{selected.description}</p></div><div className="inspector-status"><span className="status-light green" /> Connected stage</div></div>
    </section>
    <section className="lifecycle-section"><div className="section-title"><span className="section-kicker">EVENT LIFECYCLE DIAGRAM</span><h2>From a protected click to a visible KPI</h2><p>The event lifecycle is designed as a set of observable handoffs, with each stage emitting a traceable timestamp and correlation ID.</p></div><div className="lifecycle-flow">{lifecycle.map((step, index) => <div className="lifecycle-part" key={step}><div className="lifecycle-step"><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong><small>{index === 0 ? "Cognito + API Gateway" : index === 1 ? "Lambda" : index === 2 ? "Kinesis" : index === 3 ? "Lambda + S3" : index === 4 ? "DynamoDB" : "AppSync"}</small></div>{index < lifecycle.length - 1 && <ArrowRight className="lifecycle-arrow" />}</div>)}</div>
    </section>
    <section className="architecture-principles"><article><Check size={17}/><div><strong>Identity first</strong><span>Authenticated calls cross the boundary before event ingestion begins.</span></div></article><article><Check size={17}/><div><strong>Replayable history</strong><span>Durable records make operations inspectable and recoverable.</span></div></article><article><Check size={17}/><div><strong>Push-oriented UX</strong><span>Live workspace subscribers receive state when the pipeline changes.</span></div></article></section>
  </main></div>;
}
