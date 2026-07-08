import type { INodeProperties } from 'n8n-workflow';

const resource = 'attachment';

export const attachmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an attachment record', action: 'Create an attachment' },
			{ name: 'Delete', value: 'delete', description: 'Delete an attachment', action: 'Delete an attachment' },
			{ name: 'Get', value: 'get', description: 'Get an attachment by ID', action: 'Get an attachment' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many attachments', action: 'Get many attachments' },
		],
		default: 'getAll',
	},
];

export const attachmentFields: INodeProperties[] = [
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'delete'] } },
	},

	// ----------------------------------
	//         attachment: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Attachment filename',
	},
	{
		displayName: 'Full Path',
		name: 'fullPath',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Full file path or URL of the attachment',
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
				displayName: 'File Category',
				name: 'fileCategory',
				type: 'options',
				default: 'OTHER',
				options: [
					{ name: 'Archive', value: 'ARCHIVE' },
					{ name: 'Audio', value: 'AUDIO' },
					{ name: 'Image', value: 'IMAGE' },
					{ name: 'Other', value: 'OTHER' },
					{ name: 'Presentation', value: 'PRESENTATION' },
					{ name: 'Spreadsheet', value: 'SPREADSHEET' },
					{ name: 'Text Document', value: 'TEXT_DOCUMENT' },
					{ name: 'Video', value: 'VIDEO' },
				],
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'Link attachment to a company',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'Link attachment to a person',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'Link attachment to an opportunity',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				description: 'Link attachment to a task',
			},
			{
				displayName: 'Note ID',
				name: 'noteId',
				type: 'string',
				default: '',
				description: 'Link attachment to a note',
			},
		],
	},

	// ----------------------------------
	//         attachment: getAll
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
