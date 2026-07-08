export interface ITwentyPageInfo {
	startCursor: string;
	endCursor: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface ITwentyListResponse<T = Record<string, unknown>> {
	data: { [resource: string]: T[] };
	totalCount: number;
	pageInfo: ITwentyPageInfo;
}

export interface ITwentySingleResponse<T = Record<string, unknown>> {
	data: { [operation: string]: T };
}

export interface ITwentyErrorResponse {
	error: string;
	messages: string[];
	statusCode: number;
}

export type TwentyFilterComparator =
	| 'eq'
	| 'neq'
	| 'in'
	| 'is'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'startsWith'
	| 'like'
	| 'ilike'
	| 'containsAny';

export interface ITwentyFilter {
	field: string;
	comparator: TwentyFilterComparator;
	value: string;
}
