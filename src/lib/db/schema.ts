import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  role: text('role').notNull().default('free'), // free | basic | premium | admin
  status: text('status').notNull().default('active'), // active | banned
  trialEndsAt: integer('trial_ends_at'), // keyboard trial (phase 2)
  createdAt: integer('created_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
  ip: text('ip'),
});

export const generations = sqliteTable(
  'generations',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    relationship: text('relationship').notNull(),
    intent: text('intent').notNull(),
    tone: text('tone').notNull(),
    language: text('language').notNull(),
    contextEnc: text('context_enc'), // encrypted at rest
    length: text('length').notNull().default('medium'),
    hurry: integer('hurry', { mode: 'boolean' }).notNull().default(false),
    resultEnc: text('result_enc').notNull(), // encrypted JSON
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({
    userIdx: index('gen_user_idx').on(t.userId),
    createdIdx: index('gen_created_idx').on(t.createdAt),
  }),
);

export const savedMessages = sqliteTable(
  'saved_messages',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title'),
    contentEnc: text('content_enc').notNull(), // encrypted at rest
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({ userIdx: index('saved_user_idx').on(t.userId) }),
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// Device tokens for the native Android keyboard (Phase 2). The keyboard cannot
// use httpOnly cookies, so it authenticates with a bearer token instead.
export const mobileTokens = sqliteTable('mobile_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  device: text('device'),
  createdAt: integer('created_at').notNull(),
  expiresAt: integer('expires_at').notNull(),
});

// User feedback / bug reports.
export const feedback = sqliteTable('feedback', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  role: text('role'),
  rating: integer('rating'),
  message: text('message').notNull(),
  email: text('email'),
  createdAt: integer('created_at').notNull(),
});

// One-time email login codes (magic-code / OTP). Short-lived.
export const otpCodes = sqliteTable('otp_codes', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
});
