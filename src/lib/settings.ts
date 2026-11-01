import { db } from './db';
import { settings } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string, def: string): Promise<string> {
  const r = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, key)).limit(1);
  return r[0]?.value ?? def;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}
