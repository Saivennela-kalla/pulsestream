# PulseStream — Real-Time Retail Intelligence

PulseStream is a live operations workspace for secure retail sales streams, analytics, and pipeline evidence. It demonstrates a production-style AWS data-engineering workflow, moving from a local Java batch processor to a real-time, authenticated analytics platform.

## Key Features

- **Live Pipeline Control**: Start, pause, and stop synthetic traffic simulation with a visible demo-mode badge.
- **Evidence-Rich Validation**: A proof-demo sequence for valid, duplicate, and invalid sales with simultaneous live-feed and rejection outcomes.
- **Traceable Event Lifecycle**: An exact five-stage trace (API received → validated → stored → aggregates updated → dashboard published) for every event.
- **Interactive AWS Architecture**: A clickable system map covering Cognito, API Gateway, Kinesis, Lambda, S3, Glue/Athena, DynamoDB, and AppSync.
- **Dark Command-Center Design**: High-density data, crisp typography, and glowing real-time indicators.

## Local Setup for VS Code

This project uses a React 19 + Tailwind 4 + Express 4 + tRPC 11 stack.

### Prerequisites

- **Node.js**: Version 22.13.0 or later.
- **pnpm**: The recommended package manager.
- **MySQL/TiDB**: A database instance for the `web-db-user` features.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pulsestream
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file at the root and add your database and authentication secrets (see `server/_core/env.ts` for the required list).

4. Initialize the database:
   ```bash
   pnpm db:push
   ```

### Development

Start the development server:
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

### Testing

Run the automated proof-demo and authentication tests:
```bash
pnpm test
```

## Architecture

PulseStream separates identity, ingestion, validation, and analytics into observable stages:

1. **Identity (Cognito)**: Authenticates users and establishes scoped access.
2. **Ingress (API Gateway)**: Enforces authorization and API contracts.
3. **Streaming (Kinesis)**: Decouples producers and consumers with durable delivery.
4. **Validation (Lambda)**: Enriches events and prevents duplicate processing.
5. **Data Lake (S3)**: Retains raw and curated records for auditing and replay.
6. **Analytics (Glue/Athena)**: Catalogs history for historical intelligence.
7. **Hot Store (DynamoDB)**: Serves low-latency KPI aggregates to the workspace.
8. **Real-time (AppSync)**: Publishes live updates to authenticated subscribers.

## Repository Structure

- `client/src/pages/`: Feature UI (Home, Dashboard, Architecture).
- `server/routers.ts`: tRPC procedures for authentication and demo simulation.
- `shared/stream.ts`: Canonical event definitions and synthetic data generation.
- `drizzle/schema.ts`: Database tables and types.
- `server/demo.test.ts`: Automated validation for the sales pipeline.

## License

MIT
