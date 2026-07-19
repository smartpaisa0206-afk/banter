export type IntentCategory = 'relationship' | 'works';

// How the generated result should be laid out in the UI. Driving this from the
// intent (not the prompt alone) is what makes "pick mail / notice → format
// changes" actually visible and reliable.
export type OutputFormat = 'chat' | 'email' | 'social' | 'notice' | 'document';

export interface IntentConfig {
  id: string;
  label: string;
  category: IntentCategory;
  tier: 'all' | 'basic';
  tip: string;
  sensitive?: boolean;
  coach?: string;
  examples: string[];
  intimacy?: boolean;
  group?: string;
  // Explicit layout override (e.g. a formal notice). When absent we derive it
  // from the intent's category + group in outputFormat().
  format?: OutputFormat;
}

export const RELATIONSHIP_INTENTS: IntentConfig[] = [
  {
    id: 'flirt',
    label: 'Flirt',
    category: 'relationship',
    tier: 'all',
    intimacy: true,
    tip: 'Make it specific and about them — not a generic line.',
    sensitive: true,
    coach:
      'Flirting lands as warmth or pressure in the first line. Genuine interest reads better than recycled lines. Keep it tasteful — suggest connection and closeness, never anything crude.',
    examples: ['Text after a great date', 'Keep a convo playful'],
  },
  {
    id: 'icebreaker',
    label: 'Start a conversation',
    category: 'relationship',
    tier: 'all',
    tip: 'Open with something about the moment or a small question.',
    examples: ['Message a new match', 'Break the silence with a friend'],
  },
  {
    id: 'apologize',
    label: 'Apologize',
    category: 'relationship',
    tier: 'all',
    sensitive: true,
    coach: 'A careless apology reads like an excuse. Own it and name the fix — that rebuilds trust.',
    tip: 'Own the mistake, name what you’ll do differently.',
    examples: ['Snapped at them', 'Forgot something important'],
  },
  {
    id: 'ask_out',
    label: 'Ask them out',
    category: 'relationship',
    tier: 'all',
    tip: 'Be clear about the plan and the time.',
    examples: ['First date ask', 'Re-ask after a while'],
  },
  {
    id: 'set_boundary',
    label: 'Set a boundary',
    category: 'relationship',
    tier: 'all',
    sensitive: true,
    coach: 'Boundaries said with guilt read as negotiable. State them calmly, without apology, and they get respected.',
    tip: 'State the limit plainly; no over-explaining.',
    examples: ['Need space', 'Can’t talk late'],
  },
  {
    id: 'check_in',
    label: 'Check in',
    category: 'relationship',
    tier: 'all',
    sensitive: true,
    coach: 'A real check-in can save a bond; a performative one feels like pity. Ask how they’re really doing.',
    tip: 'Ask how they’re actually doing, and listen.',
    examples: ['After a rough week', 'Friend went quiet'],
  },
  {
    id: 'congratulate',
    label: 'Congratulate',
    category: 'relationship',
    tier: 'all',
    tip: 'Be specific about what you’re happy for.',
    examples: ['New job', 'Big win'],
  },
  {
    id: 'negotiate',
    label: 'Negotiate',
    category: 'relationship',
    tier: 'all',
    tip: 'Name what you want and what you can offer.',
    examples: ['Split chores', 'Plan a trip'],
  },
  {
    id: 'break_news',
    label: 'Break difficult news',
    category: 'relationship',
    tier: 'all',
    sensitive: true,
    coach: 'Bad news buried in small talk feels like an ambush. Directness plus space to react is kinder.',
    tip: 'Lead with the facts, then make room for their reaction.',
    examples: ['Delay bad news', 'Money stress'],
  },
  {
    id: 'thank',
    label: 'Thank someone',
    category: 'relationship',
    tier: 'all',
    tip: 'Say exactly what you appreciated.',
    examples: ['For showing up', 'For help'],
  },
  {
    id: 'invite',
    label: 'Send an invite',
    category: 'relationship',
    tier: 'all',
    tip: 'Give the what, when, where clearly.',
    examples: ['Party', 'Hangout'],
  },
  {
    id: 'confront',
    label: 'Confront calmly',
    category: 'relationship',
    tier: 'all',
    sensitive: true,
    coach: 'Attack the problem, not the person. Name the behaviour and its impact, not their character.',
    tip: 'Describe the behaviour and its impact, then what you need.',
    examples: ['They cancelled last minute', 'Broken promise'],
  },
];

