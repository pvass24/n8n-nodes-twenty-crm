import { describe, it, expect } from 'vitest';
import { buildFilterString, buildRequestUrl, extractDataFromResponse } from '../../nodes/TwentyCrm/GenericFunctions';
import type { ITwentyFilter } from '../../nodes/TwentyCrm/types';

describe('buildFilterString', () => {
	it('should return empty string for empty filters', () => {
		expect(buildFilterString([])).toBe('');
	});

	it('should build single filter', () => {
		const filters: ITwentyFilter[] = [{ field: 'name', comparator: 'eq', value: 'Acme' }];
		expect(buildFilterString(filters)).toBe('name[eq]:"Acme"');
	});

	it('should build multiple filters joined by comma', () => {
		const filters: ITwentyFilter[] = [
			{ field: 'name', comparator: 'eq', value: 'Acme' },
			{ field: 'createdAt', comparator: 'gte', value: '2024-01-01' },
		];
		expect(buildFilterString(filters)).toBe('name[eq]:"Acme",createdAt[gte]:"2024-01-01"');
	});

	it('should handle composite fields with dot notation', () => {
		const filters: ITwentyFilter[] = [
			{ field: 'name.firstName', comparator: 'ilike', value: '%john%' },
		];
		expect(buildFilterString(filters)).toBe('name.firstName[ilike]:"%john%"');
	});

	it('should handle numeric values without quotes', () => {
		const filters: ITwentyFilter[] = [{ field: 'position', comparator: 'gt', value: '5' }];
		expect(buildFilterString(filters)).toBe('position[gt]:5');
	});

	it('should handle boolean values without quotes', () => {
		const filters: ITwentyFilter[] = [{ field: 'isActive', comparator: 'eq', value: 'true' }];
		expect(buildFilterString(filters)).toBe('isActive[eq]:true');
	});

	it('should handle NULL with is comparator', () => {
		const filters: ITwentyFilter[] = [{ field: 'deletedAt', comparator: 'is', value: 'NULL' }];
		expect(buildFilterString(filters)).toBe('deletedAt[is]:NULL');
	});

	it('should handle in comparator with array value', () => {
		const filters: ITwentyFilter[] = [
			{ field: 'id', comparator: 'in', value: '["id-1","id-2"]' },
		];
		expect(buildFilterString(filters)).toBe('id[in]:["id-1","id-2"]');
	});
});

describe('buildRequestUrl', () => {
	it('should build base resource URL', () => {
		expect(buildRequestUrl('https://crm.example.com', 'companies')).toBe(
			'https://crm.example.com/rest/companies',
		);
	});

	it('should build URL with ID', () => {
		expect(buildRequestUrl('https://crm.example.com', 'companies', 'abc-123')).toBe(
			'https://crm.example.com/rest/companies/abc-123',
		);
	});

	it('should strip trailing slash from server URL', () => {
		expect(buildRequestUrl('https://crm.example.com/', 'people')).toBe(
			'https://crm.example.com/rest/people',
		);
	});
});

describe('extractDataFromResponse', () => {
	it('should extract array from list response', () => {
		const response = {
			data: { companies: [{ id: '1', name: 'Acme' }] },
			totalCount: 1,
			pageInfo: {
				startCursor: 'abc',
				endCursor: 'def',
				hasNextPage: false,
				hasPreviousPage: false,
			},
		};
		expect(extractDataFromResponse(response, 'companies')).toEqual([
			{ id: '1', name: 'Acme' },
		]);
	});

	it('should extract single record from create response', () => {
		const response = {
			data: { createCompany: { id: '1', name: 'Acme' } },
		};
		expect(extractDataFromResponse(response, 'createCompany')).toEqual({
			id: '1',
			name: 'Acme',
		});
	});

	it('should extract single record from update response', () => {
		const response = {
			data: { updateCompany: { id: '1', name: 'Updated' } },
		};
		expect(extractDataFromResponse(response, 'updateCompany')).toEqual({
			id: '1',
			name: 'Updated',
		});
	});

	it('should extract from delete response', () => {
		const response = {
			data: { deleteCompany: { id: '1' } },
		};
		expect(extractDataFromResponse(response, 'deleteCompany')).toEqual({ id: '1' });
	});

	it('should throw on empty data', () => {
		expect(() => extractDataFromResponse({}, 'companies')).toThrow();
	});

	it('should throw on error response', () => {
		const response = {
			error: 'Unauthorized',
			messages: ['Invalid token'],
			statusCode: 401,
		};
		expect(() => extractDataFromResponse(response, 'companies')).toThrow(/Invalid token/);
	});
});
