import type { ID, Proxy, ProxyTag, Relationship } from '$lib/models/effective';

export type FilterNumeric = { type: 'numeric' } & (
    | {
          class: 'range';
          lower: number;
          upper: number;
          lower_exclusive: boolean;
          upper_exclusive: boolean;
      }
    | {
          class: '>' | '<' | '>=' | '<=' | '==' | '!=';
          rhs: number;
      }
);

function numeric_is(number: number, filter: FilterNumeric): boolean {
    switch (filter.class) {
        case 'range':
            return (
                (!filter.lower_exclusive ? filter.lower <= number : filter.lower < number) &&
                (!filter.upper_exclusive ? number <= filter.upper : number < filter.upper)
            );
        case '>':
            return number > filter.rhs;
        case '<':
            return number < filter.rhs;
        case '>=':
            return number >= filter.rhs;
        case '<=':
            return number <= filter.rhs;
        case '==':
            return number == filter.rhs;
        case '!=':
            return number != filter.rhs;
        default: {
            const $exhaustive: never = filter;
            return $exhaustive;
        }
    }
}

export type FilterString = { type: 'string' } & (
    | {
          class: 'truthy';
      }
    | {
          class: 'falsy';
      }
    | ({
          case_insensitive: boolean;
      } & (
          | {
                class: 'contains';
                contains: string;
            }
          | {
                class: 'startswith';
                startswith: string;
            }
          | {
                class: 'endswith';
                endswith: string;
            }
      ))
    | {
          class: 'length';
          length: FilterNumeric;
      }
    | {
          class: 'regex';
          regex: string;
      }
);

function string_is(string: string, filter: FilterString): boolean {
    switch (filter.class) {
        case 'truthy':
            return !!string.length;
        case 'falsy':
            return !string.length;
        case 'contains':
            return !filter.case_insensitive
                ? string.includes(filter.contains)
                : string.toLocaleLowerCase().includes(filter.contains.toLocaleLowerCase());
        case 'startswith':
            return !filter.case_insensitive
                ? string.startsWith(filter.startswith)
                : string.toLocaleLowerCase().startsWith(filter.startswith.toLocaleLowerCase());
        case 'endswith':
            return !filter.case_insensitive
                ? string.endsWith(filter.endswith)
                : string.toLocaleLowerCase().endsWith(filter.endswith.toLocaleLowerCase());
        case 'length':
            return numeric_is(string.length, filter.length);
        case 'regex': {
            try {
                return new RegExp(filter.regex).test(string);
            } catch {
                return false;
            }
        }
        default: {
            const $exhaustive: never = filter;
            return $exhaustive;
        }
    }
}

export type FilterID = {
    type: 'id';
    id_type: 'ephemeral' | 'concrete' | 'both';
    numeric: FilterNumeric;
};

function id_is(id: ID, filter: FilterID): boolean {
    if (filter.id_type == 'ephemeral' && !id.ephemeral) return false;
    if (filter.id_type == 'concrete' && id.ephemeral) return false;
    return numeric_is(id.index, filter.numeric);
}

export type FilterList<F extends FilterNumeric | FilterString | FilterID> = { type: 'list' } & (
    | {
          class: 'truthy';
      }
    | {
          class: 'falsy';
      }
    | {
          class: 'any';
          any: F[];
      }
    | {
          class: 'all';
          all: F[];
      }
);

function list_is<T, Inner extends FilterNumeric | FilterString | FilterID>(
    list: T[],
    filter: FilterList<Inner>,
): boolean {
    switch (filter.class) {
        case 'truthy':
            return !!list.length;
        case 'falsy':
            return !list.length;
        case 'any':
            return list.some((value) =>
                filter.any.some((inner) => {
                    switch (inner.type) {
                        case 'id':
                            return id_is(value as ID, inner);
                        case 'numeric':
                            return numeric_is(value as number, inner);
                        case 'string':
                            return string_is(value as string, inner);
                        default: {
                            const $exhaustive: never = inner;
                            return $exhaustive;
                        }
                    }
                }),
            );
        case 'all':
            return list.every((value) =>
                filter.all.some((inner) => {
                    switch (inner.type) {
                        case 'id':
                            return id_is(value as ID, inner);
                        case 'numeric':
                            return numeric_is(value as number, inner);
                        case 'string':
                            return string_is(value as string, inner);
                        default: {
                            const $exhaustive: never = inner;
                            return $exhaustive;
                        }
                    }
                }),
            );
        default: {
            const $exhaustive: never = filter;
            return $exhaustive;
        }
    }
}

export type FilterTypes =
    | FilterList<FilterNumeric>
    | FilterList<FilterString>
    | FilterList<FilterID>
    | FilterNumeric
    | FilterString
    | FilterID;

export type FilterKind =
    ['list', 'string' | 'numeric' | 'id'] | 'string' | 'numeric' | 'id' | 'date';

