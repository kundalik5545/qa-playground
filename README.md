# QA Playground

**A purpose-built practice environment for QA automation engineers.**

Practice Selenium, Playwright, and Cypress against realistic, automation-friendly web elements — without fighting with production apps that weren't designed for testing.

[![Live](https://img.shields.io/badge/Live-qaplayground.com-blue)](https://www.qaplayground.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

---

## What is QA Playground?

Most real-world apps aren't built with testability in mind — inconsistent IDs, no `data-testid` attributes, unstable selectors. QA Playground fixes that.

It provides:

- **22 interactive UI elements** — inputs, buttons, tables, calendars, drag-and-drop, alerts, shadow DOM, iframes, and more
- **Bank Demo App** — a full simulated application (login, accounts, dashboard, transactions) for end-to-end automation scenarios
- **Automation-friendly markup** — every element has stable `id`, `data-testid`, and `data-action` attributes
- **Learning content** — markdown-based blog and tutorials on QA automation and JavaScript

---

## Features

### Practice Elements (22 total)

| # | Element | # | Element |
|---|---|---|---|
| 1 | POM (Page Object Model) | 12 | Drop Zone |
| 2 | Inputs | 13 | Sort |
| 3 | Buttons | 14 | Multi-Select |
| 4 | Select / Dropdowns | 15 | Slider |
| 5 | Links | 16 | Waits (explicit/implicit) |
| 6 | Alerts (alert, confirm, prompt) | 17 | Simple Table |
| 7 | iFrames | 18 | Advanced Table |
| 8 | Radio Buttons & Checkboxes | 19 | Calendar / Date Picker |
| 9 | Window / Tab Switching | 20 | Forms |
| 10 | Element Visibility & State | 21 | File Upload / Download |
| 11 | Drag & Drop | 22 | Shadow DOM |

### Bank Demo App (`/bank`)

A simulated banking application for practicing end-to-end test flows:

- Login with session authentication (`admin` / `admin123`)
- Account management — create, edit, delete accounts
- Transaction management — credit/debit, filtering by account/type/date
- Dashboard — balance summary, recent transactions
- 100% client-side (localStorage) — no backend required
- All elements tagged with `id`, `data-testid`, `data-action`

### Blog & Learning Content

- Markdown-based articles on QA automation, Selenium, Playwright, Cypress
- JavaScript learning content for testers
- Syntax-highlighted code examples

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Runtime | React 19 |
| Language | JavaScript / JSX (no TypeScript) |
| Styling | Tailwind CSS 3 + shadcn/ui (new-york) |
| UI Primitives | Radix UI |
| Markdown | unified + remark + rehype pipeline |
| Syntax Highlighting | shiki + rehype-pretty-code |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Google Analytics |

---

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/kundalik5545/qatesting.git
cd qatesting

# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run postbuild  # Generate sitemap (runs automatically after build)
```

---

## Project Structure

```
/
├── app/                    Next.js App Router — all pages and layouts
│   ├── (bank)/             Bank Demo App (/bank)
│   ├── (Practice)/         Practice elements (/practice) + Learn content
│   ├── (admin)/            Static pages (about, contact, privacy)
│   └── (blog)/             Blog index (/blog)
├── components/             Shared React components
│   └── ui/                 shadcn/ui primitives — do not edit manually
├── data/                   Static config and content arrays
├── lib/                    Utility functions (cn(), bankStorage.js)
├── Blog/                   Markdown content (blog posts, element docs)
└── public/                 Static assets
```

Full architecture details: see [`CLAUDE.md`](./CLAUDE.md) and [`AI_CODING_GUIDELINES.md`](./AI_CODING_GUIDELINES.md).

---

## Using the Bank Demo

The Bank Demo App is designed for practicing full end-to-end automation flows.

**Login credentials:**
```
Username: admin
Password: admin123
```

All data is stored in the browser's `localStorage` — no server, no database. Data persists across page refreshes but resets if localStorage is cleared.

---

## Contributing

Contributions are welcome. Before submitting a PR:

1. Follow the component structure patterns documented in `AI_CODING_GUIDELINES.md`
2. Use Tailwind CSS for all styling — no inline styles or CSS Modules
3. Use the `@/` path alias — no relative imports
4. Ensure every new practice element has both a `QAPlayGround` section and a `LearningInsight` section
5. Add `id`, `data-testid`, and `data-action` attributes to all interactive elements
6. Test dark mode — do not break it

### Adding a Practice Element

1. Create a component in `app/(Practice)/practice/_components/YourElementPage.jsx`
2. Add a markdown doc in `Blog/ElementBlogs/your-element.md` with proper frontmatter
3. Register the slug in the `componentMap` in `app/(Practice)/practice/[slug]/page.jsx`
4. Add the element card to the practice hub in `app/(Practice)/practice/page.jsx`

---

## License

This project is currently private. License TBD upon public release.

---

## Links

- **Live app:** [qaplayground.com](https://www.qaplayground.com)
- **Issues:** [GitHub Issues](https://github.com/kundalik5545/qatesting/issues)
- **Support the project:** [Buy Me a Coffee](https://www.buymeacoffee.com)