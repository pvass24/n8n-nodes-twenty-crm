import type { INodeProperties } from 'n8n-workflow';

const resource = 'task';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a task', action: 'Create a task' },
			{ name: 'Delete', value: 'delete', description: 'Delete a task', action: 'Delete a task' },
			{ name: 'Get', value: 'get', description: 'Get a task by ID', action: 'Get a task' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many tasks', action: 'Get many tasks' },
			{ name: 'Update', value: 'update', description: 'Update a task', action: 'Update a task' },
		],
		default: 'getAll',
	},
];

export const taskFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
	},

	// ----------------------------------
	//         task: create
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
			{ displayName: 'Body', name: 'body', type: 'string', default: '', typeOptions: { rows: 4 }, description: 'Task description' },
			{ displayName: 'Due Date', name: 'dueAt', type: 'dateTime', default: '' },
			{ displayName: 'Status', name: 'status', type: 'options', default: 'TODO', options: [{ name: 'To Do', value: 'TODO' }, { name: 'In Progress', value: 'IN_PROGRESS' }, { name: 'Done', value: 'DONE' }] },
			{ displayName: 'Assignee ID', name: 'assigneeId', type: 'string', default: '', description: 'Workspace member to assign' },
		],
	},

	// ----------------------------------
	//         task: update
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
			{ displayName: 'Due Date', name: 'dueAt', type: 'dateTime', default: '' },
			{ displayName: 'Status', name: 'status', type: 'options', default: 'TODO', options: [{ name: 'To Do', value: 'TODO' }, { name: 'In Progress', value: 'IN_PROGRESS' }, { name: 'Done', value: 'DONE' }] },
			{ displayName: 'Assignee ID', name: 'assigneeId', type: 'string', default: '' },
		],
	},

	// ----------------------------------
	//         task: getAll
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', default: '', options: [{ name: 'All', value: '' }, { name: 'To Do', value: 'TODO' }, { name: 'In Progress', value: 'IN_PROGRESS' }, { name: 'Done', value: 'DONE' }] },
			{ displayName: 'Created After', name: 'createdAfter', type: 'dateTime', default: '' },
		],
	},
];
