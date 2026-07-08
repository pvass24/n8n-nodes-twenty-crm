import type { INodeProperties } from 'n8n-workflow';

const resource = 'person';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a person', action: 'Create a person' },
			{ name: 'Delete', value: 'delete', description: 'Delete a person', action: 'Delete a person' },
			{ name: 'Get', value: 'get', description: 'Get a person by ID', action: 'Get a person' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many people', action: 'Get many people' },
			{ name: 'Update', value: 'update', description: 'Update a person', action: 'Update a person' },
		],
		default: 'getAll',
	},
];

export const personFields: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
	},

	// ----------------------------------
	//         person: create
	// ----------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
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
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@example.com' },
			{ displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
			{ displayName: 'Phone Country Code', name: 'phoneCallingCode', type: 'string', default: '+1' },
			{ displayName: 'Job Title', name: 'jobTitle', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
			{ displayName: 'Avatar URL', name: 'avatarUrl', type: 'string', default: '' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '', description: 'Link this person to a company' },
		],
	},

	// ----------------------------------
	//         person: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['update'] } },
		options: [
			{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
			{ displayName: 'Phone Country Code', name: 'phoneCallingCode', type: 'string', default: '+1' },
			{ displayName: 'Job Title', name: 'jobTitle', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
			{ displayName: 'Avatar URL', name: 'avatarUrl', type: 'string', default: '' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '' },
		],
	},

	// ----------------------------------
	//         person: getAll
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
			{ displayName: 'First Name Contains', name: 'firstNameContains', type: 'string', default: '' },
			{ displayName: 'Last Name Contains', name: 'lastNameContains', type: 'string', default: '' },
			{ displayName: 'Email Contains', name: 'emailContains', type: 'string', default: '' },
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '', description: 'Filter by linked company' },
			{ displayName: 'Created After', name: 'createdAfter', type: 'dateTime', default: '' },
		],
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'options',
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{ name: 'None', value: '' },
			{ name: 'Created At (Newest First)', value: 'createdAt[DescNullsLast]' },
			{ name: 'Created At (Oldest First)', value: 'createdAt[AscNullsFirst]' },
			{ name: 'Last Name (A-Z)', value: 'name.lastName[AscNullsFirst]' },
		],
	},
];
