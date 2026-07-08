import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems, buildFilterString } from '../../GenericFunctions';
import type { ITwentyFilter } from '../../types';

export async function handleCompanyOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		return companyCreate.call(this, i);
	} else if (operation === 'get') {
		return companyGet.call(this, i);
	} else if (operation === 'getAll') {
		return companyGetAll.call(this);
	} else if (operation === 'update') {
		return companyUpdate.call(this, i);
	} else if (operation === 'delete') {
		return companyDelete.call(this, i);
	}
	throw new Error(`Unsupported operation: ${operation}`);
}

async function companyCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const name = this.getNodeParameter('name', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = { name };

	if (additionalFields.domainUrl) {
		body.domainName = { primaryLinkUrl: additionalFields.domainUrl, primaryLinkLabel: '' };
	}
	if (additionalFields.linkedinUrl) {
		body.linkedinLink = { primaryLinkUrl: additionalFields.linkedinUrl, primaryLinkLabel: '' };
	}

	const addressFields = [
		'addressStreet1',
		'addressStreet2',
		'addressCity',
		'addressState',
		'addressPostcode',
		'addressCountry',
	];
	const address: IDataObject = {};
	let hasAddress = false;
	for (const field of addressFields) {
		if (additionalFields[field]) {
			address[field] = additionalFields[field];
			hasAddress = true;
		}
	}
	if (hasAddress) {
		body.address = address;
	}

	if (additionalFields.annualRevenueMicros || additionalFields.currencyCode) {
		body.annualRevenue = {
			amountMicros: additionalFields.annualRevenueMicros || null,
			currencyCode: additionalFields.currencyCode || null,
		};
	}

	if (additionalFields.accountOwnerId) {
		body.accountOwnerId = additionalFields.accountOwnerId;
	}

	const response = await twentyApiRequest.call(this, 'POST', 'companies', body);
	const data = response.data as IDataObject;
	return (data.createCompany || data.createCompanies) as IDataObject;
}

async function companyGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'companies', undefined, undefined, companyId);
	const data = response.data as IDataObject;
	return (data.company || response) as IDataObject;
}

async function companyGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const filters = this.getNodeParameter('filters', 0, {}) as IDataObject;
	const orderBy = this.getNodeParameter('orderBy', 0, '') as string;

	const query: IDataObject = {};

	const filterParts: ITwentyFilter[] = [];
	if (filters.nameContains) {
		filterParts.push({ field: 'name', comparator: 'ilike', value: `%${filters.nameContains}%` });
	}
	if (filters.createdAfter) {
		filterParts.push({ field: 'createdAt', comparator: 'gte', value: filters.createdAfter as string });
	}
	if (filters.updatedAfter) {
		filterParts.push({ field: 'updatedAt', comparator: 'gte', value: filters.updatedAfter as string });
	}

	const filterString = buildFilterString(filterParts);
	if (filterString) {
		query.filter = filterString;
	}
	if (orderBy) {
		query.order_by = orderBy;
	}

	return twentyApiRequestAllItems.call(this, 'companies', query, limit);
}

async function companyUpdate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.domainUrl) {
		body.domainName = { primaryLinkUrl: updateFields.domainUrl, primaryLinkLabel: '' };
	}
	if (updateFields.linkedinUrl) {
		body.linkedinLink = { primaryLinkUrl: updateFields.linkedinUrl, primaryLinkLabel: '' };
	}

	const addressFields = [
		'addressStreet1',
		'addressStreet2',
		'addressCity',
		'addressState',
		'addressPostcode',
		'addressCountry',
	];
	const address: IDataObject = {};
	let hasAddress = false;
	for (const field of addressFields) {
		if (updateFields[field]) {
			address[field] = updateFields[field];
			hasAddress = true;
		}
	}
	if (hasAddress) {
		body.address = address;
	}

	if (updateFields.annualRevenueMicros || updateFields.currencyCode) {
		body.annualRevenue = {
			amountMicros: updateFields.annualRevenueMicros || null,
			currencyCode: updateFields.currencyCode || null,
		};
	}

	if (updateFields.accountOwnerId) {
		body.accountOwnerId = updateFields.accountOwnerId;
	}

	const response = await twentyApiRequest.call(this, 'PATCH', 'companies', body, undefined, companyId);
	const data = response.data as IDataObject;
	return (data.updateCompany || response) as IDataObject;
}

async function companyDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'companies', undefined, undefined, companyId);
	const data = response.data as IDataObject;
	return (data.deleteCompany || { id: companyId, deleted: true }) as IDataObject;
}
