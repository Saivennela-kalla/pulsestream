import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { acceptedRevenue, createProofEvents, SaleEvent, TRACE_STAGES } from "@shared/stream";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CirclePause,
  CircleStop,
  CopyCheck,
  Database,
  Gauge,
  MousePointer2,
  Play,
  Radio,
  RefreshCcw,
  ServerCog,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";

type SimulatorState = "stopped" | "running" | "paused";

const seedEvents: SaleEvent[] = [
  { eventId: "evt-83d20f", orderId: "ORD-859641", product: "Laptop Pro 14", region: "Bangalore", quantity: 1, price: 84999, revenue: 84999, eventTime: "2026-08-18T11:34:31.000Z", status: "processed", latencyMs: 331 },
  { eventId: "evt-83d1be", orderId: "ORD-859640", product: "NoiseCancel Pro", region: "Vizag", quantity: 2, price: 8999, revenue: 17998, eventTime: "2026-08-18T11:34:21.000Z", status: "processed", latencyMs: 286 },
  { eventId: "evt-83d17c", orderId: "ORD-859639", product: "Orbit Watch", region: "Hyderabad", quantity: 1, price: 15999, revenue: 15999, eventTime: "2026-08-18T11:34:16.000Z", status: "processed", latencyMs: 418 },
  { eventId: "evt-83d02a", orderId: "ORD-859638", product: "CloudBook Air", region: "Chennai", quantity: 1, price: 62999, revenue: 62999, eventTime: "2026-08-18T11:34:02.000Z", status: "processed", latencyMs: 392 },
];

const baseSeries = [
  { time: "11:05", revenue: 48, orders: 6 },
  { time: "11:10", revenue: 62, orders: 9 },
  { time: "11:15", revenue: 57, orders: 7 },
  { time: "11:20", revenue: 81, orders: 12 },
  { time: "11:25", revenue: 96, orders: 14 },
  { time: "11:30", revenue: 88, orders: 11 },
  { time: "11:35", revenue: 124, orders: 18 },
];

const statusCopy = {
  processed: "Processed",
  duplicate: "Duplicate",
  rejected: "Rejected",
};

function currency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function shortTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function statusClass(status: SaleEvent["status"]) {
  return `status-badge ${status}`;
}

