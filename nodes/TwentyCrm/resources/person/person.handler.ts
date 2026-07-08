import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequest, twentyApiRequestAllItems, buildFilterString } from '../../GenericFunctions';
import type { ITwentyFilter } from '../../types';

export async function handlePersonOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') return personCreate.call(this, i);
	if (operation === 'get') return personGet.call(this, i);
	if (operation === 'getAll') return personGetAll.call(this);
	if (operation === 'update') return personUpdate.call(this, i);
	if (operation === 'delete') return personDelete.call(this, i);
	if (operation === 'upsert') return personUpsert.call(this, i);
	throw new Error(`Unsupported operation: ${operation}`);
}

function buildPersonBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	if (fields.firstName || fields.lastName) {
		body.name = {
			firstName: fields.firstName || '',
			lastName: fields.lastName || '',
		};
	}

	if (fields.email) {
		body.emails = { primaryEmail: fields.email, additionalEmails: [] };
	}

	if (fields.phoneNumber) {
		body.phones = {
			primaryPhoneNumber: fields.phoneNumber,
			primaryPhoneCountryCode: '',
			primaryPhoneCallingCode: fields.phoneCallingCode || '+1',
			additionalPhones: [],
		};
	}

	if (fields.linkedinUrl) {
		body.linkedinLink = { primaryLinkUrl: fields.linkedinUrl, primaryLinkLabel: '' };
	}

	if (fields.jobTitle) body.jobTitle = fields.jobTitle;
	if (fields.avatarUrl) body.avatarUrl = fields.avatarUrl;
	if (fields.companyId) body.companyId = fields.companyId;

	return body;
}

async function personCreate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const firstName = this.getNodeParameter('firstName', i) as string;
	const lastName = this.getNodeParameter('lastName', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body = buildPersonBody({ firstName, lastName, ...additionalFields });

	const response = await twentyApiRequest.call(this, 'POST', 'people', body);
	const data = response.data as IDataObject;
	return (data.createPerson || data.createPeople) as IDataObject;
}

async function personGet(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', i) as string;
	const response = await twentyApiRequest.call(this, 'GET', 'people', undefined, undefined, personId);
	const data = response.data as IDataObject;
	return (data.person || response) as IDataObject;
}

async function personGetAll(this: IExecuteFunctions): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const filters = this.getNodeParameter('filters', 0, {}) as IDataObject;
	const orderBy = this.getNodeParameter('orderBy', 0, '') as string;

	const query: IDataObject = {};
	const filterParts: ITwentyFilter[] = [];

	if (filters.firstNameContains) {
		filterParts.push({ field: 'name.firstName', comparator: 'ilike', value: `%${filters.firstNameContains}%` });
	}
	if (filters.lastNameContains) {
		filterParts.push({ field: 'name.lastName', comparator: 'ilike', value: `%${filters.lastNameContains}%` });
	}
	if (filters.emailContains) {
		filterParts.push({ field: 'emails.primaryEmail', comparator: 'ilike', value: `%${filters.emailContains}%` });
	}
	if (filters.companyId) {
		filterParts.push({ field: 'companyId', comparator: 'eq', value: filters.companyId as string });
	}
	if (filters.createdAfter) {
		filterParts.push({ field: 'createdAt', comparator: 'gte', value: filters.createdAfter as string });
	}

	const filterString = buildFilterString(filterParts);
	if (filterString) query.filter = filterString;
	if (orderBy) query.order_by = orderBy;

	return twentyApiRequestAllItems.call(this, 'people', query, limit);
}

async function personUpdate(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body = buildPersonBody(updateFields);

	const response = await twentyApiRequest.call(this, 'PATCH', 'people', body, undefined, personId);
	const data = response.data as IDataObject;
	return (data.updatePerson || response) as IDataObject;
}

async function personDelete(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', i) as string;
	const response = await twentyApiRequest.call(this, 'DELETE', 'people', undefined, undefined, personId);
	const data = response.data as IDataObject;
	return (data.deletePerson || { id: personId, deleted: true }) as IDataObject;
}

async function personUpsert(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const matchField = this.getNodeParameter('matchField', i) as string;
	const matchValue = this.getNodeParameter('matchValue', i) as string;
	const firstName = this.getNodeParameter('firstName', i) as string;
	const lastName = this.getNodeParameter('lastName', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const filters: ITwentyFilter[] = [{ field: matchField, comparator: 'eq', value: matchValue }];
	const filterString = buildFilterString(filters);

	const searchResponse = await twentyApiRequest.call(this, 'GET', 'people', undefined, {
		filter: filterString,
		limit: 1,
	});

	const searchData = searchResponse.data as IDataObject;
	const existing = searchData.people as IDataObject[] | undefined;

	const body = buildPersonBody({ firstName, lastName, ...additionalFields });

	if (existing && existing.length > 0) {
		const existingId = (existing[0] as IDataObject).id as string;
		const response = await twentyApiRequest.call(this, 'PATCH', 'people', body, undefined, existingId);
		const data = response.data as IDataObject;
		return (data.updatePerson || response) as IDataObject;
	} else {
		const response = await twentyApiRequest.call(this, 'POST', 'people', body);
		const data = response.data as IDataObject;
		return (data.createPerson || data.createPeople) as IDataObject;
	}
}
