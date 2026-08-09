import 'dotenv/config';
import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

export async function migrate() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'active',
      trial_ends_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      ip TEXT
    );
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      relationship TEXT NOT NULL,
      intent TEXT NOT NULL,
      tone TEXT NOT NULL,
      language TEXT NOT NULL,
      context_enc TEXT,
      length TEXT NOT NULL DEFAULT 'medium',
      hurry INTEGER NOT NULL DEFAULT 0,
      result_enc TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(sql`CREATE INDEX IF NOT EXISTS gen_user_idx ON generations (user_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS gen_created_idx ON generations (created_at);`);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS saved_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT,
      content_enc TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(sql`CREATE INDEX IF NOT EXISTS saved_user_idx ON saved_messages (user_id);`);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS mobile_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      device TEXT,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      last_used_at INTEGER,
      revoked_at INTEGER
    );
  `);
  await db.run(sql`ALTER TABLE mobile_tokens ADD COLUMN last_used_at INTEGER;`).catch(() => {});
  await db.run(sql`ALTER TABLE mobile_tokens ADD COLUMN revoked_at INTEGER;`).catch(() => {});
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event_type TEXT NOT NULL,
      source TEXT NOT NULL,
      ip_hash TEXT,
      country TEXT,
      user_agent TEXT,
      success INTEGER NOT NULL DEFAULT 1,
      severity TEXT NOT NULL DEFAULT 'info',
      metadata_json TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(sql`CREATE INDEX IF NOT EXISTS sec_event_created_idx ON security_events (created_at);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS sec_event_type_idx ON security_events (event_type);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS sec_event_user_idx ON security_events (user_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS sec_event_ip_idx ON security_events (ip_hash);`);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      role TEXT,
      rating INTEGER,
      message TEXT NOT NULL,
      email TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.log('[migrate] tables ready');
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
