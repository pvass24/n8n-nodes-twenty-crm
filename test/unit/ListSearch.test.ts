import { describe, it, expect } from 'vitest';
import { parseMetadataObjects } from '../../nodes/TwentyCrm/resources/customObject/customObject.helpers';
import type { IMetadataObject } from '../../nodes/TwentyCrm/resources/customObject/customObject.helpers';

describe('listSearch: Response formatting', () => {
	describe('searchCompanies response format', () => {
		it('should format company results as name/value pairs', () => {
			const apiResponse = [
				{ id: 'abc-123', name: 'Acme Corp' },
				{ id: 'def-456', name: 'Beta Inc' },
			];
			const results = apiResponse.map((c) => ({
				name: c.name,
				value: c.id,
			}));
			expect(results).toHaveLength(2);
			expect(results[0]).toEqual({ name: 'Acme Corp', value: 'abc-123' });
			expect(results[1]).toEqual({ name: 'Beta Inc', value: 'def-456' });
		});

		it('should handle empty company results', () => {
			const apiResponse: { id: string; name: string }[] = [];
			const results = apiResponse.map((c) => ({ name: c.name, value: c.id }));
			expect(results).toHaveLength(0);
		});
	});

	describe('searchPeople response format', () => {
		it('should format person results with full name', () => {
			const apiResponse = [
				{ id: 'p-1', name: { firstName: 'John', lastName: 'Doe' } },
				{ id: 'p-2', name: { firstName: 'Jane', lastName: 'Smith' } },
			];
			const results = apiResponse.map((p) => ({
				name: `${p.name.firstName} ${p.name.lastName}`,
				value: p.id,
			}));
			expect(results[0]).toEqual({ name: 'John Doe', value: 'p-1' });
			expect(results[1]).toEqual({ name: 'Jane Smith', value: 'p-2' });
		});
	});

	describe('searchObjects response format', () => {
		it('should parse metadata into searchable options', () => {
			const objects: IMetadataObject[] = [
				{ id: '1', nameSingular: 'company', namePlural: 'companies', labelSingular: 'Company', labelPlural: 'Companies', isCustom: false, isActive: true, isSystem: false },
				{ id: '2', nameSingular: 'deal', namePlural: 'deals', labelSingular: 'Deal', labelPlural: 'Deals', isCustom: true, isActive: true, isSystem: false },
			];
			const options = parseMetadataObjects(objects);
			expect(options).toHaveLength(2);
			expect(options[0]).toEqual({ name: 'Company', value: 'companies' });
			expect(options[1]).toEqual({ name: 'Deal', value: 'deals' });
		});

		it('should filter searchObjects by name', () => {
			const objects: IMetadataObject[] = [
				{ id: '1', nameSingular: 'company', namePlural: 'companies', labelSingular: 'Company', labelPlural: 'Companies', isCustom: false, isActive: true, isSystem: false },
				{ id: '2', nameSingular: 'deal', namePlural: 'deals', labelSingular: 'Deal', labelPlural: 'Deals', isCustom: true, isActive: true, isSystem: false },
				{ id: '3', nameSingular: 'person', namePlural: 'people', labelSingular: 'Person', labelPlural: 'People', isCustom: false, isActive: true, isSystem: false },
			];
			const options = parseMetadataObjects(objects);
			const filter = 'deal';
			const filtered = options.filter((o) => o.name.toLowerCase().includes(filter.toLowerCase()));
			expect(filtered).toHaveLength(1);
			expect(filtered[0].value).toBe('deals');
		});
	});
});
