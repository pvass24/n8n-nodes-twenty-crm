import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleNoteTargetOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return noteTargetCreate.call(this, i);
	if (operation === 'delete') return noteTargetDelete.call(this, i);
	if (operation === 'getAll') return noteTargetGetAll.call(this);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function noteTargetCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', i) as string;
	const targetType = this.getNodeParameter('targetType', i) as string;
	const targetId = this.getNodeParameter('targetId', i) as string;

	const body: IDataObject = {
		noteId,
		[`target${targetType.charAt(0).toUpperCase() + targetType.slice(1)}Id`]: targetId,
	};

	const response = await twentyApiRequest.call(this, 'POST', 'noteTargets', body);
	const data = response.data as IDataObject;
	return (data.createNoteTarget || data.createNoteTargets) as IDataObject;
}

async function noteTargetDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const noteTargetId = this.getNodeParameter('noteTargetId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'noteTargets', undefined, undefined, noteTargetId);
	const data = response.data as IDataObject;
	return (data.deleteNoteTarget || { id: noteTargetId, deleted: true }) as IDataObject;
}

async function noteTargetGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	return twentyApiRequestAllItems.call(this, 'noteTargets', {}, limit);
}
