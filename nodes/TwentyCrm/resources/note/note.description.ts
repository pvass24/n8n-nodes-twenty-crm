import type { INodeProperties } from 'n8n-workflow';

const resource = 'note';

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a note', action: 'Create a note' },
			{ name: 'Delete', value: 'delete', description: 'Delete a note', action: 'Delete a note' },
			{ name: 'Get', value: 'get', description: 'Get a note by ID', action: 'Get a note' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many notes', action: 'Get many notes' },
			{ name: 'Update', value: 'update', description: 'Update a note', action: 'Update a note' },
		],
		default: 'getAll',
	},
];

export const noteFields: INodeProperties[] = [
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
	},

	// ----------------------------------
	//         note: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		options: [
			{ displayName: 'Body', name: 'body', type: 'string', default: '', typeOptions: { rows: 4 }, description: 'Note content (plain text or markdown)' },
		],
	},

	// ----------------------------------
	//         note: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['update'] } },
		options: [
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Body', name: 'body', type: 'string', default: '', typeOptions: { rows: 4 } },
		],
	},

	// ----------------------------------
	//         note: getAll
	// ----------------------------------
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
