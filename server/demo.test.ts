import { describe, expect, it } from "vitest";
import { acceptedRevenue, createProofEvents, TRACE_STAGES } from "../shared/stream";

describe("PulseStream proof demo", () => {
  it("keeps the required event-trace stage order", () => {
    expect(TRACE_STAGES).toEqual([
      "API received",
      "validated",
      "stored",
      "aggregates updated",
      "dashboard published",
    ]);
  });

  it("creates a valid, duplicate, and invalid proof outcome", () => {
    const events = createProofEvents(1723970000000);
    expect(events.map((event) => event.status)).toEqual(["processed", "duplicate", "rejected"]);
    expect(events[2]?.reason).toContain("negative unit price");
  });

  it("counts revenue only for processed events so duplicate and rejected sales cannot inflate totals", () => {
    const events = createProofEvents(1723970000000);
    expect(acceptedRevenue(events)).toBe(62999);
  });
});
