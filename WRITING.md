# Writing on this site

Rules for every piece of visitor-facing copy: pages, paper and project write-ups, CV text,
meta descriptions, alt text. Agents editing the site must follow them. Repo docs (README,
PRODUCT, DESIGN, code comments) are exempt.

The base is shandley's [human-writing guide](https://github.com/shandley/claude-style-guide/blob/main/.claude/skills/human-writing/SKILL.md):
its word, phrase, hedge, punctuation, and paragraph rules all apply. Where this file and that
guide disagree, the guide wins, except for the rules Dario set below. Medium sentences of 11-25
words, paragraphs of 3-5 sentences, passive voice allowed.

## Rules Dario set

- Describe what is there. Never justify something absent ("so there is no banner", "no ads",
  "nothing is sold") and never refer to an earlier version of the site. Visitors only see the
  present site.
- No "What is X / What is Y" headings and no bold-label lists ("**Speed:** ..."). Use plain topic
  headings and sentences.
- Split ", and" chains. A period and a new sentence usually read better.
- No "X rather than Y" or "X instead of Y" contrasts unless the reader actually believes X.
- No evaluative verbs borrowed from benchmarks or reviews where a plain verb works: "scored",
  "lands", "surfaces", "hits". Say what happened.
- No anthropomorphism. Models, methods, data, and objects do not have habits, feelings, wants,
  opinions, or lessons. "A single judge brings its own habits" becomes "a single judge adds its
  own bias". "The column carries a lesson" becomes "the column shows". Papers stay technical.
- Light touch: propose rewrites as before/after before applying them.

## Structures that mark text as machine-written

- Not X but Y, in every form: "not just X, it's Y", "This isn't about X. It's about Y.",
  "No X. No Y. Just Z.", a clipped tail like "..., no guessing".
- One-line closers that restate the paragraph ("That matters.", "That's the whole game.").
- Staged openers: "Here's the thing", "Here's where it gets interesting", "Let's break it down",
  "The point is", "When it comes to", "At its core".
- Forced triads: three items because three sounds complete.
- Four or more short declaratives in a row.
- Crowned superlatives: "the one that surprised me most", "the best thing you can do is".
- Announcing structure before delivering it, and restating a question before answering.
- Answering objections nobody raised ("To be clear", "I'm not saying").
- Stacked hedges: "could potentially", "may arguably".

## Punctuation and formatting

- No em or en dashes. Use a comma, colon, parentheses, or a new sentence.
- Few semicolons and colons. Two sentences usually read better.
- Bullets only for truly parallel items. Prose otherwise.
- Sentence case headings, no emojis, no horizontal rules between sections.
- ASCII quotes.

## Words and phrases to replace

Use the plain word. Technical senses are fine (a "robust estimator", a "loss landscape").

| Avoid | Use |
|---|---|
| robust, comprehensive, holistic, seamless (figurative) | strong, complete, or cut |
| nuanced, multifaceted, intricate | subtle, complex, detailed |
| crucial, pivotal, key (adjective), noteworthy | important, or cut |
| leverage, utilize, harness, facilitate | use, help |
| delve, dive into, unpack, explore (figurative) | look at, explain |
| underscore, highlight, showcase (verbs) | show |
| surface (verb), land(s), hit(s) hardest | show, find, reach, affect |
| foster, cultivate | help, build |
| landscape, realm, tapestry, paradigm (figurative) | field, area, approach |
| testament to, serves as, stands as, boasts | is, has, shows |
| shed light on, pave the way | explain, make possible |
| transformative, groundbreaking, cutting-edge, game-changing | cut, or give the fact |
| quietly, notably, essentially, fundamentally, in essence | cut |
| typically, potentially (as hedges) | cut, or keep only real doubt |
| it's worth noting, it's important to note, worth [X]ing | cut |
| load-bearing, the engine, the physics of, lives in (metaphors) | say what it does |
| hold, carry, sit with, turns on (abstract metaphors) | believe, keep, depends on |
| the whole [X], the only thing that matters | cut |
| honest, honestly (about one's own claims) | cut |

## Sources

- Wikipedia, [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [Claudisms](https://claudisms.ai/), a banlist of Claude writing tells
- shandley, [Human writing style guide](https://www.skills.lc/shandley/claude-style-guide/shandley-claude-style-guide-claude-skills-human-writing-skill-md) (frequency ratios against human text)
- [declauding v0.13.0](https://aiweekly.co/alerts/declauding-v0130-ships-taxonomy-of-52-llm-writing-tics), a taxonomy of 52 LLM tics
