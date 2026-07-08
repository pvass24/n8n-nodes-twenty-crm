import type { INodeProperties } from 'n8n-workflow';

const resource = 'noteTarget';

export const noteTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Link a note to a record', action: 'Link a note to a record' },
			{ name: 'Delete', value: 'delete', description: 'Remove a note link', action: 'Remove a note link' },
			{ name: 'Get Many', value: 'getAll', description: 'Get all note links', action: 'Get note links' },
		],
		default: 'create',
	},
];

export const noteTargetFields: INodeProperties[] = [
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'The note to link',
	},
	{
		displayName: 'Target Type',
		name: 'targetType',
		type: 'options',
		required: true,
		default: 'company',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Opportunity', value: 'opportunity' },
			{ name: 'Person', value: 'person' },
		],
	},
	{
		displayName: 'Target ID',
		name: 'targetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'The ID of the record to link the note to',
	},
	{
		displayName: 'Note Target ID',
		name: 'noteTargetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['delete'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 60 },
		displayOptions: { show: { resource: [resource], operation: ['getAll'], returnAll: [false] } },
	},
];
