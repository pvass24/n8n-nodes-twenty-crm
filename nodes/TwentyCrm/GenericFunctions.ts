import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { ITwentyFilter, ITwentyPageInfo } from './types';

const NUMERIC_RE = /^\d+(\.\d+)?$/;
const BOOLEAN_RE = /^(true|false)$/;
const NULL_RE = /^NULL$/;
const ARRAY_RE = /^\[.*\]$/;

export function buildFilterString(filters: ITwentyFilter[]): string {
	if (filters.length === 0) return '';

	return filters
		.map((f) => {
			const value = formatFilterValue(f.value, f.comparator);
			return `${f.field}[${f.comparator}]:${value}`;
		})
		.join(',');
}

function formatFilterValue(value: string, comparator: string): string {
	if (NULL_RE.test(value)) return value;
	if (BOOLEAN_RE.test(value)) return value;
	if (NUMERIC_RE.test(value)) return value;
	if (ARRAY_RE.test(value)) return value;
	if (comparator === 'is') return value;
	return `"${value}"`;
}

export function buildRequestUrl(serverUrl: string, resource: string, id?: string): string {
	const base = serverUrl.replace(/\/$/, '');
	const path = id ? `/rest/${resource}/${id}` : `/rest/${resource}`;
	return `${base}${path}`;
}

export function extractDataFromResponse(response: IDataObject, key: string): unknown {
	if (response.error || response.statusCode) {
		const messages = (response.messages as string[]) || [response.error as string];
		throw new Error(messages.join('; '));
	}

	const data = response.data as IDataObject | undefined;
	if (!data) {
		throw new Error('Response missing data field');
	}

	return data[key];
}

export async function twentyApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body?: IDataObject,
	query?: IDataObject,
	id?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('twentyCrmApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: buildRequestUrl(serverUrl, resource, id),
		json: true,
		body: body && Object.keys(body).length > 0 ? body : undefined,
		qs: query && Object.keys(query).length > 0 ? query : undefined,
	};

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'twentyCrmApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function twentyApiRequestAllItems(
	this: IExecuteFunctions,
	resource: string,
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let hasNextPage = true;

	query.limit = limit ? Math.min(limit, 60) : 60;

	while (hasNextPage) {
		const response = await twentyApiRequest.call(this, 'GET', resource, undefined, query);

		const pageInfo = response.pageInfo as ITwentyPageInfo | undefined;
		const data = response.data as IDataObject | undefined;

		if (data) {
			const items = data[resource] as IDataObject[] | undefined;
			if (items) {
				results.push(...items);
			}
		}

		if (limit && results.length >= limit) {
			return results.slice(0, limit);
		}

		if (pageInfo?.hasNextPage && pageInfo.endCursor) {
			query.starting_after = pageInfo.endCursor;
			hasNextPage = true;
		} else {
			hasNextPage = false;
		}
	}

	return results;
}
