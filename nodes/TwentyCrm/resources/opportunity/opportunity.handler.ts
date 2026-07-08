import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems, buildFilterString } from '../../GenericFunctions';
import type { ITwentyFilter } from '../../types';

export async function handleOpportunityOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return opportunityCreate.call(this, i);
	if (operation === 'get') return opportunityGet.call(this, i);
	if (operation === 'getAll') return opportunityGetAll.call(this);
	if (operation === 'update') return opportunityUpdate.call(this, i);
	if (operation === 'delete') return opportunityDelete.call(this, i);
	throw new Error(`Unsupported operation: ${operation}`);
}

function buildOpportunityBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	if (fields.name) body.name = fields.name;
	if (fields.stage) body.stage = fields.stage;
	if (fields.closeDate) body.closeDate = fields.closeDate;
	if (fields.companyId) body.companyId = fields.companyId;
	if (fields.pointOfContactId) body.pointOfContactId = fields.pointOfContactId;

	if (fields.amountMicros || fields.currencyCode) {
		body.amount = {
			amountMicros: fields.amountMicros || null,
			currencyCode: fields.currencyCode || 'USD',
		};
	}

	return body;
}

async function opportunityCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const name = this.getNodeParameter('name', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body = buildOpportunityBody({ name, ...additionalFields });

	const response = await twentyApiRequest.call(this, 'POST', 'opportunities', body);
	const data = response.data as IDataObject;
	return (data.createOpportunity || data.createOpportunities) as IDataObject;
}

async function opportunityGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = this.getNodeParameter('opportunityId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'opportunities', undefined, undefined, id);
	const data = response.data as IDataObject;
	return (data.opportunity || response) as IDataObject;
}

async function opportunityGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const filters = this.getNodeParameter('filters', 0, {}) as IDataObject;

	const query: IDataObject = {};
	const filterParts: ITwentyFilter[] = [];

	if (filters.stage) filterParts.push({ field: 'stage', comparator: 'eq', value: filters.stage as string });
	if (filters.companyId) filterParts.push({ field: 'companyId', comparator: 'eq', value: filters.companyId as string });
	if (filters.createdAfter) filterParts.push({ field: 'createdAt', comparator: 'gte', value: filters.createdAfter as string });

	const filterString = buildFilterString(filterParts);
	if (filterString) query.filter = filterString;

	return twentyApiRequestAllItems.call(this, 'opportunities', query, limit);
}

async function opportunityUpdate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = this.getNodeParameter('opportunityId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body = buildOpportunityBody(updateFields);

	const response = await twentyApiRequest.call(this, 'PATCH', 'opportunities', body, undefined, id);
	const data = response.data as IDataObject;
	return (data.updateOpportunity || response) as IDataObject;
}

async function opportunityDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = this.getNodeParameter('opportunityId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'opportunities', undefined, undefined, id);
	const data = response.data as IDataObject;
	return (data.deleteOpportunity || { id, deleted: true }) as IDataObject;
}
