import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const url = process.env.DATABASE_URL || 'file:./banter.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = authToken
  ? createClient({ url, authToken })
  : createClient({ url });

export const db = drizzle(client, { schema });
export { schema };
