import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleAttachmentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return attachmentCreate.call(this, i);
	if (operation === 'get') return attachmentGet.call(this, i);
	if (operation === 'getAll') return attachmentGetAll.call(this);
	if (operation === 'delete') return attachmentDelete.call(this, i);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function attachmentCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const name = this.getNodeParameter('name', i) as string;
	const fullPath = this.getNodeParameter('fullPath', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = { name, fullPath };
	if (additionalFields.fileCategory) body.fileCategory = additionalFields.fileCategory;
	if (additionalFields.companyId) body.companyId = additionalFields.companyId;
	if (additionalFields.personId) body.personId = additionalFields.personId;
	if (additionalFields.opportunityId) body.opportunityId = additionalFields.opportunityId;
	if (additionalFields.taskId) body.taskId = additionalFields.taskId;
	if (additionalFields.noteId) body.noteId = additionalFields.noteId;

	const response = await twentyApiRequest.call(this, 'POST', 'attachments', body);
	const data = response.data as IDataObject;
	return (data.createAttachment || data.createAttachments) as IDataObject;
}

async function attachmentGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const attachmentId = this.getNodeParameter('attachmentId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'attachments', undefined, undefined, attachmentId);
	const data = response.data as IDataObject;
	return (data.attachment || response) as IDataObject;
}

async function attachmentGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	return twentyApiRequestAllItems.call(this, 'attachments', {}, limit);
}

async function attachmentDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const attachmentId = this.getNodeParameter('attachmentId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'attachments', undefined, undefined, attachmentId);
	const data = response.data as IDataObject;
	return (data.deleteAttachment || { id: attachmentId, deleted: true }) as IDataObject;
}
