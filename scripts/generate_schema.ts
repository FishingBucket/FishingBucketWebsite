import { z } from 'zod';
import fs from 'node:fs/promises';
import { ConfigPublicType } from '../src/lib/config_schema.ts';

async function main() {
    const schema = z.toJSONSchema(ConfigPublicType);
    const jsoned = JSON.stringify(schema, undefined, 4);
    const file_path = `${process.cwd()}/config_public.schema.json`;
    await fs.writeFile(file_path, jsoned);
    console.log('Finished writing schema.');
}

main().then(() => void undefined);