export const WORKS_INTENTS: IntentConfig[] = [
  // A. Emails
  { id: 'email_professional', label: 'Professional email', category: 'works', tier: 'basic', group: 'Emails', tip: 'Lead with the point, keep it short.', examples: ['Update to boss', 'Reply to a client'] },
  { id: 'email_followup', label: 'Follow-up email', category: 'works', tier: 'basic', group: 'Emails', tip: 'Reference the last touch and ask a clear next step.', examples: ['After no reply', 'Chase an invoice'] },
  { id: 'email_cold', label: 'Cold outreach', category: 'works', tier: 'basic', group: 'Emails', tip: 'Show you know them, then one clear ask.', examples: ['Pitch a client', 'New collaboration'] },
  { id: 'email_complaint', label: 'Complaint email', category: 'works', tier: 'basic', group: 'Emails', tip: 'Stick to facts and the fix you want.', examples: ['Bad product', 'Late delivery'] },
  { id: 'email_thanks', label: 'Thank-you email', category: 'works', tier: 'basic', group: 'Emails', tip: 'Specific gratitude lands best.', examples: ['After an intro', 'For mentorship'] },
  { id: 'email_leave', label: 'Leave / time-off request', category: 'works', tier: 'basic', group: 'Emails', tip: 'Dates + a note on coverage.', examples: ['Vacation request', 'Wfh day'] },
  { id: 'email_resign', label: 'Resignation email', category: 'works', tier: 'basic', group: 'Emails', tip: 'Grateful, brief, with last day.', examples: ['Standard resign', 'Short notice'] },
  // B. Social
  { id: 'social_instagram', label: 'Instagram caption', category: 'works', tier: 'basic', group: 'Social', tip: 'Hook in the first line.', examples: ['Travel post', 'Product drop'] },
  { id: 'social_tweet', label: 'Tweet / X post', category: 'works', tier: 'basic', group: 'Social', tip: 'One sharp thought, under the limit.', examples: ['Hot take', 'Announcement'] },
  { id: 'social_linkedin', label: 'LinkedIn post', category: 'works', tier: 'basic', group: 'Social', tip: 'Lead with the lesson or win.', examples: ['Career milestone', 'Industry take'] },
  { id: 'social_facebook', label: 'Facebook post', category: 'works', tier: 'basic', group: 'Social', tip: 'Conversational and warm.', examples: ['Life update', 'Event'] },
  { id: 'social_story', label: 'Story idea / hook', category: 'works', tier: 'basic', group: 'Social', tip: 'Open with curiosity.', examples: ['Reel hook', 'Poll idea'] },
  { id: 'social_reel', label: 'Reel / short script', category: 'works', tier: 'basic', group: 'Social', tip: 'First 2 seconds must hook.', examples: ['Tutorial', 'Behind the scenes'] },
  // C. Marketing
  { id: 'ad_copy', label: 'Ad copy', category: 'works', tier: 'basic', group: 'Marketing', tip: 'Benefit first, one CTA.', examples: ['Meta ad', 'Search ad'] },
  { id: 'product_desc', label: 'Product description', category: 'works', tier: 'basic', group: 'Marketing', tip: 'Describe the outcome, not the specs.', examples: ['New gadget', 'Service'] },
  { id: 'tagline', label: 'Tagline / slogan', category: 'works', tier: 'basic', group: 'Marketing', tip: 'Short, memorable, benefit-led.', examples: ['Brand line', 'Campaign'] },
  { id: 'landing_hero', label: 'Landing page hero', category: 'works', tier: 'basic', group: 'Marketing', tip: 'One promise + one proof.', examples: ['SaaS', 'App'] },
  { id: 'pitch_text', label: 'Pitch / investor text', category: 'works', tier: 'basic', group: 'Marketing', tip: 'Problem, solution, why now.', examples: ['Seed pitch', 'Grant'] },
  { id: 'brochure', label: 'Brochure / leaflet copy', category: 'works', tier: 'basic', group: 'Marketing', tip: 'Scan-able sections, one ask.', examples: ['Event', 'Service'] },
  // D. Personal
  { id: 'invite_event', label: 'Event invitation', category: 'works', tier: 'basic', group: 'Personal', tip: 'What, when, where, why.', examples: ['Birthday', 'Housewarming'] },
  { id: 'greeting', label: 'Occasion greeting', category: 'works', tier: 'basic', group: 'Personal', tip: 'Warm + personal.', examples: ['Festival', 'New year'] },
  { id: 'condolence', label: 'Condolence message', category: 'works', tier: 'basic', group: 'Personal', tip: 'Simple, sincere, no fixing.', examples: ['Loss', 'Sympathy'] },
  { id: 'speech_toast', label: 'Speech / toast', category: 'works', tier: 'basic', group: 'Personal', tip: 'One story, one wish.', examples: ['Wedding toast', 'Farewell'] },
  { id: 'bio', label: 'Bio (personal/pro)', category: 'works', tier: 'basic', group: 'Personal', tip: 'Who you help + how.', examples: ['Social bio', 'About page'] },
  { id: 'rec_letter', label: 'Recommendation letter', category: 'works', tier: 'basic', group: 'Personal', tip: 'Specific example + clear endorsement.', examples: ['Colleague', 'Student'] },
  // E. Office
  { id: 'meeting_agenda', label: 'Meeting agenda', category: 'works', tier: 'basic', group: 'Office', tip: '3-5 items, owner each.', examples: ['Team sync', 'Client call'] },
  { id: 'status_update', label: 'Status update', category: 'works', tier: 'basic', group: 'Office', tip: 'Progress, blockers, next.', examples: ['To boss', 'To client'] },
  { id: 'proposal', label: 'Proposal', category: 'works', tier: 'basic', group: 'Office', tip: 'Problem, approach, price.', examples: ['Client proposal', 'Internal'] },
  { id: 'report_summary', label: 'Report summary', category: 'works', tier: 'basic', group: 'Office', tip: 'Lead with the conclusion.', examples: ['Quarterly', 'Project'] },
  { id: 'cover_letter', label: 'Cover letter', category: 'works', tier: 'basic', group: 'Office', tip: 'Why you + proof.', examples: ['Job apply', 'Referral'] },
  { id: 'resume_bullets', label: 'Resume bullet points', category: 'works', tier: 'basic', group: 'Office', tip: 'Action + result + number.', examples: ['Experience', 'Achievements'] },
  // F. Notice
  { id: 'notice_announce', label: 'Notice / announcement', category: 'works', tier: 'basic', group: 'Office', format: 'notice', tip: 'State the decision clearly — who, what, and when. Keep it formal.', examples: ['Team notice', 'Policy update'] },
];

/**
 * Resolve the layout the result should use. Relationship intents are "chat";
 * works intents derive their format from their group unless explicitly
 * overridden (e.g. the formal-notice intent).
 */
export function outputFormat(intent?: IntentConfig | null): OutputFormat {
  if (!intent) return 'chat';
  if (intent.format) return intent.format;
  if (intent.category === 'relationship') return 'chat';
  switch (intent.group) {
    case 'Emails':
      return 'email';
    case 'Social':
    case 'Marketing':
      return 'social';
    case 'Personal':
    case 'Office':
      return 'document';
    default:
      return 'chat';
  }
}

export const ALL_INTENTS = [...RELATIONSHIP_INTENTS, ...WORKS_INTENTS];
export const WORKS_GROUPS = ['Emails', 'Social', 'Marketing', 'Personal', 'Office'];

export function intentById(id: string) {
  return ALL_INTENTS.find((i) => i.id === id);
}
export function intentLabel(id: string) {
  return intentById(id)?.label || id;
}
export function intentAccessible(id: string, role: string) {
  const i = intentById(id);
  if (!i) return false;
  if (i.tier === 'all') return true;
  return role !== 'free';
}
