import type { ID, Proxy, ProxyTag, Relationship } from '$lib/models/effective';

export enum GroupByProxySettings {
    None,
    FirstTag,
    AllTags,
    FirstLetter,
}

export enum GroupByTagSettings {
    None,
    FirstLetter,
}

export type GroupBySettings<T extends Proxy | ProxyTag> = T extends Proxy
    ? GroupByProxySettings
    : GroupByTagSettings;

export type ProxyGroupInfo =
    | { type: null }
    | { type: 'tag'; tag: ID }
    | { type: 'tags'; tags: ID[] }
    | { type: 'first_letter'; letter: string };

export type TagGroupInfo = { type: null } | { type: 'first_letter'; letter: string };

export type GroupInfo<T extends Proxy | ProxyTag> = T extends Proxy ? ProxyGroupInfo : TagGroupInfo;

export interface GroupedBy<T extends Proxy | ProxyTag> {
    group_info: GroupInfo<T>;
    items: T[];
}

export function group_by_proxies(
    list: Proxy[],
    relationships: Relationship[],
    settings: GroupByProxySettings,
): GroupedBy<Proxy>[] {
    switch (settings) {
        case GroupByProxySettings.FirstTag: {
            const mapped = relationships.filter((r) => r.tags.length).map((r) => r.tags[0]);
            const used_tags: ID[] = [];
            for (const tag of mapped) {
                if (!used_tags.some((t) => t.equals(tag))) {
                    used_tags.push(tag);
                }
            }
            used_tags.sort((a, b) => a.compare(b));
            const groups: GroupedBy<Proxy>[] = [];
            for (const tag of used_tags) {
                groups.push({
                    group_info: {
                        type: 'tag',
                        tag,
                    },
                    items: list.filter((p) => {
                        const result = relationships.find((r) => r.proxy.equals(p.id));
                        if (result && result.tags.length) {
                            return result.tags[0].equals(tag);
                        }
                        return false;
                    }),
                });
            }
            groups.push({
                group_info: {
                    type: null,
                },
                items: list.filter(
                    (p) => (relationships.find((r) => r.proxy.equals(p.id))?.tags.length ?? 0) == 0,
                ),
            });
            return groups;
        }
        case GroupByProxySettings.AllTags: {
            const mapped = relationships.map((r) => r.tags).filter((ids) => ids.length);
            const used_tags: ID[][] = [];
            for (const tags of mapped) {
                const sorted = tags.toSorted((a, b) => a.compare(b));
                if (
                    !used_tags.some(
                        (ts) => ts.length == tags.length && ts.every((t, i) => t.equals(sorted[i])),
                    )
                ) {
                    used_tags.push(sorted);
                }
            }
            const groups: GroupedBy<Proxy>[] = [];
            for (const tags of used_tags) {
                groups.push({
                    group_info: {
                        type: 'tags',
                        tags,
                    },
                    items: list.filter((p) => {
                        const result = relationships.find((r) => r.proxy.equals(p.id));
                        if (result) {
                            return (
                                result.tags.length == tags.length &&
                                result.tags.every((t) => tags.some((t_) => t_.equals(t)))
                            );
                        }
                        return false;
                    }),
                });
            }
            groups.push({
                group_info: {
                    type: null,
                },
                items: list.filter(
                    (p) => (relationships.find((r) => r.proxy.equals(p.id))?.tags.length ?? 0) == 0,
                ),
            });
            return groups;
        }
        case GroupByProxySettings.FirstLetter: {
            const all_letters = [
                ...new Set(list.map((p) => p.name.at(0)?.toLocaleLowerCase() ?? '')),
            ].toSorted((a, b) => a.localeCompare(b));
            return all_letters.map((letter) => ({
                group_info: {
                    type: 'first_letter',
                    letter,
                },
                items: letter
                    ? list.filter((p) => p.name.at(0)?.toLocaleLowerCase() == letter)
                    : list.filter((p) => !p.name),
            }));
        }
        case GroupByProxySettings.None: {
            return [
                {
                    group_info: {
                        type: null,
                    },
                    items: list,
                },
            ];
        }
        default: {
            const $exhaustive: never = settings;
            return $exhaustive;
        }
    }
}

export function group_by_tags(
    list: ProxyTag[],
    relationships: Relationship[],
    settings: GroupByTagSettings,
): GroupedBy<ProxyTag>[] {
    switch (settings) {
        case GroupByTagSettings.FirstLetter: {
            const all_letters = [
                ...new Set(list.map((t) => t.name.at(0)?.toLocaleLowerCase() ?? '')),
            ].toSorted((a, b) => a.localeCompare(b));
            return all_letters.map((letter) => ({
                group_info: {
                    type: 'first_letter',
                    letter,
                },
                items: letter
                    ? list.filter((t) => t.name.at(0)?.toLocaleLowerCase() == letter)
                    : list.filter((t) => !t.name),
            }));
        }
        case GroupByTagSettings.None: {
            return [
                {
                    group_info: {
                        type: null,
                    },
                    items: list,
                },
            ];
        }
        default: {
            const $exhaustive: never = settings;
            return $exhaustive;
        }
    }
}
