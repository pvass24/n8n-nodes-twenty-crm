import type { INodeProperties } from 'n8n-workflow';

const resource = 'taskTarget';

export const taskTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Link a task to a record', action: 'Link a task to a record' },
			{ name: 'Delete', value: 'delete', description: 'Remove a task link', action: 'Remove a task link' },
			{ name: 'Get Many', value: 'getAll', description: 'Get all task links', action: 'Get task links' },
		],
		default: 'create',
	},
];

export const taskTargetFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
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
	},
	{
		displayName: 'Task Target ID',
		name: 'taskTargetId',
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
