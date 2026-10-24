import type { ID, Proxy, ProxyTag, Relationship } from '$lib/models/effective';

export enum SortOrder {
    Ascending,
    Descending,
}

export enum SortStringType {
    Length,
    Alphabet,
}

export enum SortIDType {
    EphemeralLast,
    EphemeralFirst,
}

export interface Sort {
    order: SortOrder;
}

export interface SortString extends Sort {
    sort_string: SortStringType;
}

export interface SortID extends Sort {
    sort_id: SortIDType;
}

export type SortArray = Sort;

export type SortType = Sort | SortString | SortID | SortArray;

export type SortProxySettings =
    | (SortID & { type: 'id' })
    | (SortString & { type: 'name' })
    | (SortString & { type: 'description' })
    | (SortString & { type: 'avatar_url' })
    | (SortArray & { type: 'triggers' })
    | (Sort & { type: 'times_used' })
    | (Sort & { type: 'creation_date' })
    | (SortString & { type: 'nickname' })
    | (SortString & { type: 'pronouns' })
    | (SortArray & { type: 'forms' })
    | (SortString & { type: 'current_form' })
    | (SortArray & { type: 'tags' });

export type SortTagSettings =
    | (SortID & { type: 'id' })
    | (SortString & { type: 'name' })
    | (SortString & { type: 'description' })
    | (Sort & { type: 'creation_date' })
    | (SortString & { type: 'tag' })
    | (Sort & { type: 'members' });

export type SortKind = 'number' | 'string' | 'id' | 'array';

export const SORT_BY_PROXY: {
    [key in SortProxySettings['type']]: [string, SortKind];
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    avatar_url: ['Avatar URL', 'string'],
    triggers: ['Triggers', 'array'],
    times_used: ['Messages Sent', 'number'],
    creation_date: ['Date Created', 'number'],
    nickname: ['Nickname', 'string'],
    pronouns: ['Pronouns', 'string'],
    forms: ['Forms', 'array'],
    current_form: ['Current Form', 'string'],
    tags: ['Tags', 'array'],
};

export const SORT_BY_TAG: {
    [key in SortTagSettings['type']]: [string, SortKind];
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    creation_date: ['Date Created', 'number'],
    tag: ['Marker', 'string'],
    members: ['Members', 'array'],
};

export type SortSettings<T extends Proxy | ProxyTag> = T extends Proxy
    ? SortProxySettings
    : SortTagSettings;

function sort_by<T, SortT extends SortType>(
    list: T[],
    settings: SortT,
    property: (
        _: T,
    ) => SortT extends SortID ? ID : SortT extends SortString ? string : number | unknown[],
): T[] {
    const direction = settings.order == SortOrder.Ascending ? 1 : -1;
    if ('sort_string' in settings) {
        if (settings.sort_string == SortStringType.Alphabet) {
            return list.toSorted(
                (a, b) => direction * (property(a) as string).localeCompare(property(b) as string),
            );
        } else {
            return list.toSorted(
                (a, b) =>
                    direction * ((property(a) as string).length - (property(b) as string).length),
            );
        }
    } else if ('sort_id' in settings) {
        return list.toSorted((a, b) => {
            const a_id = property(a) as ID;
            const b_id = property(b) as ID;
            if (a_id.ephemeral == b_id.ephemeral) {
                return direction * (a_id.index - b_id.index);
            } else {
                if (settings.sort_id == SortIDType.EphemeralFirst) {
                    return a_id.ephemeral ? -1 : 1;
                } else {
                    return a_id.ephemeral ? 1 : -1;
                }
            }
        });
    } else {
        return list.toSorted((a, b) => {
            const a_prop = property(a) as number | unknown[];
            const b_prop = property(b) as number | unknown[];
            if (Array.isArray(a_prop)) {
                return direction * (a_prop.length - (b_prop as unknown[]).length);
            } else {
                return direction * (a_prop - (b_prop as number));
            }
        });
    }
}

export function sort_proxies(
    list: Proxy[],
    relationships: Relationship[],
    settings: SortSettings<Proxy>,
): Proxy[] {
    switch (settings.type) {
        // i love typescript
        case 'id':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'name':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'description':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'avatar_url':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'triggers':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'times_used':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'creation_date':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'nickname':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'pronouns':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'forms':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'current_form':
            return sort_by(list, settings, (p) => p[settings.type]);
        case 'tags':
            return sort_by(
                list,
                settings,
                (p) => relationships.find((r) => r.proxy == p.id)?.tags ?? [],
            );

        default: {
            const $exhaustive: never = settings;
            return $exhaustive;
        }
    }
}

export function sort_tags(
    list: ProxyTag[],
    relationships: Relationship[],
    settings: SortSettings<ProxyTag>,
): ProxyTag[] {
    switch (settings.type) {
        // i love typescript
        case 'id':
            return sort_by(list, settings, (t) => t[settings.type]);
        case 'name':
            return sort_by(list, settings, (t) => t[settings.type]);
        case 'description':
            return sort_by(list, settings, (t) => t[settings.type]);
        case 'creation_date':
            return sort_by(list, settings, (t) => t[settings.type]);
        case 'tag':
            return sort_by(list, settings, (t) => t[settings.type]);
        case 'members':
            return sort_by(list, settings, (t) =>
                relationships.filter((r) => r.tags.some((tr) => tr.equals(t.id))),
            );

        default: {
            const $exhaustive: never = settings;
            return $exhaustive;
        }
    }
}
