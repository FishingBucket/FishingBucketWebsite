import config_public from '$config_public';
import { ConfigPublicType } from './config_schema';
import { z } from 'zod';

export { ConfigPublicType } from './config_schema';

export type ConfigPublic = z.infer<typeof ConfigPublicType>;

export const CONFIG_PUBLIC = ConfigPublicType.parse(config_public);