export default function Dashboard() {
  const [events, setEvents] = useState<SaleEvent[]>(seedEvents);
  const [simulator, setSimulator] = useState<SimulatorState>("stopped");
  const [rate, setRate] = useState(12);
  const [selectedEvent, setSelectedEvent] = useState<SaleEvent>(seedEvents[0]!);
  const [proofEvents, setProofEvents] = useState<SaleEvent[]>([]);
  const lastEventId = useRef<string | null>(null);
  const isRunning = simulator === "running";
  const pollInterval = Math.max(1000, Math.round(60000 / Math.max(1, rate)));
  const nextEvent = trpc.demo.nextEvent.useQuery(undefined, {
    enabled: isRunning,
    refetchInterval: isRunning ? pollInterval : false,
    refetchIntervalInBackground: false,
  });
  const streamLabel = nextEvent.isError
    ? "Polling unavailable"
    : isRunning
      ? nextEvent.isFetching
        ? "Refreshing stream"
        : "Polling stream connected"
      : "Stream on standby";

  useEffect(() => {
    if (!nextEvent.data || nextEvent.data.eventId === lastEventId.current) return;
    lastEventId.current = nextEvent.data.eventId;
    setEvents((current) => [nextEvent.data, ...current].slice(0, 13));
    setSelectedEvent(nextEvent.data);
  }, [nextEvent.data]);

  const metrics = useMemo(() => {
    const processed = events.filter((event) => event.status === "processed");
    const rejected = events.filter((event) => event.status === "rejected").length;
    const duplicate = events.filter((event) => event.status === "duplicate").length;
    const topProduct = processed.reduce<Record<string, number>>((acc, event) => {
      acc[event.product] = (acc[event.product] ?? 0) + event.revenue;
      return acc;
    }, {});
    const topRegion = processed.reduce<Record<string, number>>((acc, event) => {
      acc[event.region] = (acc[event.region] ?? 0) + event.revenue;
      return acc;
    }, {});
    const product = Object.entries(topProduct).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "CloudBook Air";
    const region = Object.entries(topRegion).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Bangalore";
    const averageLatency = Math.round(events.reduce((total, event) => total + event.latencyMs, 0) / events.length);
    const revenue = 1248430 + acceptedRevenue(events);
    const orders = 386 + processed.length;
    return { revenue, orders, avgOrder: Math.round(revenue / orders), product, region, rejected, duplicate, averageLatency, processed: 2847 + processed.length };
  }, [events]);

  const chartData = useMemo(() => {
    const delta = acceptedRevenue(events) / 1000;
    return baseSeries.map((item, index) => ({
      ...item,
      revenue: Math.round(item.revenue + (index === baseSeries.length - 1 ? delta : 0)),
      orders: item.orders + (index === baseSeries.length - 1 ? events.filter((event) => event.status === "processed").length : 0),
    }));
  }, [events]);

  const proofDemo = () => {
    const proof = createProofEvents();
    setProofEvents(proof);
    setEvents((current) => [...proof.slice().reverse(), ...current].slice(0, 13));
    setSelectedEvent(proof[0]!);
  };

  const setTraffic = (state: SimulatorState) => setSimulator(state);

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="dashboard-shell shell">
        <section className="dashboard-title-row">
          <div>
            <div className="eyebrow"><Radio size={14} className={isRunning ? "pulse-icon" : ""} /> LIVE OPERATIONS WORKSPACE</div>
            <h1>Sales pipeline control room</h1>
            <p>Streaming analytics, validation outcomes, and pipeline evidence in one authenticated-ready workspace.</p>
          </div>
          <div className="dashboard-title-actions">
            <div className={`connection-chip ${nextEvent.isError ? "connection-error" : ""}`}><span className={`status-light ${nextEvent.isError ? "red" : "green"}`} /> {streamLabel}</div>
            <Button className="proof-button" onClick={proofDemo}><MousePointer2 size={15} /> Run proof demo</Button>
          </div>
        </section>

        {simulator !== "stopped" && (
          <div className="demo-mode-banner" role="status">
            <span className="demo-live-dot" /> DEMO MODE {simulator === "running" ? "ACTIVE" : "PAUSED"}
            <span>Traffic simulator is {simulator} at {rate} events/min</span>
          </div>
        )}

        <section className="kpi-grid" aria-label="Pipeline key metrics">
          <MetricCard label="Total revenue" value={currency(metrics.revenue)} change="12.8%" direction="up" icon={<ArrowUpRight />} accent="cyan" />
          <MetricCard label="Order count" value={metrics.orders.toLocaleString("en-IN")} change="18 new" direction="up" icon={<Database />} accent="blue" />
          <MetricCard label="Average order value" value={currency(metrics.avgOrder)} change="3.1%" direction="up" icon={<Gauge />} accent="violet" />
          <MetricCard label="Orders / min" value={isRunning ? String(rate) : "0"} change={isRunning ? "live stream" : "paused"} direction={isRunning ? "up" : "flat"} icon={<Activity />} accent="green" />
          <MetricCard label="Top product" value={metrics.product} change="revenue leader" direction="flat" icon={<CopyCheck />} accent="amber" compact />
          <MetricCard label="Top region" value={metrics.region} change="highest velocity" direction="flat" icon={<Radio />} accent="blue" compact />
        </section>

        <section className="dashboard-main-grid">
          <article className="panel chart-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">STREAMING PERFORMANCE</span><h2>Revenue & order volume</h2></div>
              <div className="panel-legend"><span><i className="legend-dot cyan" /> Revenue (₹K)</span><span><i className="legend-dot blue" /> Orders</span></div>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs><linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1ad7f2" stopOpacity={0.32}/><stop offset="100%" stopColor="#1ad7f2" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="#213247" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#8194ae", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8194ae", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0c1726", border: "1px solid #27445e", borderRadius: 10, color: "#e9f4ff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1ad7f2" strokeWidth={2.5} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="volume-strip">
              <span>Orders arriving now</span>
              <div className="volume-bars">
                {chartData.map((point) => <span key={point.time} style={{ height: `${Math.min(100, point.orders * 5)}%` }} />)}
              </div>
              <strong>{chartData.at(-1)?.orders} events</strong>
            </div>
          </article>

          <article className="panel simulator-panel">
            <div className="panel-heading"><div><span className="section-kicker">CONTROL PLANE</span><h2>Simulate live traffic</h2></div><Badge className={isRunning ? "simulator-state active" : "simulator-state"}>{simulator}</Badge></div>
            <p className="panel-description">Generate synthetic sales through the same canonical event path used by the dashboard polling stream.</p>
            <label className="rate-label">Event rate <span>{rate} / min</span></label>
            <div className="rate-control"><Input aria-label="Events per minute" type="number" min="1" max="60" value={rate} onChange={(event) => setRate(Math.min(60, Math.max(1, Number(event.target.value) || 1)))} /><span>events / min</span></div>
            <div className="sim-controls">
              <Button onClick={() => setTraffic("running")} className="start-control"><Play size={15} /> Start</Button>
              <Button variant="outline" onClick={() => setTraffic("paused")}><CirclePause size={15} /> Pause</Button>
              <Button variant="outline" onClick={() => setTraffic("stopped")}><CircleStop size={15} /> Stop</Button>
            </div>
            <div className="simulator-footnote"><ShieldCheck size={15} /> Every event receives an ID, validation status, and traceable latency.</div>
          </article>
        </section>

        <section className="health-grid">
          <article className="panel health-panel">
            <div className="panel-heading"><div><span className="section-kicker">PIPELINE HEALTH</span><h2>Operational signal</h2></div><span className="healthy-indicator"><span className="status-light green" /> Healthy</span></div>
            <div className="health-metrics">
              <HealthMetric icon={<Activity />} label="Ingestion rate" value={isRunning ? `${rate} / min` : "0 / min"} state="good" />
              <HealthMetric icon={<Check />} label="Processed" value={metrics.processed.toLocaleString("en-IN")} state="good" />
              <HealthMetric icon={<XCircle />} label="Rejected" value={String(metrics.rejected)} state={metrics.rejected ? "bad" : "good"} />
              <HealthMetric icon={<CopyCheck />} label="Duplicate" value={String(metrics.duplicate)} state={metrics.duplicate ? "warning" : "good"} />
              <HealthMetric icon={<AlertTriangle />} label="Dead-letter" value="0" state="good" />
              <HealthMetric icon={<Timer />} label="End-to-end latency" value={`${metrics.averageLatency} ms`} state="good" />
            </div>
          </article>
          <EventTrace event={selectedEvent} />
        </section>

        <section className="panel events-panel">
          <div className="panel-heading"><div><span className="section-kicker">EVENT STREAM</span><h2>Recent events</h2></div><div className="event-stream-note"><span className="status-light green" /> {isRunning ? "Events updating from polling source" : "Select Start to resume polling"}</div></div>
          <div className="table-scroll"><table><thead><tr><th>Event ID</th><th>Order ID</th><th>Product</th><th>Region</th><th>Qty</th><th>Price</th><th>Revenue</th><th>Event time</th><th>Status</th><th>Latency</th><th /></tr></thead><tbody>
            {events.map((event) => <tr key={event.eventId} className={selectedEvent.eventId === event.eventId ? "selected-row" : ""}>
              <td><code>{event.eventId}</code></td><td>{event.orderId}</td><td className="product-cell">{event.product}</td><td>{event.region}</td><td>{event.quantity}</td><td>{currency(event.price)}</td><td>{currency(event.revenue)}</td><td>{shortTime(event.eventTime)}</td><td><span className={statusClass(event.status)}>{statusCopy[event.status]}</span></td><td>{event.latencyMs} ms</td><td><button className="trace-button" onClick={() => setSelectedEvent(event)}>Trace</button></td>
            </tr>)}
          </tbody></table></div>
        </section>

        <section className="proof-section" aria-labelledby="proof-title">
          <div className="proof-title"><div><span className="section-kicker">DETERMINISTIC DEMONSTRATION</span><h2 id="proof-title">Proof demo sequence</h2><p>Run a valid sale, a duplicate sale, and an invalid sale. The resulting evidence is retained in both views below.</p></div><Button onClick={proofDemo} variant="outline"><RefreshCcw size={15} /> Re-run sequence</Button></div>
          {proofEvents.length === 0 ? <div className="proof-empty"><ServerCog size={20} /> <span>No proof run yet. Execute the sequence to capture validation and live-feed evidence.</span></div> : <div className="proof-evidence-grid">
            <ProofLiveFeed events={proofEvents} />
            <ProofRejectionView events={proofEvents} />
          </div>}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, change, direction, icon, accent, compact = false }: { label: string; value: string; change: string; direction: "up" | "flat"; icon: React.ReactNode; accent: string; compact?: boolean }) {
  return <article className={`metric-card accent-${accent}`}><div className="metric-card-top"><span>{label}</span><div className="metric-icon">{icon}</div></div><strong className={compact ? "metric-value compact" : "metric-value"}>{value}</strong><div className={`metric-change ${direction}`} >{direction === "up" ? <ArrowUpRight size={13} /> : <span className="flat-dot" />} {change}</div></article>;
}

