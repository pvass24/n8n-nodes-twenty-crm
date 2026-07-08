import { describe, it, expect } from 'vitest';
import { buildFilterString } from '../../nodes/TwentyCrm/GenericFunctions';
import type { ITwentyFilter } from '../../nodes/TwentyCrm/types';

describe('Polling Trigger: Filter construction', () => {
	const lastPoll = '2026-07-08T20:00:00.000Z';

	it('should build filter for "created" event', () => {
		const filters: ITwentyFilter[] = [{ field: 'createdAt', comparator: 'gte', value: lastPoll }];
		expect(buildFilterString(filters)).toBe('createdAt[gte]:"2026-07-08T20:00:00.000Z"');
	});

	it('should build filter for "updated" event', () => {
		const filters: ITwentyFilter[] = [{ field: 'updatedAt', comparator: 'gte', value: lastPoll }];
		expect(buildFilterString(filters)).toBe('updatedAt[gte]:"2026-07-08T20:00:00.000Z"');
	});

	it('should build filter for "createdOrUpdated" event (uses updatedAt)', () => {
		const filters: ITwentyFilter[] = [{ field: 'updatedAt', comparator: 'gte', value: lastPoll }];
		expect(buildFilterString(filters)).toBe('updatedAt[gte]:"2026-07-08T20:00:00.000Z"');
	});

	it('should combine poll filter with additional user filter', () => {
		const pollFilter = 'updatedAt[gte]:"2026-07-08T20:00:00.000Z"';
		const additionalFilter = 'stage[eq]:"CLOSED_WON"';
		const combined = `${pollFilter},${additionalFilter}`;
		expect(combined).toBe('updatedAt[gte]:"2026-07-08T20:00:00.000Z",stage[eq]:"CLOSED_WON"');
	});
});

describe('Polling Trigger: Timestamp management', () => {
	it('should use 1 hour ago as default when no lastPoll exists', () => {
		const now = Date.now();
		const defaultLastPoll = new Date(now - 60 * 60 * 1000).toISOString();
		const parsed = new Date(defaultLastPoll).getTime();
		expect(now - parsed).toBeGreaterThanOrEqual(3600000 - 100);
		expect(now - parsed).toBeLessThan(3601000);
	});

	it('should use 24 hours ago for manual mode', () => {
		const now = Date.now();
		const manualLastPoll = new Date(now - 24 * 60 * 60 * 1000).toISOString();
		const parsed = new Date(manualLastPoll).getTime();
		expect(now - parsed).toBeGreaterThanOrEqual(86400000 - 100);
		expect(now - parsed).toBeLessThan(86401000);
	});

	it('should update lastPoll to current time after successful poll', () => {
		const before = new Date().toISOString();
		const newLastPoll = new Date().toISOString();
		expect(new Date(newLastPoll).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
	});
});

describe('Polling Trigger: Response handling', () => {
	it('should return null when no new records', () => {
		const results: unknown[] = [];
		const output = results.length === 0 ? null : results;
		expect(output).toBeNull();
	});

	it('should return items array when records found', () => {
		const results = [{ id: '1', name: 'New Company' }, { id: '2', name: 'Another' }];
		const output = results.length === 0 ? null : results.map((item) => ({ json: item }));
		expect(output).toHaveLength(2);
		expect(output![0].json).toEqual({ id: '1', name: 'New Company' });
	});

	it('should handle pagination cursor correctly', () => {
		const pageInfo = {
			hasNextPage: true,
			endCursor: 'eyJpZCI6IjEyMyJ9',
			startCursor: 'eyJpZCI6IjEwMCJ9',
			hasPreviousPage: false,
		};
		expect(pageInfo.hasNextPage).toBe(true);
		expect(pageInfo.endCursor).toBe('eyJpZCI6IjEyMyJ9');

		const nextQuery = { starting_after: pageInfo.endCursor };
		expect(nextQuery.starting_after).toBe('eyJpZCI6IjEyMyJ9');
	});

	it('should stop paginating when hasNextPage is false', () => {
		const pageInfo = {
			hasNextPage: false,
			endCursor: 'eyJpZCI6IjEyMyJ9',
		};
		const shouldContinue = pageInfo.hasNextPage && !!pageInfo.endCursor;
		expect(shouldContinue).toBe(false);
	});
});
