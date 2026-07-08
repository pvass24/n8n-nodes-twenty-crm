import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { twentyApiRequestAllItems } from '../../GenericFunctions';

export async function handleSearchOperation(
	this: IExecuteFunctions,
	_operation: string,
	_i: number,
): Promise<IDataObject[]> {
	const searchResource = this.getNodeParameter('searchResource', 0) as string;
	const filterQuery = this.getNodeParameter('filterQuery', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = returnAll ? undefined : (this.getNodeParameter('limit', 0) as number);
	const orderBy = this.getNodeParameter('orderBy', 0, '') as string;

	const query: IDataObject = {};
	if (filterQuery) query.filter = filterQuery;
	if (orderBy) query.order_by = orderBy;

	return twentyApiRequestAllItems.call(this, searchResource, query, limit);
}