function HealthMetric({ icon, label, value, state }: { icon: React.ReactNode; label: string; value: string; state: "good" | "warning" | "bad" }) {
  return <div className="health-metric"><div className={`health-icon ${state}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function EventTrace({ event }: { event: SaleEvent }) {
  const failed = event.status === "rejected";
  const duplicate = event.status === "duplicate";
  return <article className="panel trace-panel"><div className="panel-heading"><div><span className="section-kicker">TRACE SELECTED EVENT</span><h2>Event lifecycle</h2></div><code>{event.eventId}</code></div><div className="trace-summary"><span className={statusClass(event.status)}>{statusCopy[event.status]}</span><span>{event.orderId}</span><span>{event.latencyMs} ms end-to-end</span></div><ol className="trace-timeline">
    {TRACE_STAGES.map((stage, index) => {
      const isBlocked = failed && index > 1;
      const isDuplicate = duplicate && index === 1;
      return <li key={stage} className={isBlocked ? "blocked" : isDuplicate ? "duplicate-stage" : "complete"}><span className="trace-node">{isBlocked ? <span>—</span> : isDuplicate ? <CopyCheck size={12} /> : <Check size={12} />}</span><div><strong>{stage}</strong><small>{isBlocked ? "Not executed after validation failure" : isDuplicate ? "Idempotency key matched" : index === 0 ? "Gateway accepted request" : index === 1 ? "Schema contract passed" : index === 2 ? "Durable record written" : index === 3 ? "KPI materialized" : "Subscribers notified"}</small></div></li>;
    })}
  </ol></article>;
}

function ProofLiveFeed({ events }: { events: SaleEvent[] }) {
  return <article className="proof-card"><div className="proof-card-heading"><Radio size={16} /><div><strong>Live-feed view</strong><span>All three sales appear in the stream</span></div></div><div className="proof-outcome-list">{events.map((event, index) => <div className="proof-outcome" key={event.eventId}><span className={`proof-number ${event.status}`}>{index + 1}</span><div><strong>{index === 0 ? "Valid sale" : index === 1 ? "Duplicate sale" : "Invalid sale"}</strong><small>{event.eventId}</small></div><span className={statusClass(event.status)}>{statusCopy[event.status]}</span></div>)}</div></article>;
}

function ProofRejectionView({ events }: { events: SaleEvent[] }) {
  return <article className="proof-card"><div className="proof-card-heading"><AlertTriangle size={16} /><div><strong>Rejected-events view</strong><span>Validation outcome for every proof record</span></div></div><div className="proof-outcome-list">{events.map((event, index) => <div className="proof-outcome" key={event.eventId}><span className={`proof-number ${event.status}`}>{index + 1}</span><div><strong>{index === 0 ? "Valid sale" : index === 1 ? "Duplicate sale" : "Invalid sale"}</strong><small>{event.status === "rejected" ? event.reason : event.status === "duplicate" ? "Not rejected — duplicate audit retained" : "Not rejected — schema valid"}</small></div><span className={event.status === "rejected" ? "status-badge rejected" : event.status === "duplicate" ? "status-badge duplicate" : "status-badge processed"}>{event.status === "rejected" ? "Rejected" : event.status === "duplicate" ? "Audited" : "Passed"}</span></div>)}</div></article>;
}
