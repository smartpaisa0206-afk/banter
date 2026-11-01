import type { GenerateInput } from './generate';
import { normalizeShorthand } from './shorthand';

export type DetectedSituation =
  | 'what_doing'
  | 'food_check'
  | 'late_reply'
  | 'apology'
  | 'not_my_fault'
  | 'dry_reply'
  | 'office_email'
  | 'follow_up'
  | 'leave_request'
  | 'payment_reminder'
  | 'general';

function sampleFromContext(context?: string): string {
  const text = (context || '').trim();
  if (!text) return '';
  const markers = ['CURRENT_USER_TEXT:', 'Current user text:', 'User text:', 'Situation:'];
  for (const marker of markers) {
    const idx = text.lastIndexOf(marker);
    if (idx >= 0) return text.slice(idx + marker.length).trim();
  }
  return text;
}

export function detectSituation(text: string): DetectedSituation {
  const t = text.toLowerCase();

  if (/\b(kkrh|krrh|kya\s*kar|kr\s*rhe|kr\s*rha|kr\s*rhi|wyd|what\s*(are|r)?\s*(you|u)?\s*doing)\b/i.test(t)) return 'what_doing';
  if (/\b(khna|khana|kha\s*liya|khya\s*liya|eat|ate|lunch|dinner|breakfast)\b/i.test(t)) return 'food_check';
  if (/\b(late|forgot|reply|busy|sorry\s*busy|2\s*days|didn'?t\s*reply)\b/i.test(t)) return 'late_reply';
  if (/\b(sorry|apolog|galti|mistake|maaf|my\s*bad)\b/i.test(t)) return 'apology';
  if (/\b(not\s*my\s*fault|my\s*fault\s*nahi|meri\s*galti\s*nahi|didn'?t\s*do|not\s*done\s*by\s*me)\b/i.test(t)) return 'not_my_fault';
  if (/\b(just\s*ok|only\s*ok|dry\s*reply|replied\s*ok|sirf\s*ok)\b/i.test(t)) return 'dry_reply';
  if (/\b(mail|email|formal|client|manager|sir|madam|parts|error|issue|book|booked|not\s*booked)\b/i.test(t)) return 'office_email';
  if (/\b(follow\s*up|update|any\s*update|reminder|checking\s*in)\b/i.test(t)) return 'follow_up';
  if (/\b(leave|holiday|sick|absent|wfh|work\s*from\s*home)\b/i.test(t)) return 'leave_request';
  if (/\b(payment|invoice|amount|due|pending|paid|unpaid)\b/i.test(t)) return 'payment_reminder';

  return 'general';
}

function examplesFor(situation: DetectedSituation, style: string): string {
  const hinglish = style === 'roman_hinglish';

  if (hinglish) {
    switch (situation) {
      case 'what_doing':
        return `Examples of good Roman Hinglish outputs:\n- kuch khaas nahi, tu bata?\n- bas chill kar raha hu, tu kya kar raha?\n- abhi free hu, bol kya scene hai?`;
      case 'food_check':
        return `Examples of good Roman Hinglish outputs:\n- haan kha liya, tumne?\n- abhi nahi, thodi der me\n- haan yaar, tu bata?`;
      case 'late_reply':
        return `Examples of good Roman Hinglish outputs:\n- sorry yaar, thoda busy ho gaya tha\n- my bad, reply late ho gaya\n- ignore nahi kar raha tha, bas kaam me atak gaya tha`;
      case 'apology':
        return `Examples of good Roman Hinglish outputs:\n- sorry, mera tone thoda galat tha\n- haan meri galti thi, next time dhyan rakhunga\n- sorry yaar, aise bolna nahi chahiye tha`;
      case 'not_my_fault':
        return `Examples of good Roman Hinglish outputs:\n- samajh raha hu, but ye meri taraf se nahi hua\n- main clear kar du, ye mistake meri nahi thi\n- mujhe blame mat samjho, issue kahin aur se aaya hai`;
      case 'dry_reply':
        return `Examples of good Roman Hinglish outputs:\n- bas ok? itna dry kyu 😭\n- ok me bhi pura suspense hai\n- acha, but asli baat kya hai?`;
      default:
        return `Examples of good Roman Hinglish style:\n- short, natural, casual\n- no formal Hindi\n- use words like yaar/acha only if natural`;
    }
  }

  switch (situation) {
    case 'what_doing':
      return `Examples of good English outputs:\n- Not much, what about you?\n- Just chilling for a bit. You?\n- I’m free right now, what’s up?`;
    case 'food_check':
      return `Examples of good English outputs:\n- Yeah, I ate. Did you?\n- Not yet, I’ll eat in a bit.\n- Yep, what about you?`;
    case 'late_reply':
      return `Examples of good English outputs:\n- Sorry, I got caught up. Didn’t mean to ignore you.\n- My bad, I should’ve replied earlier.\n- Sorry for the late reply, the day got hectic.`;
    case 'apology':
      return `Examples of good English outputs:\n- I’m sorry, I shouldn’t have said it that way.\n- You’re right, that was my mistake. I’ll be more careful.\n- I’m sorry for how that came across.`;
    case 'not_my_fault':
      return `Examples of good English outputs:\n- I understand the concern, but I want to clarify that this wasn’t from my side.\n- Just to be clear, I wasn’t responsible for that issue.\n- I get why it looks that way, but this wasn’t caused by me.`;
    case 'dry_reply':
      return `Examples of good English outputs:\n- That “ok” feels a little mysterious. What happened?\n- Just “ok”? Now I’m curious.\n- Fair, but what do you actually mean?`;
    case 'office_email':
      return `Professional examples:\n- Subject should be clear and short.\n- Body should be polite, factual, and no emojis.\n- Avoid blame; clarify the issue and next step.`;
    default:
      return `Good output examples:\n- short, clear, natural\n- no robotic phrases\n- no overdramatic or poetic lines`;
  }
}

export function buildSuggestionQualityBlock(input: GenerateInput): string {
  const sample = sampleFromContext(input.context);
  const shorthand = normalizeShorthand(sample);
  const situation = detectSituation(sample);
  const style = shorthand.style === 'roman_hinglish' ? 'roman_hinglish' : shorthand.style === 'english' ? 'english' : 'auto';
  const examples = examplesFor(situation, style);

  const shorthandBlock = shorthand.style !== 'none'
    ? `\nShorthand detected:\nOriginal: ${shorthand.original}\nInterpreted meaning: ${shorthand.interpreted}\nDetected style: ${shorthand.style}`
    : '';

  return `\nSuggestion quality rules:\n- Sound human, not robotic.\n- No cringe, no poetry, no over-explaining.\n- Do not add fake details.\n- If the current text is short, keep suggestions short.\n- Give sendable messages, not advice.\n- For professional/work messages: no emojis unless explicitly requested.\n- For casual messages: emoji max 1 and only if natural.\nDetected situation: ${situation}.${shorthandBlock}\n${examples}\n`;
}
