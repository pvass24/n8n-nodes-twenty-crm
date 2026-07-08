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
import { searchCompanies, searchPeople, searchOpportunities, searchObjects } from './shared/listSearch';
import { customObjectOperations, customObjectFields } from './resources/customObject/customObject.description';
import { handleCustomObjectOperation } from './resources/customObject/customObject.handler';
import { searchOperations, searchFields } from './resources/search/search.description';
import { handleSearchOperation } from './resources/search/search.handler';
import { workspaceMemberOperations, workspaceMemberFields } from './resources/workspaceMember/workspaceMember.description';
import { handleWorkspaceMemberOperation } from './resources/workspaceMember/workspaceMember.handler';
import { noteTargetOperations, noteTargetFields } from './resources/noteTarget/noteTarget.description';
import { handleNoteTargetOperation } from './resources/noteTarget/noteTarget.handler';
import { taskTargetOperations, taskTargetFields } from './resources/taskTarget/taskTarget.description';
import { handleTaskTargetOperation } from './resources/taskTarget/taskTarget.handler';
import { attachmentOperations, attachmentFields } from './resources/attachment/attachment.description';
import { handleAttachmentOperation } from './resources/attachment/attachment.handler';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM',
		name: 'twentyCrm',
		icon: 'file:twenty.svg',
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
					{ name: 'Attachment', value: 'attachment' },
					{ name: 'Company', value: 'company' },
					{ name: 'Custom Object', value: 'customObject' },
					{ name: 'Note', value: 'note' },
					{ name: 'Note Target', value: 'noteTarget' },
					{ name: 'Opportunity', value: 'opportunity' },
					{ name: 'Person', value: 'person' },
					{ name: 'Search', value: 'search' },
					{ name: 'Task', value: 'task' },
					{ name: 'Task Target', value: 'taskTarget' },
					{ name: 'Workspace Member', value: 'workspaceMember' },
				],
				default: 'company',
			},
			...attachmentOperations,
			...attachmentFields,
			...companyOperations,
			...companyFields,
			...customObjectOperations,
			...customObjectFields,
			...noteOperations,
			...noteFields,
			...noteTargetOperations,
			...noteTargetFields,
			...opportunityOperations,
			...opportunityFields,
			...personOperations,
			...personFields,
			...searchOperations,
			...searchFields,
			...taskOperations,
			...taskFields,
			...taskTargetOperations,
			...taskTargetFields,
			...workspaceMemberOperations,
			...workspaceMemberFields,
		],
	};

	methods = {
		listSearch: {
			searchCompanies,
			searchPeople,
			searchOpportunities,
			searchObjects,
		},
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
					case 'attachment':
						result = await handleAttachmentOperation.call(this, operation, i);
						break;
					case 'company':
						result = await handleCompanyOperation.call(this, operation, i);
						break;
					case 'customObject':
						result = await handleCustomObjectOperation.call(this, operation, i);
						break;
					case 'note':
						result = await handleNoteOperation.call(this, operation, i);
						break;
					case 'noteTarget':
						result = await handleNoteTargetOperation.call(this, operation, i);
						break;
					case 'opportunity':
						result = await handleOpportunityOperation.call(this, operation, i);
						break;
					case 'person':
						result = await handlePersonOperation.call(this, operation, i);
						break;
					case 'search':
						result = await handleSearchOperation.call(this, operation, i);
						break;
					case 'task':
						result = await handleTaskOperation.call(this, operation, i);
						break;
					case 'taskTarget':
						result = await handleTaskTargetOperation.call(this, operation, i);
						break;
					case 'workspaceMember':
						result = await handleWorkspaceMemberOperation.call(this, operation, i);
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
