# PulseStream — Real-Time Retail Intelligence

PulseStream is a polished real-time sales pipeline analytics platform. It turns a simple local sales-data exercise into a reviewer-facing operations workspace for streaming events, validation outcomes, pipeline health, and traceable architecture.

The product is designed to communicate one clear idea: **see every sale as it moves**. The live dashboard includes a polling-powered synthetic stream, KPI telemetry, pipeline health, recent events, event tracing, and a deterministic proof sequence for valid, duplicate, and invalid sales. The architecture explorer maps the platform to Cognito, API Gateway, Kinesis, Lambda, S3, Glue/Athena, DynamoDB, and AppSync.

## Run it in VS Code

### Requirements

Install Node.js 22 or newer and pnpm. A database is only required if you extend the template’s built-in user persistence; the visual demo and synthetic polling stream run without a custom database connection.

### Install and start

```bash
git clone <repository-url>
cd pulsestream
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Use **Try demo** to open the live workspace or select **Architecture** to inspect the clickable AWS service map.

### Verify the project

```bash
pnpm check
pnpm test
pnpm build
```

The test suite covers the exact event-trace stage order, the valid/duplicate/invalid proof sequence, and revenue protection against duplicate or rejected events.

## Reviewer walkthrough

Start on the landing page and select **Open live workspace**. In the workspace, click **Run proof demo** to display all three outcomes in both the Live-feed view and Rejected-events view. Click **Trace** on any event to inspect its lifecycle. In the control plane, set an event rate and click **Start**; the dashboard begins polling the demo endpoint and keeps the **DEMO MODE ACTIVE** badge visible during the simulation. Finish on **Architecture** and click several service nodes to inspect their responsibilities.

## System architecture

The intended AWS workflow is:

```text
Authenticated client
        │
        ▼
Cognito → API Gateway → Kinesis → Lambda validation/enrichment
                                      ├── DynamoDB hot aggregates
                                      ├── S3 raw / curated / rejected history
                                      └── AppSync real-time dashboard updates
                                                │
                                                ▼
                                      Glue/Athena historical analytics
```

The current repository includes the interactive frontend experience and a local polling-backed demo source. The AWS services above are represented in the architecture explorer and documented as the target integration path; they are not silently claimed as provisioned resources.

## Repository structure

```text
client/src/components/AppHeader.tsx  Shared navigation and product header
client/src/pages/Home.tsx             Landing page and architecture preview
client/src/pages/Dashboard.tsx         Live dashboard, simulator, trace, proof demo
client/src/pages/Architecture.tsx      Clickable AWS service map and lifecycle diagram
server/routers.ts                      tRPC demo polling endpoint and auth procedures
shared/stream.ts                       Canonical event types and proof data
server/demo.test.ts                    Sales-event and proof-demo tests
todo.md                                Feature checklist and implementation history
```

## Design system

PulseStream uses a dark navy and charcoal foundation, electric blue and cyan streaming accents, green healthy states, amber warnings, and red failures. Monospaced labels distinguish system telemetry from human-readable product copy. The interface is responsive and is designed to feel like a live operations control room rather than a generic dashboard template.

## Extension path

To connect the UI to AWS, replace the public `demo.nextEvent` procedure with an authenticated event API and add the AWS infrastructure described in the architecture page. Keep the canonical event shape from `shared/stream.ts`, calculate revenue server-side, preserve event IDs for idempotency, and route invalid records to a rejected or dead-letter path. Add infrastructure as code, IAM policies, CloudWatch metrics, S3 storage, Glue/Athena queries, and AppSync subscriptions as the AWS layer is implemented.

## License

MIT
