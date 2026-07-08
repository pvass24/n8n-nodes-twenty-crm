import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleNoteOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return noteCreate.call(this, i);
	if (operation === 'get') return noteGet.call(this, i);
	if (operation === 'getAll') return noteGetAll.call(this);
	if (operation === 'update') return noteUpdate.call(this, i);
	if (operation === 'delete') return noteDelete.call(this, i);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function noteCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const title = this.getNodeParameter('title', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = { title };
	if (additionalFields.body) body.body = additionalFields.body;

	const response = await twentyApiRequest.call(this, 'POST', 'notes', body);
	const data = response.data as IDataObject;
	return (data.createNote || data.createNotes) as IDataObject;
}

async function noteGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'notes', undefined, undefined, noteId);
	const data = response.data as IDataObject;
	return (data.note || response) as IDataObject;
}

async function noteGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	return twentyApiRequestAllItems.call(this, 'notes', {}, limit);
}

async function noteUpdate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.title) body.title = updateFields.title;
	if (updateFields.body) body.body = updateFields.body;

	const response = await twentyApiRequest.call(this, 'PATCH', 'notes', body, undefined, noteId);
	const data = response.data as IDataObject;
	return (data.updateNote || response) as IDataObject;
}

async function noteDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'notes', undefined, undefined, noteId);
	const data = response.data as IDataObject;
	return (data.deleteNote || { id: noteId, deleted: true }) as IDataObject;
}
