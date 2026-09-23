---
name: email-writing
description: Write, reply to, and rewrite emails in a specific person's voice. Use whenever the deliverable is an email, a reply, a follow-up, a decline, an apology, a status update, an intro, or a subject line. Pairs with MEMORY.md, which stores the user's identity, voice, and learned preferences so the agent never asks the same question twice.
---

# Email writing

The deliverable is always a **ready-to-send draft**, never advice about how to
write one.

## Load order

1. `MEMORY.md` — who the user is and what they've taught you. Highest authority.
2. This file — the general craft.
3. `reference/templates.md` — shapes for specific email types.
4. `reference/tone.md` — formality ladder and relationship calibration.
5. `reference/checklist.md` — pre-send QA. Run before every output.

## The four-part body

Every email, regardless of type, is:

1. **Anchor** (1 sentence) — why this email exists / what thread it belongs to.
2. **Ask** (1–2 sentences) — the single thing you want, stated plainly.
3. **Enable** (0–4 sentences or bullets) — the minimum context, options, or
   attachments the recipient needs to say yes.
4. **Next step** (1 sentence) — who does what by when. Never "let me know your
   thoughts."

If a draft can't be mapped onto those four parts, it isn't finished.

## Structuring frameworks

Borrowed from the `prompt-engineer` skill's frameworks, mapped to email:

- **RACE** — Role, Action, Context, Expectation. Default for asks and requests.
- **STAR** — Situation, Task, Action, Result. Default for status updates,
  post-mortems, and performance/recap emails.
- **CLEAR** — Concise, Logical, Explicit, Actionable, Relevant. Use as the
  editing pass on any draft.

## Subject lines

- 6–9 words. Specific noun + action or decision needed.
- Front-load the operative word: `Decision needed:`, `Action:`, `FYI:`, `Re:`.
- Never a full sentence, never a question mark alone, never all caps.
- If the email has a deadline, the date belongs in the subject.
- Good: `Contract redlines — need sign-off by Thu`
- Bad: `Quick question` / `Touching base` / `Following up on my last email`

## Length discipline

| Situation | Target |
| --------- | ------ |
| Ask of a busy senior | under 75 words |
| Peer coordination | 75–150 words |
| External / first contact | under 125 words |
| Status update | 150–250 words, bulleted |
| Sensitive (decline, apology, escalation) | short — under 120 words; length reads as defensiveness |

Every sentence over 25 words gets split. Every paragraph over 4 lines gets
broken or bulleted.

## Openers and closers

Kill on sight: *I hope this email finds you well · I wanted to reach out ·
Just checking in · Circling back · Per my last email · Please don't hesitate to
reach out · Thanks in advance* (presumptuous) · *Sorry to bother you.*

Use instead:
- Cold: state the connection or the reason in clause one. `Saw your talk on X —`
- Warm: `Quick one:` / `Two things:` / `Following Tuesday's call,`
- Reply: answer the question first, context second.
- Close: `Happy to jump on a call if faster.` / `No rush — end of week is fine.`
  / `If this isn't you, point me to the right person and I'll take it from there.`

## Voice fidelity

When MEMORY.md contains voice samples, extract and imitate:
- Average sentence length and whether they use fragments.
- Greeting form (`Hi X,` vs `Dear X,` vs no greeting).
- Whether they use contractions, exclamation marks, emoji.
- Their actual recurring phrases — reuse them verbatim.
- Sign-off and signature exactly as written.

Imitating the person beats writing "well." A slightly clumsy sentence in their
voice is better than a polished one in yours.

## Refusals and flags

- No ask → don't draft. Ask what outcome they want.
- Missing fact → `[TODO: ...]` inline, never an invention.
- Legal / HR / financial / safety content → draft it, prefix with
  `⚠ This touches [topic] — consider review before sending.`
- Angry email → draft the calm version, and say so: *"Drafted this cold. Want
  a sharper variant?"*

## After every draft

Run `reference/checklist.md`, then append any new preference learned to
`MEMORY.md` per the learning loop in `agent.md` §3.
