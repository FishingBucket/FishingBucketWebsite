import {
    proxy_to_wire,
    proxy_tag_to_wire,
    relationship_to_wire,
    type Proxy,
    type ProxyTag,
    type ID,
    type Relationship,
} from './effective';

interface Edit {
    to_wire(): {
        edit_type: string;
    };

    handle_add(edits: Edits): boolean;
}

export class NewProxyEdit implements Edit {
    constructor(public proxy: Proxy) {}

    to_wire() {
        return {
            edit_type: 'NEW_PROXY',
            proxy: proxy_to_wire(this.proxy),
        };
    }

    handle_add(): boolean {
        return true;
    }
}

export class NewProxyTagEdit implements Edit {
    constructor(public tag: ProxyTag) {}

    to_wire() {
        return {
            edit_type: 'NEW_PROXY_TAG',
            tag: proxy_tag_to_wire(this.tag),
        };
    }

    handle_add(): boolean {
        return true;
    }
}

export class EditProxyEdit implements Edit {
    constructor(public proxy: Proxy) {}

    to_wire() {
        return {
            edit_type: 'EDIT_PROXY',
            value: proxy_to_wire(this.proxy),
        };
    }

    handle_add(edits: Edits): boolean {
        const corresponding = edits.edits.find(
            (edit) =>
                (edit instanceof NewProxyEdit || edit instanceof EditProxyEdit) &&
                edit.proxy.id.equals(this.proxy.id),
        ) as NewProxyEdit | EditProxyEdit | undefined;

        if (!corresponding) return true;

        corresponding.proxy = this.proxy;
        return false;
    }
}

export class EditProxyTagEdit implements Edit {
    constructor(public tag: ProxyTag) {}

    to_wire() {
        return {
            edit_type: 'EDIT_PROXY_TAG',
            value: proxy_tag_to_wire(this.tag),
        };
    }

    handle_add(edits: Edits): boolean {
        const corresponding = edits.edits.find(
            (edit) =>
                (edit instanceof NewProxyTagEdit || edit instanceof EditProxyTagEdit) &&
                edit.tag.id.equals(this.tag.id),
        ) as NewProxyTagEdit | EditProxyTagEdit | undefined;

        if (!corresponding) return true;

        corresponding.tag = this.tag;
        return false;
    }
}

export class DeleteProxyEdit implements Edit {
    constructor(public id: ID) {}

    to_wire() {
        return {
            edit_type: 'DELETE_PROXY',
            proxy_id: this.id.to_wire(),
        };
    }

    handle_add(edits: Edits): boolean {
        if (!this.id.ephemeral) return true;

        const corresponding_index = edits.edits.findIndex(
            (edit) => edit instanceof NewProxyEdit && edit.proxy.id.equals(this.id),
        );

        if (corresponding_index == -1) return true;

        edits.edits.splice(corresponding_index, 1);
        return false;
    }
}

export class DeleteProxyTagEdit implements Edit {
    constructor(public id: ID) {}

    to_wire() {
        return {
            edit_type: 'DELETE_PROXY_TAG',
            tag_id: this.id.to_wire(),
        };
    }

    handle_add(edits: Edits): boolean {
        if (!this.id.ephemeral) return true;

        const corresponding_index = edits.edits.findIndex(
            (edit) => edit instanceof NewProxyTagEdit && edit.tag.id.equals(this.id),
        );

        if (corresponding_index == -1) return true;

        edits.edits.splice(corresponding_index, 1);
        return false;
    }
}

export class SetRelationshipEdit implements Edit {
    constructor(public relationship: Relationship) {}

    to_wire() {
        return {
            edit_type: 'SET_RELATIONSHIP',
            value: relationship_to_wire(this.relationship),
        };
    }

    handle_add(edits: Edits): boolean {
        const corresponding_index = edits.edits.findIndex(
            (edit) =>
                edit instanceof SetRelationshipEdit &&
                edit.relationship.proxy.equals(this.relationship.proxy),
        );

        if (corresponding_index != -1) {
            edits.edits.splice(corresponding_index, 1);
        }
        return true;
    }
}

export class Edits {
    edits: Edit[];
    set_dirty: (dirty: boolean) => void;

    constructor(set_dirty: (dirty: boolean) => void) {
        this.edits = [];
        this.set_dirty = set_dirty;
    }

    serialize(): object {
        return {
            edits: this.edits.map((edit) => ({
                edit: edit.to_wire(),
            })),
        };
    }

    add_edit(edit: Edit) {
        if (edit.handle_add(this)) {
            this.edits.push(edit);
        }
        this.set_dirty(true);
    }

    clear() {
        this.edits.splice(0);
        this.set_dirty(false);
    }
}
