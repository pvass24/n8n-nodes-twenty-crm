import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleWorkspaceMemberOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') return workspaceMemberGet.call(this, i);
	if (operation === 'getAll') return workspaceMemberGetAll.call(this);
	throw new Error(`Unsupported operation: ${operation}`);
}

async function workspaceMemberGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const memberId = this.getNodeParameter('memberId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'workspaceMembers', undefined, undefined, memberId);
	const data = response.data as IDataObject;
	return (data.workspaceMember || response) as IDataObject;
}

async function workspaceMemberGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	return twentyApiRequestAllItems.call(this, 'workspaceMembers', {}, limit);
}
