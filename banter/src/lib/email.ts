import { randomInt } from 'node:crypto';

// Generate a numeric OTP of the given length.
export function randomOtp(len = 6): string {
  let s = '';
  for (let i = 0; i < len; i++) s += String(randomInt(0, 10));
  return s;
}

interface SendOpts {
  to: string;
  subject: string;
  body: string;
}

/**
 * Send a transactional email.
 *
 * In production, set RESEND_API_KEY (and optionally EMAIL_FROM) to deliver via
 * Resend's REST API — no extra dependency needed. In development (no key, not
 * production) we just log the message so the app remains fully usable without
 * an email provider. The caller can reveal a dev code to the client only in
 * dev mode.
 */
export async function sendEmail(opts: SendOpts): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Banter <onboarding@resend.dev>';

  if (!key) {
    console.log(`\n[email:dev] → ${opts.to}\nSubject: ${opts.subject}\n${opts.body}\n`);
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, text: opts.body }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
