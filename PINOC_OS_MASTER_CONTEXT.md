# Pinoc OS Master Context

## 1. Vision

Pinoc is not a menu website.

Pinoc is a Beverage Discovery Experience, a Digital Barista, and a Journey of Curiosity.

The product should help guests discover drinks through mood, story, taste, and confidence level. It should support both first-time customers who need gentle guidance and specialty enthusiasts who want deeper product knowledge.

## 2. Current Architecture

The operating model is:

```text
Products
  ↓
Publish
  ↓
Menu Items
  ↓
Customer-facing Menu
```

Products represent the underlying specialty materials Pinoc manages, such as coffee beans, matcha, and craft cocoa.

Menu Items represent customer-facing drinks or offerings. A product must be published into a menu item before it appears publicly.

## 3. Current Completed Features

- Supabase persistence
- Product CRUD
- Menu Item CRUD
- Product → Menu Item publishing
- Image upload with Supabase Storage
- Hero content management
- Find Your Cup v1
- Recommendation metadata
- Admin field visibility
- Bilingual UX foundation
- Simple / Expert display mode

## 4. Recommendation Metadata

Menu items support structured recommendation metadata:

- `drink_type`
- `feeling_tags`
- `adventure_level`
- `body_level`
- `comfort_level`
- `intensity_level`
- `flavor_preferences`

These fields power the current Find Your Cup flow and prepare the system for future recommendations, search, filtering, personalization, and AI-assisted guidance.

## 5. Find Your Cup Philosophy

Find Your Cup is not a quiz.

It is a Digital Barista conversation.

The flow should feel like a warm guide helping the customer understand what they want today. It should avoid sounding like a technical form or a generic quiz app.

Current direction:

- 5-question guided journey
- Result title: “Your Cup Today”
- 1 primary recommendation
- 2 secondary recommendations
- Story first
- Price later

The recommendation should explain why the cup fits the customer’s mood, not only list matching tags.

## 6. UX Direction

The customer journey should feel like:

```text
Discover
  ↓
Feel
  ↓
Explore
  ↓
Choose
```

Design should feel like:

- Editorial magazine
- Discovery journal
- Luxury beverage menu
- Travel notebook

Design should not feel like:

- POS system
- Generic cafe website
- Restaurant ordering app

Pinoc should feel premium, calm, personal, and curious.

## 7. Current Priorities

- Stabilize Admin CRUD
- Fix image display on all menu cards
- Improve Hero Experience
- Refine Find Your Cup UX
- Prepare Coffee Passport

## 8. Future Roadmap

- Phase 2: Digital Barista Experience
- Phase 3: Coffee Passport
- Phase 4: Taste Profile
- Phase 5: LINE Login + Personalization

## 9. Development Notes

- Keep Supabase persistence stable.
- Keep mock fallback.
- Run `npm run lint` and `npm run build` after changes.
- Create migrations for schema changes.
- Tell the owner exactly which SQL files to run in Supabase.
- Do not break Product → Menu Item publishing.
- Do not remove existing customer-facing menu functionality while improving discovery.
