# AWS Student Builder Group · SKIT — Website

A multi-file rebuild of the club site with updated branding, content, and an interactive terminal chatbot.

## Structure
```
aws-sbg-skit/
├── index.html          # markup + content
├── css/
│   └── style.css        # all styling
├── js/
│   └── script.js        # animations, reveal effects, terminal chatbot
└── assets/
    └── whatsapp-qr.png   # WhatsApp group QR code
```

## What changed from the original
- **Branding**: "AWS Cloud Club" → "AWS Student Builder Group" everywhere (nav badge shortened to "AWS SBG" for space).
- **Events**: heading now reads "Our first year, mapped out." First entry is the Orientation Session (date coming soon), second is a placeholder card for the rest of the year's lineup.
- **Team**: real 6-person core team with LinkedIn/GitHub links. Shlok Shukla also has an AWS Builder ID link. Avatars are still initials — search `TEAM DATA` in `index.html` and swap `.avatar-inner` divs for `<img>` tags once headshots are ready.
- **Join section**: the old application form is replaced with a WhatsApp join card (QR code + button). Social row is now LinkedIn → Instagram → Meetup only.
- **Footer**: replaced the "not officially affiliated" disclaimer with a more confident independent-community line.
- **Copy**: button text and hero eyebrow tweaked to be more energetic; "Recruiting for 2026 batch" pill removed.
- **Terminal**: the old scripted typewriter is now a live, rule-based chatbot (no external AI API). It asks for the visitor's name, greets them, then answers simple keyword-matched questions (`help`, `events`, `team`, `join`, `about`, `socials`, `joke`, `clear`). Logic lives in `js/script.js` under the "interactive terminal chatbot" section.

## To edit later
- **QR code / WhatsApp link**: replace `assets/whatsapp-qr.png` and update the `href` on `.wa-btn` in `index.html` if the group link ever changes.
- **Chatbot answers**: edit the `botReply()` function in `js/script.js` — it's a simple keyword-matching `if` chain, easy to extend.
- **Team photos**: once available, replace the initials markup with `<img src="assets/team/xyz.jpg" alt="...">` inside each `.avatar-inner`.
