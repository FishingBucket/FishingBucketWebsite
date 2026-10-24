import type { Proxy, ProxyTag, Relationship } from '$lib/models/effective';
import { filter_proxies, filter_tags, type FilterSettings } from './filter';
import {
    group_by_proxies,
    group_by_tags,
    GroupByProxySettings,
    GroupByTagSettings,
    type GroupBySettings,
    type GroupedBy,
} from './group';
import { sort_proxies, sort_tags, SortIDType, SortOrder, type SortSettings } from './sort';

export interface QuerySettings<T extends Proxy | ProxyTag> {
    filter?: FilterSettings<T>;
    group_by?: GroupBySettings<T>;
    sort?: SortSettings<T>;
}

export function apply_proxy_query(
    proxies: Proxy[],
    relationships: Relationship[],
    query: QuerySettings<Proxy>,
): GroupedBy<Proxy>[] {
    if (query.filter) {
        proxies = filter_proxies(proxies, relationships, query.filter);
    }
    let groups: GroupedBy<Proxy>[];
    if (query.group_by) {
        groups = group_by_proxies(proxies, relationships, query.group_by);
    } else {
        groups = [
            {
                group_info: {
                    type: null,
                },
                items: proxies,
            },
        ];
    }
    if (query.sort) {
        for (const group of groups) {
            group.items = sort_proxies(group.items, relationships, query.sort);
        }
    }
    return groups;
}

export function apply_tag_query(
    tags: ProxyTag[],
    relationships: Relationship[],
    query: QuerySettings<ProxyTag>,
): GroupedBy<ProxyTag>[] {
    if (query.filter) {
        tags = filter_tags(tags, relationships, query.filter);
    }
    let groups: GroupedBy<ProxyTag>[];
    if (query.group_by) {
        groups = group_by_tags(tags, relationships, query.group_by);
    } else {
        groups = [
            {
                group_info: {
                    type: null,
                },
                items: tags,
            },
        ];
    }
    if (query.sort) {
        for (const group of groups) {
            group.items = sort_tags(group.items, relationships, query.sort);
        }
    }
    return groups;
}

export function make_default_proxy_queries(): QuerySettings<Proxy> {
    return {
        filter: {},
        group_by: GroupByProxySettings.FirstTag,
        sort: {
            type: 'id',
            sort_id: SortIDType.EphemeralFirst,
            order: SortOrder.Ascending,
        },
    };
}

export function make_default_tag_queries(): QuerySettings<ProxyTag> {
    return {
        filter: {},
        group_by: GroupByTagSettings.None,
        sort: {
            type: 'id',
            sort_id: SortIDType.EphemeralFirst,
            order: SortOrder.Ascending,
        },
    };
}
