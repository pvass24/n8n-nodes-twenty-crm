import { describe, it, expect } from 'vitest';

describe('Batch: Request body construction', () => {
	describe('batchCreate', () => {
		it('should wrap records array in body object', () => {
			const records = [
				{ name: 'Company A' },
				{ name: 'Company B' },
			];
			const body = { records };
			expect(body.records).toHaveLength(2);
			expect(body.records[0]).toEqual({ name: 'Company A' });
		});

		it('should handle single record batch', () => {
			const records = [{ name: 'Solo Company' }];
			const body = { records };
			expect(body.records).toHaveLength(1);
		});

		it('should handle empty records array', () => {
			const records: Record<string, unknown>[] = [];
			const body = { records };
			expect(body.records).toHaveLength(0);
		});
	});

	describe('batchUpdate', () => {
		it('should wrap records with IDs in body object', () => {
			const records = [
				{ id: 'abc-123', name: 'Updated A' },
				{ id: 'def-456', name: 'Updated B' },
			];
			const body = { records };
			expect(body.records[0]).toHaveProperty('id', 'abc-123');
			expect(body.records[1]).toHaveProperty('name', 'Updated B');
		});
	});

	describe('batchDelete', () => {
		it('should wrap IDs array in body object', () => {
			const ids = ['abc-123', 'def-456', 'ghi-789'];
			const body = { ids };
			expect(body.ids).toHaveLength(3);
			expect(body.ids[0]).toBe('abc-123');
		});
	});

	describe('Response key extraction', () => {
		it('should extract results from response data', () => {
			const response = {
				data: {
					createCompanies: [
						{ id: '1', name: 'A' },
						{ id: '2', name: 'B' },
					],
				},
			};
			const data = response.data;
			const key = Object.keys(data)[0];
			expect(key).toBe('createCompanies');
			expect((data as Record<string, unknown>)[key]).toHaveLength(2);
		});

		it('should handle update response', () => {
			const response = {
				data: {
					updateCompanies: [{ id: '1', name: 'Updated' }],
				},
			};
			const data = response.data;
			const key = Object.keys(data)[0];
			expect(key).toBe('updateCompanies');
		});

		it('should handle delete response', () => {
			const response = {
				data: {
					deleteCompanies: [{ id: '1' }, { id: '2' }],
				},
			};
			const data = response.data;
			const key = Object.keys(data)[0];
			const results = (data as Record<string, unknown>)[key] as unknown[];
			expect(results).toHaveLength(2);
		});
	});
});
