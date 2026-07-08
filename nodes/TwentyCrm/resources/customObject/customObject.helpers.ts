
export interface IMetadataObject {
	id: string;
	nameSingular: string;
	namePlural: string;
	labelSingular: string;
	labelPlural: string;
	isCustom: boolean;
	isActive: boolean;
	isSystem: boolean;
}

export interface IObjectOption {
	name: string;
	value: string;
}

export function parseMetadataObjects(
	objects: IMetadataObject[],
	includeSystem = false,
): IObjectOption[] {
	return objects
		.filter((o) => o.isActive && (includeSystem || !o.isSystem))
		.map((o) => ({
			name: o.labelSingular,
			value: o.namePlural,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildCustomObjectUrl(serverUrl: string, objectPlural: string, id?: string): string {
	const base = serverUrl.replace(/\/$/, '');
	return id ? `${base}/rest/${objectPlural}/${id}` : `${base}/rest/${objectPlural}`;
}

export function getResponseKey(objectPlural: string, operation: string): string {
	const singular = objectPlural.replace(/s$/, '').replace(/ie$/, 'y');
	switch (operation) {
		case 'create':
			return `create${capitalize(singular)}`;
		case 'update':
			return `update${capitalize(singular)}`;
		case 'delete':
			return `delete${capitalize(singular)}`;
		case 'get':
			return singular;
		default:
			return objectPlural;
	}
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
