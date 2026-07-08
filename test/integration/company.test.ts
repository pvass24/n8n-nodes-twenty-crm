import { describe, it, expect, afterAll } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env.test') });

const API_URL = process.env.TWENTY_API_URL!;
const API_KEY = process.env.TWENTY_API_KEY!;

const TEST_PREFIX = '__TEST_n8n_';
const createdIds: string[] = [];

async function apiRequest(method: string, path: string, body?: unknown) {
	const url = `${API_URL}/${path}`;
	const res = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	return res.json();
}

afterAll(async () => {
	for (const id of createdIds) {
		try {
			await apiRequest('DELETE', `companies/${id}`);
		} catch {
			// ignore cleanup errors
		}
	}
});

describe('Company API Integration', () => {
	it('should create a company', async () => {
		const res = await apiRequest('POST', 'companies', {
			name: `${TEST_PREFIX}IntegrationCo`,
			domainName: { primaryLinkUrl: 'https://test.example.com', primaryLinkLabel: '' },
			address: { addressCity: 'Miami', addressState: 'FL', addressCountry: 'US' },
		});

		expect(res.data.createCompany).toBeDefined();
		expect(res.data.createCompany.name).toBe(`${TEST_PREFIX}IntegrationCo`);
		expect(res.data.createCompany.id).toBeDefined();
		createdIds.push(res.data.createCompany.id);
	});

	it('should get a company by ID', async () => {
		const id = createdIds[0];
		const res = await apiRequest('GET', `companies/${id}`);

		expect(res.data.company.id).toBe(id);
		expect(res.data.company.name).toBe(`${TEST_PREFIX}IntegrationCo`);
	});

	it('should list companies with filter', async () => {
		const res = await apiRequest('GET', `companies?filter=name[ilike]:"%${TEST_PREFIX}%"&limit=10`);

		expect(res.data.companies.length).toBeGreaterThanOrEqual(1);
		expect(res.data.companies[0].name).toContain(TEST_PREFIX);
	});

	it('should list companies with pagination', async () => {
		const res = await apiRequest('GET', 'companies?limit=1');

		expect(res.pageInfo).toBeDefined();
		expect(res.pageInfo.hasNextPage).toBeDefined();
		expect(res.pageInfo.endCursor).toBeDefined();

		if (res.pageInfo.hasNextPage) {
			const page2 = await apiRequest(
				'GET',
				`companies?limit=1&starting_after=${res.pageInfo.endCursor}`,
			);
			expect(page2.data.companies.length).toBe(1);
			expect(page2.data.companies[0].id).not.toBe(res.data.companies[0].id);
		}
	});

	it('should update a company', async () => {
		const id = createdIds[0];
		const res = await apiRequest('PATCH', `companies/${id}`, {
			name: `${TEST_PREFIX}UpdatedCo`,
			address: { addressCity: 'Austin', addressState: 'TX' },
		});

		expect(res.data.updateCompany.name).toBe(`${TEST_PREFIX}UpdatedCo`);
	});

	it('should delete a company', async () => {
		const res = await apiRequest('POST', 'companies', {
			name: `${TEST_PREFIX}ToDelete`,
		});
		const deleteId = res.data.createCompany.id;

		const deleteRes = await apiRequest('DELETE', `companies/${deleteId}`);
		expect(deleteRes.data.deleteCompany.id).toBe(deleteId);

		// Remove from cleanup list since already deleted
		const idx = createdIds.indexOf(deleteId);
		if (idx > -1) createdIds.splice(idx, 1);
	});

	it('should handle error for non-existent company', async () => {
		const res = await apiRequest('GET', 'companies/00000000-0000-0000-0000-000000000000');
		expect(res.error || res.errors).toBeDefined();
	});
});
