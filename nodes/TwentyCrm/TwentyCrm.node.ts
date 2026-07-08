import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { companyOperations, companyFields } from './resources/company/company.description';
import { handleCompanyOperation } from './resources/company/company.handler';
import { personOperations, personFields } from './resources/person/person.description';
import { handlePersonOperation } from './resources/person/person.handler';
import { opportunityOperations, opportunityFields } from './resources/opportunity/opportunity.description';
import { handleOpportunityOperation } from './resources/opportunity/opportunity.handler';
import { noteOperations, noteFields } from './resources/note/note.description';
import { handleNoteOperation } from './resources/note/note.handler';
import { taskOperations, taskFields } from './resources/task/task.description';
import { handleTaskOperation } from './resources/task/task.handler';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM',
		name: 'twentyCrm',
		icon: 'file:../../icons/twenty.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Twenty CRM API',
		defaults: {
			name: 'Twenty CRM',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Note', value: 'note' },
					{ name: 'Opportunity', value: 'opportunity' },
					{ name: 'Person', value: 'person' },
					{ name: 'Task', value: 'task' },
				],
				default: 'company',
			},
			...companyOperations,
			...companyFields,
			...personOperations,
			...personFields,
			...noteOperations,
			...noteFields,
			...opportunityOperations,
			...opportunityFields,
			...taskOperations,
			...taskFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: unknown;

				switch (resource) {
					case 'company':
						result = await handleCompanyOperation.call(this, operation, i);
						break;
					case 'person':
						result = await handlePersonOperation.call(this, operation, i);
						break;
					case 'opportunity':
						result = await handleOpportunityOperation.call(this, operation, i);
						break;
					case 'note':
						result = await handleNoteOperation.call(this, operation, i);
						break;
					case 'task':
						result = await handleTaskOperation.call(this, operation, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				if (Array.isArray(result)) {
					for (const item of result) {
						returnData.push({ json: item });
					}
				} else {
					returnData.push({ json: result as IDataObject });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
