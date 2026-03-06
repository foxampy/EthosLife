# EthosLife Documentation — Agent Guidelines

**Directory:** `docs/`  
**Purpose:** Investor documentation, legal agreements, and white papers  
**Last Updated:** March 2026

---

## Document Inventory

### Core Investment Documents

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `WHITEPAPER.md` | EN | Full technical white paper (English) | ✅ **Up-to-date** (23 KB) |
| `WHITEPAPER_RU.md` | RU | Полный технический документ | ✅ **Up-to-date** (987 lines, 54 KB) |
| `WHITEPAPER_RU.pdf` | RU | PDF для печати | ✅ 174 KB |
| `WHITEPAPER.pdf` | EN | PDF for printing | ✅ 135 KB |
| `SAFT.md` | EN/RU | Investment agreement | ✅ **Up-to-date** |
| `LITEPAPER.md` | EN | Executive summary | ✅ Current |
| `PITCH_DECK_2026_V2.md` | RU | Investment presentation | ✅ Current |

### Indices & Navigation

| File | Purpose |
|------|---------|
| `INVESTOR_DOCS_INDEX.md` | Main index for investors (quick access) |
| `INVESTOR_DOCS_INDEX_V2.md` | Extended version with metadata |

---

## Maintenance Guidelines

### When Updating Documents

1. **Source of Truth:** `index.html` (landing page) contains the canonical data:
   - Pre-Seed amount: $140,000 at $0.01
   - Seed Round: $350K-$650K at $0.05
   - MVP Status: 82% ready, 245 components, 84 pages
   - Subscriptions: Free / Pro $29 / Premium $59 / Centers $790
   - ProductHub status: PostureAI Pro 78%, SleepSync 65%, LLM HealthCore 45%

2. **Synchronization Rule:** Update `WHITEPAPER_RU.md` first, then sync to `WHITEPAPER.md`

3. **Financial Projections:** Use 2027 as first revenue year (2026 is foundation year)

### Data Checklist

```
✓ Pre-Seed: $140K at $0.01 (14M tokens to investors)
✓ Seed: $350K-$650K at $0.05 (7M-13M tokens)
✓ Total investor allocation: 20% = 200M tokens
✓ Token supply: 1B UNITY
✓ Vesting: 6-month cliff, 18-month linear (24 months total)
✓ No email addresses in documents (use Telegram: @foxampy)
```

### Architecture Sections to Remove/Minimize

Per user request, remove detailed descriptions of:
- Level 3 (Intelligence Layer) — AI/LLM specifics
- Level 4 (Data Layer) — Database implementation details  
- Level 5 (Blockchain Layer) — Protocol technical details

Keep only: Level 1 (UI) and Level 2 (Application/Modules) descriptions.

---

## PDF Generation

### Prerequisites
```bash
pip install markdown playwright
python -m playwright install chromium
```

### Generate PDF
```bash
python generate_pdf.py
```

Output: `docs/WHITEPAPER_RU.pdf`

---

## Document Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Up-to-date, verified |
| ⚠️ | Needs attention/update |
| 🔄 | In progress |
| ❌ | Deprecated/outdated |

---

## Quick Links

- **Landing Page:** https://ethoslife.onrender.com/
- **MVP Demo:** https://etholife.onrender.com/
- **Contact:** @foxampy (Telegram)

---

*© 2026 EthosLife Inc. — Health is a daily habit.*
