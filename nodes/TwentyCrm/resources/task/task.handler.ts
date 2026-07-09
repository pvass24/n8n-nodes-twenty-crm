import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems, buildFilterString } from '../../GenericFunctions';
import type { ITwentyFilter } from '../../types';

export async function handleTaskOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return taskCreate.call(this, i);
	if (operation === 'get') return taskGet.call(this, i);
	if (operation === 'getAll') return taskGetAll.call(this);
	if (operation === 'update') return taskUpdate.call(this, i);
	if (operation === 'delete') return taskDelete.call(this, i);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function taskCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const title = this.getNodeParameter('title', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = { title };
	if (additionalFields.body) body.bodyV2 = { blocknote: JSON.stringify([{ type: 'paragraph', content: [{ type: 'text', text: additionalFields.body }] }]) };
	if (additionalFields.dueAt) body.dueAt = additionalFields.dueAt;
	if (additionalFields.status) body.status = additionalFields.status;
	if (additionalFields.assigneeId) body.assigneeId = additionalFields.assigneeId;

	const response = await twentyApiRequest.call(this, 'POST', 'tasks', body);
	const data = response.data as IDataObject;
	return (data.createTask || data.createTasks) as IDataObject;
}

async function taskGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'tasks', undefined, undefined, taskId);
	const data = response.data as IDataObject;
	return (data.task || response) as IDataObject;
}

async function taskGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const filters = this.getNodeParameter('filters', 0, {}) as IDataObject;

	const query: IDataObject = {};
	const filterParts: ITwentyFilter[] = [];

	if (filters.status) filterParts.push({ field: 'status', comparator: 'eq', value: filters.status as string });
	if (filters.createdAfter) filterParts.push({ field: 'createdAt', comparator: 'gte', value: filters.createdAfter as string });

	const filterString = buildFilterString(filterParts);
	if (filterString) query.filter = filterString;

	return twentyApiRequestAllItems.call(this, 'tasks', query, limit);
}

async function taskUpdate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.title) body.title = updateFields.title;
	if (updateFields.body) body.bodyV2 = { blocknote: updateFields.body };
	if (updateFields.dueAt) body.dueAt = updateFields.dueAt;
	if (updateFields.status) body.status = updateFields.status;
	if (updateFields.assigneeId) body.assigneeId = updateFields.assigneeId;

	const response = await twentyApiRequest.call(this, 'PATCH', 'tasks', body, undefined, taskId);
	const data = response.data as IDataObject;
	return (data.updateTask || response) as IDataObject;
}

async function taskDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'tasks', undefined, undefined, taskId);
	const data = response.data as IDataObject;
	return (data.deleteTask || { id: taskId, deleted: true }) as IDataObject;
}
