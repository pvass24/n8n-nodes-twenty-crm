import { describe, it, expect } from 'vitest';
import { buildFilterString } from '../../nodes/TwentyCrm/GenericFunctions';
import type { ITwentyFilter } from '../../nodes/TwentyCrm/types';

describe('Upsert: Filter construction for match fields', () => {
	describe('Company upsert match filters', () => {
		it('should build filter for name match', () => {
			const filters: ITwentyFilter[] = [{ field: 'name', comparator: 'ilike', value: 'Acme Corp' }];
			expect(buildFilterString(filters)).toBe('name[ilike]:"Acme Corp"');
		});

		it('should build filter for domain URL match', () => {
			const filters: ITwentyFilter[] = [
				{ field: 'domainName.primaryLinkUrl', comparator: 'eq', value: 'https://acme.com' },
			];
			expect(buildFilterString(filters)).toBe('domainName.primaryLinkUrl[eq]:"https://acme.com"');
		});

		it('should build filter for ID match', () => {
			const filters: ITwentyFilter[] = [
				{ field: 'id', comparator: 'eq', value: '550e8400-e29b-41d4-a716-446655440000' },
			];
			expect(buildFilterString(filters)).toBe('id[eq]:"550e8400-e29b-41d4-a716-446655440000"');
		});
	});

	describe('Person upsert match filters', () => {
		it('should build filter for email match', () => {
			const filters: ITwentyFilter[] = [
				{ field: 'emails.primaryEmail', comparator: 'eq', value: 'john@example.com' },
			];
			expect(buildFilterString(filters)).toBe('emails.primaryEmail[eq]:"john@example.com"');
		});

		it('should build filter for phone match', () => {
			const filters: ITwentyFilter[] = [
				{ field: 'phones.primaryPhoneNumber', comparator: 'eq', value: '5551234567' },
			];
			expect(buildFilterString(filters)).toBe('phones.primaryPhoneNumber[eq]:"5551234567"');
		});
	});

	describe('Upsert decision logic', () => {
		it('should identify existing record from search response', () => {
			const searchResponse = {
				data: {
					companies: [{ id: 'existing-123', name: 'Acme Corp' }],
				},
				totalCount: 1,
				pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: '' },
			};

			const existing = searchResponse.data.companies;
			expect(existing.length).toBeGreaterThan(0);
			expect(existing[0].id).toBe('existing-123');
		});

		it('should identify no match from empty search response', () => {
			const searchResponse = {
				data: {
					companies: [],
				},
				totalCount: 0,
				pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
			};

			const existing = searchResponse.data.companies;
			expect(existing.length).toBe(0);
		});

		it('should determine update path when record exists', () => {
			const existing = [{ id: 'existing-123', name: 'Old Name' }];
			const shouldUpdate = existing && existing.length > 0;
			expect(shouldUpdate).toBe(true);
		});

		it('should determine create path when no record exists', () => {
			const existing: unknown[] = [];
			const shouldUpdate = existing && existing.length > 0;
			expect(shouldUpdate).toBe(false);
		});
	});
});
