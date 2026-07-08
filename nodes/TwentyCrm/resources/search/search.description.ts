import type { INodeProperties } from 'n8n-workflow';

const resource = 'search';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Query', value: 'query', description: 'Search any resource with a raw filter query', action: 'Search records' },
		],
		default: 'query',
	},
];

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Resource to Search',
		name: 'searchResource',
		type: 'options',
		required: true,
		default: 'companies',
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Companies', value: 'companies' },
			{ name: 'People', value: 'people' },
			{ name: 'Opportunities', value: 'opportunities' },
			{ name: 'Notes', value: 'notes' },
			{ name: 'Tasks', value: 'tasks' },
		],
		description: 'Which resource to search',
	},
	{
		displayName: 'Filter Query',
		name: 'filterQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource] } },
		placeholder: 'name[ilike]:"%acme%",createdAt[gte]:"2024-01-01"',
		description: 'Filter in Twenty syntax. Supports: eq, neq, in, is, gt, gte, lt, lte, startsWith, like, ilike, containsAny. Use or(...) / and(...) for logic.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: [resource] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 60 },
		displayOptions: { show: { resource: [resource], returnAll: [false] } },
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: [resource] } },
		placeholder: 'createdAt[DescNullsLast]',
	},
];
