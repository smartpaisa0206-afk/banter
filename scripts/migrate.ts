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

  // Referral columns — safe to re-run (ignored if already present).
  await db.run(sql`ALTER TABLE users ADD COLUMN referral_code TEXT;`).catch(() => {});
  await db.run(sql`ALTER TABLE users ADD COLUMN referred_by TEXT;`).catch(() => {});
  // Backfill a referral code for any existing users (so beta testers can refer).
  await db
    .run(sql`UPDATE users SET referral_code = lower(hex(randomblob(4))) WHERE referral_code IS NULL;`)
    .catch(() => {});
  // Email verification column — new accounts start unverified (0); existing
  // accounts are trusted and backfilled to verified (1).
  await db.run(sql`ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;`).catch(() => {});
  await db.run(sql`UPDATE users SET email_verified = 1 WHERE email_verified = 0;`).catch(() => {});
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
      expires_at INTEGER NOT NULL
    );
  `);
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
