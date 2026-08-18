export const TRACE_STAGES = [
  "API received",
  "validated",
  "stored",
  "aggregates updated",
  "dashboard published",
] as const;

export type TraceStage = (typeof TRACE_STAGES)[number];
export type EventStatus = "processed" | "duplicate" | "rejected";

export type SaleEvent = {
  eventId: string;
  orderId: string;
  product: string;
  region: string;
  quantity: number;
  price: number;
  revenue: number;
  eventTime: string;
  status: EventStatus;
  latencyMs: number;
  reason?: string;
};

const catalog = [
  { product: "Laptop Pro 14", price: 84999 },
  { product: "CloudBook Air", price: 62999 },
  { product: "NoiseCancel Pro", price: 8999 },
  { product: "Orbit Watch", price: 15999 },
  { product: "Studio Dock", price: 12499 },
];

const regions = ["Vizag", "Hyderabad", "Chennai", "Bangalore", "Pune"];

export function createSyntheticEvent(now = Date.now()): SaleEvent {
  const product = catalog[Math.floor(Math.random() * catalog.length)]!;
  const quantity = Math.floor(Math.random() * 3) + 1;
  const region = regions[Math.floor(Math.random() * regions.length)]!;
  const latencyMs = Math.floor(Math.random() * 630) + 240;

  return {
    eventId: `evt-${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    orderId: `ORD-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    product: product.product,
    region,
    quantity,
    price: product.price,
    revenue: product.price * quantity,
    eventTime: new Date(now).toISOString(),
    status: "processed",
    latencyMs,
  };
}

export function createProofEvents(now = Date.now()): SaleEvent[] {
  const valid: SaleEvent = {
    eventId: `evt-proof-valid-${now}`,
    orderId: "ORD-PROOF-201",
    product: "CloudBook Air",
    region: "Hyderabad",
    quantity: 1,
    price: 62999,
    revenue: 62999,
    eventTime: new Date(now).toISOString(),
    status: "processed",
    latencyMs: 382,
  };

  const duplicate: SaleEvent = {
    ...valid,
    eventId: `evt-proof-duplicate-${now}`,
    eventTime: new Date(now + 80).toISOString(),
    status: "duplicate",
    latencyMs: 179,
    reason: "Idempotency key already processed",
  };

  const invalid: SaleEvent = {
    eventId: `evt-proof-invalid-${now}`,
    orderId: "ORD-PROOF-202",
    product: "Studio Dock",
    region: "Vizag",
    quantity: 1,
    price: -12499,
    revenue: 0,
    eventTime: new Date(now + 160).toISOString(),
    status: "rejected",
    latencyMs: 114,
    reason: "Rejected: negative unit price",
  };

  return [valid, duplicate, invalid];
}

export function acceptedRevenue(events: SaleEvent[]) {
  return events
    .filter((event) => event.status === "processed")
    .reduce((total, event) => total + event.revenue, 0);
}
