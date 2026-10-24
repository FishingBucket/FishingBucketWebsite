import { get_user, type User } from './user';

export class Session {
    constructor(
        public session_id: string,
        public expires: number,
        public user: User,
    ) {}

    with_storage(storage: Storage) {
        const expires_str = storage.getItem('expires');
        if (!expires_str) {
            return;
        }
        const expires = parseFloat(expires_str);
        if (expires - Date.now() / 1000 <= 0) {
            return;
        }
        const session_id = storage.getItem('session_id');
        if (!session_id) {
            return;
        }
        this.session_id = session_id;
        this.expires = expires;
        this.user = get_user()!;
    }

    to_storage(storage: Storage) {
        storage.setItem('session_id', this.session_id);
        storage.setItem('expires', this.expires.toString());
        storage.setItem('user', JSON.stringify(this.user.user));
        storage.setItem('platform', this.user.platform);
    }
}

let global_session: Session | null = $state(null);

export function session(): Session {
    if (!global_session) {
        throw new Error('Not logged in!');
    }
    return global_session;
}

export function has_session(): boolean {
    return !!global_session;
}

export function set_session(session: Session) {
    global_session = session;
}
