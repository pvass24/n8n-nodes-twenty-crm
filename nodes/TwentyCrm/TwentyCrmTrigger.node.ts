import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { buildFilterString, buildRequestUrl } from './GenericFunctions';
import type { ITwentyFilter } from './types';

export class TwentyCrmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM Trigger',
		name: 'twentyCrmTrigger',
		icon: 'file:twenty.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"] + " " + $parameter["resource"]}}',
		description: 'Starts the workflow when Twenty CRM records are created or updated',
		defaults: {
			name: 'Twenty CRM Trigger',
		},
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Company', value: 'companies' },
					{ name: 'Note', value: 'notes' },
					{ name: 'Opportunity', value: 'opportunities' },
					{ name: 'Person', value: 'people' },
					{ name: 'Task', value: 'tasks' },
				],
				default: 'companies',
				description: 'Which resource to watch for changes',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{ name: 'Record Created', value: 'created', description: 'Trigger when a new record is created' },
					{ name: 'Record Updated', value: 'updated', description: 'Trigger when an existing record is updated' },
					{ name: 'Record Created or Updated', value: 'createdOrUpdated', description: 'Trigger on any change' },
				],
				default: 'createdOrUpdated',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Additional Filter',
						name: 'additionalFilter',
						type: 'string',
						default: '',
						placeholder: 'stage[eq]:"CLOSED_WON"',
						description: 'Additional filter in Twenty format (e.g. stage[eq]:"CLOSED_WON")',
					},
				],
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const resource = this.getNodeParameter('resource') as string;
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const credentials = await this.getCredentials('twentyCrmApi');
		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');

		const lastPoll = this.getMode() === 'manual'
			? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
			: (await this.getWorkflowStaticData('node')).lastPoll as string || new Date(Date.now() - 60 * 60 * 1000).toISOString();

		const filters: ITwentyFilter[] = [];

		if (event === 'created') {
			filters.push({ field: 'createdAt', comparator: 'gte', value: lastPoll });
		} else if (event === 'updated') {
			filters.push({ field: 'updatedAt', comparator: 'gte', value: lastPoll });
		} else {
			filters.push({ field: 'updatedAt', comparator: 'gte', value: lastPoll });
		}

		let filterString = buildFilterString(filters);
		if (options.additionalFilter) {
			filterString = filterString ? `${filterString},${options.additionalFilter}` : options.additionalFilter as string;
		}

		const orderField = event === 'created' ? 'createdAt' : 'updatedAt';

		const allResults: IDataObject[] = [];
		let hasNextPage = true;
		let cursor: string | undefined;

		while (hasNextPage) {
			const qs: Record<string, string> = {
				filter: filterString,
				order_by: `${orderField}[AscNullsFirst]`,
				limit: '60',
			};
			if (cursor) qs.starting_after = cursor;

			const url = buildRequestUrl(serverUrl, resource);
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'twentyCrmApi',
				{
					method: 'GET',
					url,
					qs,
					json: true,
				},
			) as IDataObject;

			const data = response.data as IDataObject;
			const items = data[resource] as IDataObject[] | undefined;
			if (items && items.length > 0) {
				allResults.push(...items);
			}

			const pageInfo = response.pageInfo as IDataObject | undefined;
			if (pageInfo?.hasNextPage && pageInfo.endCursor) {
				cursor = pageInfo.endCursor as string;
			} else {
				hasNextPage = false;
			}
		}

		if (allResults.length === 0) {
			return null;
		}

		const staticData = await this.getWorkflowStaticData('node');
		staticData.lastPoll = new Date().toISOString();

		return [allResults.map((item) => ({ json: item }))];
	}
}
