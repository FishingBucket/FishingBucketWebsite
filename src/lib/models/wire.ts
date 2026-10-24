export type WireID = number | { index: number };

export interface WireProxy {
    id: WireID;
    name: string;
    description: string;
    avatar_url: string;
    triggers: string[];
    owner: number;
    times_used: number;
    creation_date: number;
    nickname: string;
    effective_name: string;
    forms: Record<string, string>;
    current_form: string;
    pronouns: string;
}

export interface WireProxyTag {
    id: WireID;
    name: string;
    description: string;
    owner: number;
    creation_date: number;
    tag: string;
}

export interface WireRelationship {
    proxy: WireID;
    tags: WireID[];
}

export interface WireUserInformation {
    proxies: WireProxy[];
    tags: WireProxyTag[];
    relationships: WireRelationship[];
    user_id: number;
}
