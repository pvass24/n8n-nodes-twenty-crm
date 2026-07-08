import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleTaskTargetOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return taskTargetCreate.call(this, i);
	if (operation === 'delete') return taskTargetDelete.call(this, i);
	if (operation === 'getAll') return taskTargetGetAll.call(this);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function taskTargetCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', i) as string;
	const targetType = this.getNodeParameter('targetType', i) as string;
	const targetId = this.getNodeParameter('targetId', i) as string;

	const body: IDataObject = {
		taskId,
		[`target${targetType.charAt(0).toUpperCase() + targetType.slice(1)}Id`]: targetId,
	};

	const response = await twentyApiRequest.call(this, 'POST', 'taskTargets', body);
	const data = response.data as IDataObject;
	return (data.createTaskTarget || data.createTaskTargets) as IDataObject;
}

async function taskTargetDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const taskTargetId = this.getNodeParameter('taskTargetId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'taskTargets', undefined, undefined, taskTargetId);
	const data = response.data as IDataObject;
	return (data.deleteTaskTarget || { id: taskTargetId, deleted: true }) as IDataObject;
}

async function taskTargetGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	return twentyApiRequestAllItems.call(this, 'taskTargets', {}, limit);
}
