import { describe, it, expect, afterAll } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env.test') });

const API_URL = process.env.TWENTY_API_URL!;
const API_KEY = process.env.TWENTY_API_KEY!;

const TEST_PREFIX = '__TEST_v2v3_';
const createdIds: { resource: string; id: string }[] = [];

async function apiRequest(method: string, path: string, body?: unknown, qs?: Record<string, string>) {
	let url = `${API_URL}/${path}`;
	if (qs) {
		const params = new URLSearchParams(qs);
		url += `?${params.toString()}`;
	}
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
	for (const { resource, id } of createdIds) {
		try {
			await apiRequest('DELETE', `${resource}/${id}`);
		} catch {
			// ignore cleanup errors
		}
	}
});

describe('Upsert: Company', () => {
	let companyId: string;

	it('should create a company when no match exists (upsert create path)', async () => {
		const uniqueName = `${TEST_PREFIX}UpsertCo_${Date.now()}`;
		const res = await apiRequest('POST', 'companies', { name: uniqueName });
		expect(res.data.createCompany).toBeDefined();
		companyId = res.data.createCompany.id;
		createdIds.push({ resource: 'companies', id: companyId });
	});

	it('should find existing company by name filter', async () => {
		const res = await apiRequest('GET', 'companies', undefined, {
			filter: `name[ilike]:"%${TEST_PREFIX}UpsertCo%"`,
			limit: '1',
		});
		expect(res.data.companies.length).toBeGreaterThanOrEqual(1);
		expect(res.data.companies[0].id).toBe(companyId);
	});

	it('should update when match found (upsert update path)', async () => {
		const res = await apiRequest('PATCH', `companies/${companyId}`, {
			name: `${TEST_PREFIX}UpsertCo_Updated`,
		});
		expect(res.data.updateCompany.name).toContain('Updated');
	});
});

describe('Upsert: Person by email', () => {
	let personId: string;
	const testEmail = `${TEST_PREFIX}test_${Date.now()}@example.com`;

	it('should create person (upsert create path)', async () => {
		const res = await apiRequest('POST', 'people', {
			name: { firstName: 'Test', lastName: 'Upsert' },
			emails: { primaryEmail: testEmail, additionalEmails: [] },
		});
		expect(res.data.createPerson).toBeDefined();
		personId = res.data.createPerson.id;
		createdIds.push({ resource: 'people', id: personId });
	});

	it('should find person by email filter', async () => {
		const res = await apiRequest('GET', 'people', undefined, {
			filter: `emails.primaryEmail[ilike]:"%${TEST_PREFIX}test_%"`,
			limit: '1',
		});
		expect(res.data.people.length).toBeGreaterThanOrEqual(1);
	});
});

describe('Search: Raw filter query', () => {
	it('should search companies with ilike filter', async () => {
		const res = await apiRequest('GET', 'companies', undefined, {
			filter: `name[ilike]:"%${TEST_PREFIX}%"`,
			limit: '10',
		});
		expect(res.data.companies).toBeDefined();
		expect(Array.isArray(res.data.companies)).toBe(true);
	});

	it('should search with ordering', async () => {
		const res = await apiRequest('GET', 'companies', undefined, {
			order_by: 'createdAt[DescNullsLast]',
			limit: '2',
		});
		expect(res.data.companies.length).toBeLessThanOrEqual(2);
		if (res.data.companies.length === 2) {
			const first = new Date(res.data.companies[0].createdAt).getTime();
			const second = new Date(res.data.companies[1].createdAt).getTime();
			expect(first).toBeGreaterThanOrEqual(second);
		}
	});
});

describe('Workspace Members', () => {
	it('should list workspace members', async () => {
		const res = await apiRequest('GET', 'workspaceMembers', undefined, { limit: '10' });
		expect(res.data.workspaceMembers).toBeDefined();
		expect(res.data.workspaceMembers.length).toBeGreaterThanOrEqual(1);
		expect(res.data.workspaceMembers[0].name).toBeDefined();
		expect(res.data.workspaceMembers[0].name.firstName).toBeDefined();
	});

	it('should get workspace member by ID', async () => {
		const list = await apiRequest('GET', 'workspaceMembers', undefined, { limit: '1' });
		const memberId = list.data.workspaceMembers[0].id;
		const res = await apiRequest('GET', `workspaceMembers/${memberId}`);
		expect(res.data.workspaceMember.id).toBe(memberId);
	});
});

describe('Note Targets', () => {
	let noteId: string;
	let noteTargetId: string;

	it('should create a note first', async () => {
		const res = await apiRequest('POST', 'notes', { title: `${TEST_PREFIX}LinkedNote` });
		expect(res.data.createNote).toBeDefined();
		noteId = res.data.createNote.id;
		createdIds.push({ resource: 'notes', id: noteId });
	});

	it('should create a note target (link note to company)', async () => {
		const companies = await apiRequest('GET', 'companies', undefined, { limit: '1' });
		const companyId = companies.data.companies[0].id;

		const res = await apiRequest('POST', 'noteTargets', {
			noteId,
			targetCompanyId: companyId,
		});
		expect(res.data.createNoteTarget).toBeDefined();
		noteTargetId = res.data.createNoteTarget.id;
		createdIds.push({ resource: 'noteTargets', id: noteTargetId });
	});

	it('should list note targets', async () => {
		const res = await apiRequest('GET', 'noteTargets', undefined, { limit: '10' });
		expect(res.data.noteTargets).toBeDefined();
		expect(Array.isArray(res.data.noteTargets)).toBe(true);
	});
});

describe('Task Targets', () => {
	let taskId: string;
	let taskTargetId: string;

	it('should create a task first', async () => {
		const res = await apiRequest('POST', 'tasks', { title: `${TEST_PREFIX}LinkedTask` });
		expect(res.data.createTask).toBeDefined();
		taskId = res.data.createTask.id;
		createdIds.push({ resource: 'tasks', id: taskId });
	});

	it('should create a task target (link task to company)', async () => {
		const companies = await apiRequest('GET', 'companies', undefined, { limit: '1' });
		const companyId = companies.data.companies[0].id;

		const res = await apiRequest('POST', 'taskTargets', {
			taskId,
			targetCompanyId: companyId,
		});
		expect(res.data.createTaskTarget).toBeDefined();
		taskTargetId = res.data.createTaskTarget.id;
		createdIds.push({ resource: 'taskTargets', id: taskTargetId });
	});
});

describe('Metadata: Objects listing', () => {
	it('should list all available objects from metadata API', async () => {
		const res = await apiRequest('GET', 'metadata/objects');
		expect(res.data).toBeDefined();
		expect(Array.isArray(res.data)).toBe(true);
		expect(res.data.length).toBeGreaterThan(0);

		const company = res.data.find((o: { namePlural: string }) => o.namePlural === 'companies');
		expect(company).toBeDefined();
		expect(company.labelSingular).toBe('Company');
		expect(company.isActive).toBe(true);
	});
});
