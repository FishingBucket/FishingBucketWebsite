import type {
    WireID,
    WireProxy,
    WireProxyTag,
    WireRelationship,
    WireUserInformation,
} from './wire';

export class ID {
    constructor(
        public index: number,
        public ephemeral: boolean,
    ) {}

    equals(other: ID): boolean {
        if (other instanceof NullID) {
            return false;
        }
        return this.ephemeral == other.ephemeral && this.index == other.index;
    }

    toString(): string {
        if (this.ephemeral) {
            return 'new+0x' + this.index.toString(16);
        }
        return '0x' + this.index.toString(16);
    }

    compare(other: ID): number {
        if (other instanceof NullID) return -1;
        if (this.ephemeral == other.ephemeral) return this.index - other.index;
        return this.ephemeral ? -1 : 1;
    }

    static from_wire(wire: WireID): ID {
        if (typeof wire == 'number') {
            return new ID(wire, false);
        } else {
            return new ID(wire.index, true);
        }
    }

    to_wire(): WireID {
        return this.ephemeral ? { index: this.index } : this.index;
    }
}

export class NullID extends ID {
    constructor() {
        super(-1, true);
    }

    equals(other: ID): boolean {
        return other instanceof NullID;
    }

    to_wire(): WireID {
        return null!;
    }
}

export interface ProxyForm {
    key: string;
    avatar_url: string;
}

export interface Proxy {
    id: ID;
    name: string;
    description: string;
    avatar_url: string;
    triggers: string[];
    owner: number;
    times_used: number;
    creation_date: number;
    nickname: string;
    effective_name: string;
    forms: ProxyForm[];
    current_form: string;
    pronouns: string;
}

export function proxy_from_wire(wire: WireProxy): Proxy {
    return {
        id: ID.from_wire(wire.id),
        name: wire.name,
        description: wire.description,
        avatar_url: wire.avatar_url,
        triggers: wire.triggers,
        owner: wire.owner,
        times_used: wire.times_used,
        creation_date: wire.creation_date,
        nickname: wire.nickname,
        effective_name: wire.effective_name,
        forms: Object.entries(wire.forms).map(([key, avatar_url]) => ({
            key,
            avatar_url,
        })),
        current_form: wire.current_form,
        pronouns: wire.pronouns,
    };
}

export function proxy_to_wire(proxy: Proxy): WireProxy {
    return {
        id: proxy.id.to_wire(),
        name: proxy.name,
        description: proxy.description,
        avatar_url: proxy.avatar_url,
        triggers: proxy.triggers.filter((trigger) => trigger),
        owner: proxy.owner,
        times_used: proxy.times_used,
        creation_date: proxy.creation_date,
        nickname: proxy.nickname,
        effective_name: proxy.effective_name,
        forms: Object.fromEntries(
            proxy.forms
                .filter((form) => form.key && form.avatar_url)
                .map((form) => [form.key, form.avatar_url]),
        ),
        current_form: proxy.current_form,
        pronouns: proxy.pronouns,
    };
}

export function proxy_normalize(proxy: Proxy): void {
    proxy.triggers = proxy.triggers.map((trigger) => trigger);
    proxy.forms = proxy.forms.filter((form) => form.key && form.avatar_url);
}

export function proxy_get_effective_avatar_url(proxy: Proxy): string {
    return proxy.current_form
        ? (proxy.forms.find((form) => form.key == proxy.current_form)?.avatar_url ??
              proxy.avatar_url)
        : proxy.avatar_url;
}

export function proxy_get_random_avatar(): string {
    return `https://fluxerstatic.com/avatars/${Math.floor(Math.random() * 6)}.png`;
}

export interface ProxyTag {
    id: ID;
    name: string;
    description: string;
    owner: number;
    creation_date: number;
    tag: string;
}

export function proxy_tag_from_wire(wire: WireProxyTag): ProxyTag {
    return {
        id: ID.from_wire(wire.id),
        name: wire.name,
        description: wire.description,
        owner: wire.owner,
        creation_date: wire.creation_date,
        tag: wire.tag,
    };
}

export function proxy_tag_to_wire(tag: ProxyTag): WireProxyTag {
    return {
        id: tag.id.to_wire(),
        name: tag.name,
        description: tag.description,
        owner: tag.owner,
        creation_date: tag.creation_date,
        tag: tag.tag,
    };
}

export interface Relationship {
    proxy: ID;
    tags: ID[];
}

export function relationship_from_wire(wire: WireRelationship): Relationship {
    return {
        proxy: ID.from_wire(wire.proxy),
        tags: wire.tags.map((tag) => ID.from_wire(tag)),
    };
}

export function relationship_to_wire(relationship: Relationship): WireRelationship {
    return {
        proxy: relationship.proxy.to_wire(),
        tags: relationship.tags.map((tag) => tag.to_wire()),
    };
}

export interface UserInformation {
    proxies: Proxy[];
    tags: ProxyTag[];
    relationships: Relationship[];
    user_id: number;
}

export function user_information_from_wire(wire: WireUserInformation): UserInformation {
    return {
        proxies: wire.proxies.map((proxy) => proxy_from_wire(proxy)),
        tags: wire.tags.map((tag) => proxy_tag_from_wire(tag)),
        relationships: wire.relationships.map((relationship) =>
            relationship_from_wire(relationship),
        ),
        user_id: wire.user_id,
    };
}

export function user_information_to_wire(user_information: UserInformation): WireUserInformation {
    return {
        proxies: user_information.proxies.map((proxy) => proxy_to_wire(proxy)),
        tags: user_information.tags.map((tag) => proxy_tag_to_wire(tag)),
        relationships: user_information.relationships.map((relationship) =>
            relationship_to_wire(relationship),
        ),
        user_id: user_information.user_id,
    };
}