export function get_default_filter(k: FilterKind): FilterTypes {
    if (Array.isArray(k)) {
        return {
            type: 'list',
            class: 'all',
            all: [get_default_filter(k[1])] as FilterNumeric[] | FilterString[] | FilterID[],
        } as FilterList<FilterNumeric> | FilterList<FilterString> | FilterList<FilterID>;
    }
    switch (k) {
        case 'string':
            return {
                type: 'string',
                class: 'truthy',
            };
        case 'numeric':
            return {
                type: 'numeric',
                class: '!=',
                rhs: 0,
            };
        case 'date':
            return {
                type: 'numeric',
                class: '<=',
                rhs: Date.now() / 1000,
            };
        case 'id':
            return {
                type: 'id',
                id_type: 'concrete',
                numeric: {
                    type: 'numeric',
                    class: '!=',
                    rhs: 0,
                },
            };
        default: {
            const $exhaustive: never = k;
            return $exhaustive;
        }
    }
}

export interface FilterProxySettings {
    id?: FilterID;
    name?: FilterString;
    description?: FilterString;
    avatar_url?: FilterString;
    triggers?: FilterList<FilterString>;
    times_used?: FilterNumeric;
    creation_date?: FilterNumeric;
    nickname?: FilterString;
    forms?: FilterList<FilterString>;
    current_form?: FilterString;
    pronouns?: FilterString;
    tags?: FilterList<FilterID>;
}

export interface FilterTagSettings {
    id?: FilterID;
    name?: FilterString;
    description?: FilterString;
    creation_date?: FilterNumeric;
    tag?: FilterString;
    members?: FilterList<FilterID>;
}

export const FILTER_FIELDS_PROXY: {
    [key in keyof FilterProxySettings]-?: [string, FilterKind];
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    avatar_url: ['Avatar URL', 'string'],
    triggers: ['Triggers', ['list', 'string']],
    times_used: ['Messages Sent', 'numeric'],
    creation_date: ['Date Created', 'date'],
    nickname: ['Nickname', 'string'],
    forms: ['Form Names', ['list', 'string']],
    current_form: ['Current Form', 'string'],
    pronouns: ['Pronouns', 'string'],
    tags: ['Tag IDs', ['list', 'id']],
};

export const FILTER_FIELDS_TAG: {
    [key in keyof FilterTagSettings]-?: [string, FilterKind];
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    creation_date: ['Date Created', 'date'],
    tag: ['Marker', 'string'],
    members: ['Member IDs', ['list', 'id']],
};

export type FilterSettings<T extends Proxy | ProxyTag> = T extends Proxy
    ? FilterProxySettings
    : FilterTagSettings;

function proxy_is(
    proxy: Proxy,
    relationships: Relationship[],
    settings: FilterProxySettings,
): boolean {
    const conditions = [
        settings.id ? id_is(proxy.id, settings.id) : null,
        settings.name ? string_is(proxy.name, settings.name) : null,
        settings.description ? string_is(proxy.description, settings.description) : null,
        settings.avatar_url ? string_is(proxy.avatar_url, settings.avatar_url) : null,
        settings.triggers ? list_is(proxy.triggers, settings.triggers) : null,
        settings.times_used ? numeric_is(proxy.times_used, settings.times_used) : null,
        settings.creation_date ? numeric_is(proxy.creation_date, settings.creation_date) : null,
        settings.nickname ? string_is(proxy.nickname, settings.nickname) : null,
        settings.forms
            ? list_is(
                  proxy.forms.map((f) => f.key),
                  settings.forms,
              )
            : null,
        settings.current_form ? string_is(proxy.current_form, settings.current_form) : null,
        settings.pronouns ? string_is(proxy.pronouns, settings.pronouns) : null,
        settings.tags
            ? list_is(
                  relationships.find((r) => r.proxy.equals(proxy.id))?.tags ?? [],
                  settings.tags,
              )
            : null,
    ];
    return conditions.filter((c) => c != null).every((c) => c);
}

function tag_is(
    tag: ProxyTag,
    relationships: Relationship[],
    settings: FilterTagSettings,
): boolean {
    const conditions = [
        settings.id ? id_is(tag.id, settings.id) : null,
        settings.name ? string_is(tag.name, settings.name) : null,
        settings.description ? string_is(tag.description, settings.description) : null,
        settings.creation_date ? numeric_is(tag.creation_date, settings.creation_date) : null,
        settings.tag ? string_is(tag.tag, settings.tag) : null,
        settings.members
            ? list_is(
                  relationships
                      .filter((r) => r.tags.some((t) => t.equals(tag.id)))
                      .map((r) => r.proxy),
                  settings.members,
              )
            : null,
    ];
    return conditions.filter((c) => c != null).every((c) => c);
}

export function filter_proxies(
    list: Proxy[],
    relationships: Relationship[],
    settings: FilterSettings<Proxy>,
): Proxy[] {
    return list.filter((p) => proxy_is(p, relationships, settings));
}

export function filter_tags(
    list: ProxyTag[],
    relationships: Relationship[],
    settings: FilterSettings<ProxyTag>,
): ProxyTag[] {
    return list.filter((t) => tag_is(t, relationships, settings));
}
