import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchResult,
} from 'n8n-workflow';
import { twentyApiRequest } from '../GenericFunctions';

export async function searchCompanies(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const query: IDataObject = { limit: 20 };
	if (filter) {
		query.filter = `name[ilike]:"%${filter}%"`;
	}
	const response = await twentyApiRequest.call(this, 'GET', 'companies', undefined, query);
	const data = response.data as IDataObject;
	const companies = (data.companies || []) as IDataObject[];

	return {
		results: companies.map((c) => ({
			name: c.name as string,
			value: c.id as string,
		})),
	};
}

export async function searchPeople(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const query: IDataObject = { limit: 20 };
	if (filter) {
		query.filter = `name.firstName[ilike]:"%${filter}%"`;
	}
	const response = await twentyApiRequest.call(this, 'GET', 'people', undefined, query);
	const data = response.data as IDataObject;
	const people = (data.people || []) as IDataObject[];

	return {
		results: people.map((p) => {
			const name = p.name as IDataObject;
			return {
				name: `${name.firstName} ${name.lastName}`,
				value: p.id as string,
			};
		}),
	};
}

export async function searchOpportunities(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const query: IDataObject = { limit: 20 };
	if (filter) {
		query.filter = `name[ilike]:"%${filter}%"`;
	}
	const response = await twentyApiRequest.call(this, 'GET', 'opportunities', undefined, query);
	const data = response.data as IDataObject;
	const opps = (data.opportunities || []) as IDataObject[];

	return {
		results: opps.map((o) => ({
			name: o.name as string,
			value: o.id as string,
		})),
	};
}
