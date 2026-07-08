import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class TwentyCrmApi implements ICredentialType {
	name = 'twentyCrmApi';

	displayName = 'Twenty CRM API';

	icon: Icon = 'file:../icons/twenty.svg';

	documentationUrl = 'https://twenty.com/developers/rest-api';

	properties: INodeProperties[] = [
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://api.twenty.com',
			placeholder: 'https://crm.yourdomain.com',
			description: 'The base URL of your Twenty CRM instance (no trailing slash)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Generate in Settings → Playground in your Twenty workspace',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.serverUrl}}',
			url: '/rest/companies',
			method: 'GET',
			qs: { limit: '1' },
		},
	};
}
