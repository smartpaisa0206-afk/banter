import 'dotenv/config';
import crypto from 'node:crypto';
import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@banter.app';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) {
    console.log('[seed] admin already exists:', email);
    return;
  }
  const { hash, salt } = hashPassword(password);
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    passwordHash: hash,
    salt,
    role: 'admin',
    status: 'active',
    createdAt: Date.now(),
  });
  console.log('[seed] admin created:', email);
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
