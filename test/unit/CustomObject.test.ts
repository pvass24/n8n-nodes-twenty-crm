import { describe, it, expect } from 'vitest';
import { buildCustomObjectUrl, parseMetadataObjects } from '../../nodes/TwentyCrm/resources/customObject/customObject.helpers';

describe('parseMetadataObjects', () => {
	const mockMetadata = [
		{
			id: 'obj-1',
			nameSingular: 'company',
			namePlural: 'companies',
			labelSingular: 'Company',
			labelPlural: 'Companies',
			isCustom: false,
			isActive: true,
			isSystem: false,
		},
		{
			id: 'obj-2',
			nameSingular: 'myCustomObject',
			namePlural: 'myCustomObjects',
			labelSingular: 'My Custom Object',
			labelPlural: 'My Custom Objects',
			isCustom: true,
			isActive: true,
			isSystem: false,
		},
		{
			id: 'obj-3',
			nameSingular: 'workflowVersion',
			namePlural: 'workflowVersions',
			labelSingular: 'Workflow Version',
			labelPlural: 'Workflow Versions',
			isCustom: false,
			isActive: true,
			isSystem: true,
		},
	];

	it('should return all non-system active objects', () => {
		const result = parseMetadataObjects(mockMetadata);
		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('Company');
		expect(result[0].value).toBe('companies');
		expect(result[1].name).toBe('My Custom Object');
		expect(result[1].value).toBe('myCustomObjects');
	});

	it('should include custom objects', () => {
		const result = parseMetadataObjects(mockMetadata);
		const custom = result.find((r) => r.value === 'myCustomObjects');
		expect(custom).toBeDefined();
		expect(custom!.name).toBe('My Custom Object');
	});

	it('should exclude system objects by default', () => {
		const result = parseMetadataObjects(mockMetadata);
		const system = result.find((r) => r.value === 'workflowVersions');
		expect(system).toBeUndefined();
	});

	it('should include system objects when requested', () => {
		const result = parseMetadataObjects(mockMetadata, true);
		expect(result).toHaveLength(3);
	});
});

describe('buildCustomObjectUrl', () => {
	it('should build URL for list', () => {
		expect(buildCustomObjectUrl('https://crm.example.com', 'myCustomObjects')).toBe(
			'https://crm.example.com/rest/myCustomObjects',
		);
	});

	it('should build URL with ID', () => {
		expect(buildCustomObjectUrl('https://crm.example.com', 'myCustomObjects', 'abc-123')).toBe(
			'https://crm.example.com/rest/myCustomObjects/abc-123',
		);
	});
});
