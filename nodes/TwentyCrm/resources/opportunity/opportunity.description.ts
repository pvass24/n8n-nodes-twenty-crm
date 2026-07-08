import type { INodeProperties } from 'n8n-workflow';

const resource = 'opportunity';

export const opportunityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an opportunity', action: 'Create an opportunity' },
			{ name: 'Delete', value: 'delete', description: 'Delete an opportunity', action: 'Delete an opportunity' },
			{ name: 'Get', value: 'get', description: 'Get an opportunity by ID', action: 'Get an opportunity' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many opportunities', action: 'Get many opportunities' },
			{ name: 'Update', value: 'update', description: 'Update an opportunity', action: 'Update an opportunity' },
		],
		default: 'getAll',
	},
];

export const opportunityFields: INodeProperties[] = [
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
	},

	// ----------------------------------
	//         opportunity: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'The opportunity/deal name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		options: [
			{ displayName: 'Stage', name: 'stage', type: 'string', default: '', description: 'Pipeline stage (e.g. LEAD, MEETING, PROPOSAL, CLOSED_WON, CLOSED_LOST)' },
			{ displayName: 'Close Date', name: 'closeDate', type: 'dateTime', default: '' },
			{ displayName: 'Amount (Micros)', name: 'amountMicros', type: 'number', default: 0, description: 'Deal value in micros (1000000 = $1.00)' },
			{ displayName: 'Currency Code', name: 'currencyCode', type: 'string', default: 'USD' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '' },
			{ displayName: 'Point of Contact ID', name: 'pointOfContactId', type: 'string', default: '', description: 'Person linked to this opportunity' },
		],
	},

	// ----------------------------------
	//         opportunity: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Stage', name: 'stage', type: 'string', default: '' },
			{ displayName: 'Close Date', name: 'closeDate', type: 'dateTime', default: '' },
			{ displayName: 'Amount (Micros)', name: 'amountMicros', type: 'number', default: 0 },
			{ displayName: 'Currency Code', name: 'currencyCode', type: 'string', default: 'USD' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '' },
			{ displayName: 'Point of Contact ID', name: 'pointOfContactId', type: 'string', default: '' },
		],
	},

	// ----------------------------------
	//         opportunity: getAll
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
			{ displayName: 'Stage', name: 'stage', type: 'string', default: '' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '' },
			{ displayName: 'Created After', name: 'createdAfter', type: 'dateTime', default: '' },
		],
	},
];
