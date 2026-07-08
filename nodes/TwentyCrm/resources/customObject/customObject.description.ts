import type { INodeProperties } from 'n8n-workflow';

const resource = 'customObject';

export const customObjectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a record', action: 'Create a record' },
			{ name: 'Delete', value: 'delete', description: 'Delete a record', action: 'Delete a record' },
			{ name: 'Get', value: 'get', description: 'Get a record by ID', action: 'Get a record' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many records', action: 'Get many records' },
			{ name: 'Update', value: 'update', description: 'Update a record', action: 'Update a record' },
		],
		default: 'getAll',
	},
];

export const customObjectFields: INodeProperties[] = [
	{
		displayName: 'Object Type',
		name: 'objectType',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		displayOptions: { show: { resource: [resource] } },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchObjects',
					searchable: true,
				},
			},
			{
				displayName: 'By Plural Name',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. myCustomObjects',
			},
		],
		description: 'The object type to operate on (standard or custom)',
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
	},

	// ----------------------------------
	//         customObject: create/update
	// ----------------------------------
	{
		displayName: 'Fields (JSON)',
		name: 'fieldsJson',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Record fields as JSON object (e.g. {"name": "value", "customField": "data"})',
	},

	// ----------------------------------
	//         customObject: getAll
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
	{
		displayName: 'Filter (Twenty Syntax)',
		name: 'filterRaw',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		placeholder: 'name[ilike]:"%search%",createdAt[gte]:"2024-01-01"',
		description: 'Raw filter in Twenty syntax. See Twenty API docs for comparators.',
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		placeholder: 'createdAt[DescNullsLast]',
		description: 'Order by field with direction',
	},
];
