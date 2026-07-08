import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest } from '../GenericFunctions';

export async function batchCreate(
	this: IExecuteFunctions,
	resource: string,
	records: IDataObject[],
): Promise<IDataObject[]> {
	const body: IDataObject = { records };
	const response = await twentyApiRequest.call(this, 'POST', `batch/${resource}`, body);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return (data[key] || []) as IDataObject[];
}

export async function batchUpdate(
	this: IExecuteFunctions,
	resource: string,
	records: IDataObject[],
): Promise<IDataObject[]> {
	const body: IDataObject = { records };
	const response = await twentyApiRequest.call(this, 'PATCH', `batch/${resource}`, body);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return (data[key] || []) as IDataObject[];
}

export async function batchDelete(
	this: IExecuteFunctions,
	resource: string,
	ids: string[],
): Promise<IDataObject[]> {
	const body: IDataObject = { ids };
	const response = await twentyApiRequest.call(this, 'DELETE', `batch/${resource}`, body);
	const data = response.data as IDataObject;
	const key = Object.keys(data)[0];
	return (data[key] || []) as IDataObject[];
}
