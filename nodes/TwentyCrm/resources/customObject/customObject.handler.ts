import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleCustomObjectOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const objectTypeRlc = this.getNodeParameter('objectType', i) as IDataObject;
	const objectPlural = (objectTypeRlc.value || objectTypeRlc) as string;

	if (operation === 'create') return customObjectCreate.call(this, i, objectPlural);
	if (operation === 'get') return customObjectGet.call(this, i, objectPlural);
	if (operation === 'getAll') return customObjectGetAll.call(this, objectPlural);
	if (operation === 'update') return customObjectUpdate.call(this, i, objectPlural);
	if (operation === 'delete') return customObjectDelete.call(this, i, objectPlural);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function customObjectCreate(
	this: IExecuteFunctions,
	i: number,
	objectPlural: string,
): Promise<IDataObject> {
	const fieldsJson = this.getNodeParameter('fieldsJson', i) as string;
	const body = JSON.parse(fieldsJson) as IDataObject;

	const response = await twentyApiRequest.call(this, 'POST', objectPlural, body);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return data[key] as IDataObject;
}

async function customObjectGet(
	this: IExecuteFunctions,
	i: number,
	objectPlural: string,
): Promise<IDataObject> {
	const recordId = this.getNodeParameter('recordId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', objectPlural, undefined, undefined, recordId);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return data[key] as IDataObject;
}

async function customObjectGetAll(
	this: IExecuteFunctions,
	objectPlural: string,
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const filterRaw = this.getNodeParameter('filterRaw', 0, '') as string;
	const orderBy = this.getNodeParameter('orderBy', 0, '') as string;

	const query: IDataObject = {};
	if (filterRaw) query.filter = filterRaw;
	if (orderBy) query.order_by = orderBy;

	return twentyApiRequestAllItems.call(this, objectPlural, query, limit);
}

async function customObjectUpdate(
	this: IExecuteFunctions,
	i: number,
	objectPlural: string,
): Promise<IDataObject> {
	const recordId = this.getNodeParameter('recordId', i) as string;
	const fieldsJson = this.getNodeParameter('fieldsJson', i) as string;
	const body = JSON.parse(fieldsJson) as IDataObject;

	const response = await twentyApiRequest.call(this, 'PATCH', objectPlural, body, undefined, recordId);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return data[key] as IDataObject;
}

async function customObjectDelete(
	this: IExecuteFunctions,
	i: number,
	objectPlural: string,
): Promise<IDataObject> {
	const recordId = this.getNodeParameter('recordId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', objectPlural, undefined, undefined, recordId);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return (data[key] || { id: recordId, deleted: true }) as IDataObject;
}
