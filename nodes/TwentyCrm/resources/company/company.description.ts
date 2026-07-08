import type { INodeProperties } from 'n8n-workflow';

const resource = 'company';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a company',
				action: 'Create a company',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a company',
				action: 'Delete a company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company by ID',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many companies',
				action: 'Get many companies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a company',
				action: 'Update a company',
			},
		],
		default: 'getAll',
	},
];

export const companyFields: INodeProperties[] = [
	// ----------------------------------
	//         company: shared
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'update', 'delete'] } },
		description: 'The ID of the company',
	},

	// ----------------------------------
	//         company: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'The company name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		options: [
			{
				displayName: 'Domain URL',
				name: 'domainUrl',
				type: 'string',
				default: '',
				description: 'The company website URL (used to fetch the company icon)',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'The company LinkedIn profile URL',
			},
			{
				displayName: 'Street Address 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Street Address 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'addressCity',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'addressState',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postal Code',
				name: 'addressPostcode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Annual Revenue (Micros)',
				name: 'annualRevenueMicros',
				type: 'number',
				default: 0,
				description: 'Revenue in micros (e.g. 1000000 = $1.00)',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'ISO 4217 currency code',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
				description: 'The workspace member who owns this company',
			},
		],
	},

	// ----------------------------------
	//         company: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The company name',
			},
			{
				displayName: 'Domain URL',
				name: 'domainUrl',
				type: 'string',
				default: '',
				description: 'The company website URL',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Street Address 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Street Address 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'addressCity',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'addressState',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postal Code',
				name: 'addressPostcode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Annual Revenue (Micros)',
				name: 'annualRevenueMicros',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         company: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 60 },
		displayOptions: { show: { resource: [resource], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Name Contains',
				name: 'nameContains',
				type: 'string',
				default: '',
				description: 'Filter by company name (case-insensitive substring match)',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only companies created after this date',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only companies updated after this date',
			},
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
			{ name: 'Name (A-Z)', value: 'name[AscNullsFirst]' },
			{ name: 'Name (Z-A)', value: 'name[DescNullsLast]' },
			{ name: 'Updated At (Newest First)', value: 'updatedAt[DescNullsLast]' },
		],
		description: 'How to order results',
	},
];
