# Contributing to n8n-nodes-twenty-crm

Thanks for considering contributing! This project aims to be the definitive n8n integration for Twenty CRM.

## Getting Started

```bash
git clone https://github.com/pvass24/n8n-nodes-twenty-crm.git
cd n8n-nodes-twenty-crm
npm install
```

## Development Workflow

1. **Write tests first** (TDD) — create a failing test in `test/unit/` or `test/integration/`
2. **Implement** — write the minimum code to make tests pass
3. **Type check** — `npx tsc --noEmit`
4. **Run all tests** — `npm test`
5. **Build** — `npm run build`

## Adding a New Resource

Follow the existing pattern:

```
nodes/TwentyCrm/resources/{resource}/
├── {resource}.description.ts   # n8n UI field definitions
└── {resource}.handler.ts       # API request logic
```

1. Add the description (operations + fields) using the patterns in `company.description.ts`
2. Add the handler with CRUD operations using `twentyApiRequest` / `twentyApiRequestAllItems`
3. Import and register in `TwentyCrm.node.ts`
4. Add unit tests for any new logic in `test/unit/`
5. Add integration tests in `test/integration/`

## Code Standards

- **Zero runtime dependencies** — only `n8n-workflow` as a peer dep
- **TypeScript strict mode** — all code must pass `tsc --noEmit`
- **Composite fields** — flatten nested objects into user-friendly flat inputs
- **Error handling** — always parse errors into actionable messages

## Testing

```bash
# Unit tests (no network, fast)
npm test

# Integration tests (needs .env.test with credentials)
npm run test:integration
```

For integration tests, create `.env.test`:
```env
TWENTY_API_URL=https://your-instance.com/rest
TWENTY_API_KEY=your-key
```

Use the `__TEST_` prefix for any records created in tests, and clean up in `afterAll`.

## Pull Request Process

1. Fork and branch from `main`
2. Follow commit convention: `feat:`, `fix:`, `docs:`, `chore:`
3. Ensure all tests pass
4. Ensure TypeScript builds without errors
5. Update CHANGELOG.md if adding features
6. Submit PR with clear description of changes

## Questions?

Open an issue on GitHub — we're happy to help.
