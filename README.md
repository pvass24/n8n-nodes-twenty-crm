# n8n-nodes-twentycrm-pro

[![npm version](https://img.shields.io/npm/v/n8n-nodes-twentycrm-pro.svg)](https://www.npmjs.com/package/n8n-nodes-twentycrm-pro)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-twentycrm-pro.svg)](https://www.npmjs.com/package/n8n-nodes-twentycrm-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://docs.n8n.io/integrations/community-nodes/)

> The production-grade n8n community node for [Twenty CRM](https://twenty.com) — the open-source alternative to Salesforce.

Full CRUD operations with **cursor pagination**, **advanced filtering**, **composite field handling**, and **zero runtime dependencies**.

---

## Why This Node?

| Feature | n8n-nodes-twentycrm-pro | Other Twenty nodes |
|---------|---------------------|-------------------|
| Pagination (Return All) | **Full cursor-based** | None (max 60 results) |
| Filtering | **Built-in filter UI** | Manual query strings |
| Create/Update bodies | **Properly structured** | Broken (bugs #5, #6) |
| Error messages | **Actionable & clear** | Raw JSON dumps |
| Runtime dependencies | **Zero** | Has runtime deps |
| n8n verification eligible | **Yes** | No |
| AI Agent compatible | **Yes** (`usableAsTool`) | No |
| Custom field support | **Via Additional Fields** | Not supported |
| Test coverage | **24 tests (unit + integration)** | None |

---

## Installation

### In n8n (Recommended)

1. Go to **Settings** → **Community Nodes**
2. Select **Install a community node**
3. Enter: `n8n-nodes-twentycrm-pro`
4. Click **Install**

### Via npm (Self-hosted)

```bash
cd ~/.n8n/custom
npm install n8n-nodes-twentycrm-pro
```

Then restart n8n.

---

## Setup

1. In your Twenty CRM instance, go to **Settings** → **Playground**
2. Generate an API key
3. In n8n, create new credentials:
   - **Credential Type**: Twenty CRM API
   - **Server URL**: Your Twenty instance URL (e.g. `https://crm.yourdomain.com`)
   - **API Key**: Paste the key from step 2

The credential test will automatically verify connectivity.

---

## Resources & Operations

### Company

| Operation | Description |
|-----------|-------------|
| **Create** | Create a company with name, domain, address, LinkedIn, revenue |
| **Get** | Retrieve a company by ID |
| **Get Many** | List companies with filters, ordering, and pagination |
| **Update** | Update any company field |
| **Delete** | Soft-delete a company |

### Person (Contact)

| Operation | Description |
|-----------|-------------|
| **Create** | Create a contact with name, email, phone, job title, company link |
| **Get** | Retrieve a person by ID |
| **Get Many** | List people with filters on name, email, company |
| **Update** | Update any person field |
| **Delete** | Soft-delete a person |

### Opportunity (Deal)

| Operation | Description |
|-----------|-------------|
| **Create** | Create a deal with stage, amount, close date, company/contact links |
| **Get** | Retrieve an opportunity by ID |
| **Get Many** | List opportunities filtered by stage, company, date |
| **Update** | Update stage, amount, or any field |
| **Delete** | Soft-delete an opportunity |

### Note

| Operation | Description |
|-----------|-------------|
| **Create** | Create a note with title and body |
| **Get** | Retrieve a note by ID |
| **Get Many** | List all notes with pagination |
| **Update** | Update title or body |
| **Delete** | Soft-delete a note |

### Task

| Operation | Description |
|-----------|-------------|
| **Create** | Create a task with title, body, due date, status, assignee |
| **Get** | Retrieve a task by ID |
| **Get Many** | List tasks filtered by status |
| **Update** | Update status, assignee, due date, or any field |
| **Delete** | Soft-delete a task |

---

## Usage Examples

### Create a Company

```json
{
  "resource": "company",
  "operation": "create",
  "name": "Acme Corp",
  "additionalFields": {
    "domainUrl": "https://acme.com",
    "addressCity": "San Francisco",
    "addressState": "CA",
    "addressCountry": "US",
    "annualRevenueMicros": 5000000000,
    "currencyCode": "USD"
  }
}
```

### List People by Company

```json
{
  "resource": "person",
  "operation": "getAll",
  "returnAll": false,
  "limit": 20,
  "filters": {
    "companyId": "your-company-uuid"
  }
}
```

### Update Opportunity Stage

```json
{
  "resource": "opportunity",
  "operation": "update",
  "opportunityId": "your-opportunity-uuid",
  "updateFields": {
    "stage": "CLOSED_WON",
    "amountMicros": 25000000000,
    "currencyCode": "USD"
  }
}
```

### Search Companies by Name

```json
{
  "resource": "company",
  "operation": "getAll",
  "returnAll": false,
  "limit": 10,
  "filters": {
    "nameContains": "tech"
  },
  "orderBy": "createdAt[DescNullsLast]"
}
```

---

## Filtering

The node provides a user-friendly filter UI that translates to Twenty's powerful filter syntax:

| Filter Type | Example | Twenty Syntax |
|-------------|---------|---------------|
| Substring match | Name Contains: "tech" | `name[ilike]:"%tech%"` |
| Date range | Created After: 2024-01-01 | `createdAt[gte]:"2024-01-01"` |
| Exact match | Company ID: uuid | `companyId[eq]:"uuid"` |
| Stage filter | Stage: CLOSED_WON | `stage[eq]:"CLOSED_WON"` |

All filters are combined with AND logic. For advanced queries, use the Twenty API directly.

---

## Pagination

- **Return All = false**: Returns up to `limit` results (max 60 per page)
- **Return All = true**: Automatically paginates through all results using cursor-based pagination

The node handles cursor tokens internally — you never need to manage `starting_after` or `endCursor` manually.

---

## AI Agent Support

This node has `usableAsTool: true`, making it available as a tool in n8n's AI Agent workflows. An LLM can:

- Search for companies or contacts
- Create tasks and notes
- Update opportunity stages
- Query pipeline data

---

## Compatibility

| Requirement | Version |
|-------------|---------|
| n8n | >= 1.0.0 |
| Node.js | >= 18 |
| Twenty CRM | >= 0.30 (REST API v1) |

Works with both [Twenty Cloud](https://twenty.com) and self-hosted instances.

---

## Development

```bash
git clone https://github.com/pvass24/n8n-nodes-twentycrm-pro.git
cd n8n-nodes-twentycrm-pro
npm install
npm run build

# Run unit tests
npm test

# Run integration tests (requires .env.test with API credentials)
npm run test:integration
```

### Testing Setup

Create `.env.test` in the project root:

```env
TWENTY_API_URL=https://your-twenty-instance.com/rest
TWENTY_API_KEY=your-api-key-here
```

---

## Contributing

Contributions are welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feat/new-resource`)
3. Write tests for your changes
4. Ensure `npm test` and `npm run build` pass
5. Submit a Pull Request

### Adding a New Resource

1. Create `nodes/TwentyCrm/resources/{resource}/{resource}.description.ts`
2. Create `nodes/TwentyCrm/resources/{resource}/{resource}.handler.ts`
3. Import and register in `TwentyCrm.node.ts`
4. Add integration tests

---

## Roadmap

- [ ] Polling Trigger node (new companies, updated deals, etc.)
- [ ] Webhook Trigger (when Twenty adds webhook support)
- [ ] Custom Objects support
- [ ] Custom Fields dynamic loading
- [ ] Batch operations (create/update many)
- [ ] File attachments

---

## License

[MIT](LICENSE.md) — built by [Patrick Vassell](https://iampjv.co)

---

## Links

- [Twenty CRM](https://twenty.com) — The open-source CRM
- [Twenty REST API Docs](https://twenty.com/developers/rest-api)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Report Issues](https://github.com/pvass24/n8n-nodes-twentycrm-pro/issues)
