---
title: "Event check-in best practices: 7 mistakes that ruin gate flow (and how to fix them)"
audience: event organizers, conference planners, venue managers
vertical: eventqr
length: ~850 words
status: draft
---

Your gate is the first and last impression of your event. Get it wrong and you have angry attendees, security in panic mode, and a queue snaking down the street. Get it right and even a 5,000-person concert can clear the gate in 15 minutes.

Here are seven mistakes I see at events and what to do instead.

## Mistake 1: Generic QR codes anyone can copy

Most "ticketing" platforms email attendees a QR with their email address encoded inside. That's not a ticket — that's a screenshot anyone can forward. Five attendees with the same screenshot, only one actually paid, and you have no way to tell.

**Fix:** use cryptographically signed tickets. Each QR contains an HMAC signature only your scanner can verify. Counterfeit screenshots get rejected at the gate.

## Mistake 2: Tickets that work forever

A QR generated for last year's event still works on tonight's scanner if you don't check dates. Attendees realise this, and you have ghost entries.

**Fix:** expiry timestamps. Each ticket has a `valid until` field; the scanner refuses anything past it.

## Mistake 3: No way to detect duplicate scans

Even with signed, time-bound tickets, one person can scan the same QR twice — handing it to a friend after entry.

**Fix:** one-time-use codes. Each QR carries a unique nonce. Your scanner records nonces seen; the second scan gets a red flag.

## Mistake 4: Internet dependence

Gate WiFi is unreliable at the worst time. If your scanner needs to ping a server for every ticket, one Wi-Fi hiccup creates a 200-person backup.

**Fix:** scanner runs entirely offline. Validate signatures locally; sync the "seen nonces" list to your server later when WiFi recovers.

## Mistake 5: Manual attendee lookup

Some scanners just decode a ticket ID and require staff to look it up in a list. Staff slow down, look up the wrong row, queue grows.

**Fix:** embed attendee data inside the signed payload. The scanner shows: name, ticket type, table number — all in one screen, no lookup needed.

## Mistake 6: One scanner per gate

You can't scale gate throughput beyond one scanner per gate without coordination. Two scanners on the same gate can let the same ticket in twice.

**Fix:** all scanners share a "seen nonces" list synchronised over local WiFi. Multiple gates, multiple scanners, no duplicates.

## Mistake 7: No analytics on entry timing

You think you know when your peak entry hour is. You probably don't. Without timestamped scan logs you're guessing on next year's staffing.

**Fix:** every scan is logged with a timestamp. Export a CSV after the event and analyze in Excel. Now you'll know to put 4 scanners on the gate at 19:30 instead of 19:00.

---

## What EventQR Suite gives you out of the box

- HMAC-SHA-256 signed tickets (mistake 1 ✓)
- Expiring tickets (mistake 2 ✓)
- One-time-use nonces (mistake 3 ✓)
- Fully offline scanner (mistake 4 ✓)
- Attendee data embedded in QR (mistake 5 ✓)
- Multi-scanner sync over local WiFi (mistake 6 ✓ — optional backend)
- Timestamped scan logs (mistake 7 ✓)

Plus everything from the base bundle: bulk generation, templates, print-ready exports, bilingual UI.

## Pricing

- **Basic** ($2,500): source + 30-day support.
- **Plus** ($3,500): + branding + 90-day support.
- **Lifetime** ($5,500): + 1 year support + custom features.

[See the landing page →](https://eventqr.app)
