# Login & Sign Up UI Improvement — Tasks

**Source doc:** `docs/16_LOGIN_UI_IMPROVMENT.md`
**Pages:** `/login` (`app/(admin)/login/page.jsx`) · `/signup` (`app/(admin)/signup/page.jsx`)
**Branch:** `fix/login-ui-improvement`
**Status:** 🔄 In Progress

---

## Notes on Pre-Existing State

- **SEC-01 (GET method):** Already handled — forms use `e.preventDefault()` + Better-Auth JS client. No native form submission occurs.
- **SEC-02 (CSRF):** Already handled — Better-Auth manages CSRF automatically.
- **SEC-10 (Account enumeration):** Error messages should remain generic. Better-Auth returns its own messages; catch and normalize them.
- **SEC-11 (HTTPS):** Already enforced by Vercel in production. No action needed.

---

## Phase 1 — Visual / Layout (Both Pages)

- [ ] **T1** — Add full-page background gradient to both `/login` and `/signup` containers
  - Light: `linear-gradient(135deg, #f0f4ff 0%, #faf0ff 50%, #f0f9ff 100%)`
  - Dark: `from-[#0a0a1a] to-[#0f0520]` (use Tailwind dark: variants)

- [ ] **T2** — Replace `shadow-2xl` on Card with soft layered custom shadow
  - Use inline `style` or a Tailwind `shadow` custom class
  - Target: `0 4px 6px -1px rgba(99,102,241,0.08), 0 10px 30px -5px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.05)`

- [ ] **T3** — Add subtle purple-tinted card border
  - Replace generic `border` with `border border-violet-200/40 dark:border-violet-500/25`

- [ ] **T4** — Expand card max-width from `max-w-md` (448px) to `max-w-[480px]`

- [ ] **T5** — Fix icon section: increase `mb-2` → `mb-4`, add glow ring
  - Add `ring-[6px] ring-violet-500/12 shadow-[0_4px_12px_rgba(124,58,237,0.25)]` to icon wrapper div

- [ ] **T6** — Fix `CardTitle` heading semantics — wrap content in `<h1>` or use `asChild` with `<h1>`
  - Target: `<h1 className="text-3xl font-bold gradient-title">`
  - Applies to both login ("Sign In") and signup ("Create Account")

- [ ] **T7** — Improve subtitle contrast
  - Change `CardDescription` text color: `text-slate-500 dark:text-gray-400` (darken from muted-foreground)

- [ ] **T8** — Increase input height and improve input styling
  - Add `h-11` (44px) class to all `<Input>` components
  - Add `rounded-lg` (8px) to align with card radius
  - Focus ring: `focus-visible:ring-violet-500/30 focus-visible:border-violet-500`

- [ ] **T9** — Add consistent form spacing rhythm
  - Change `space-y-4` → `space-y-5` on form container
  - Wrap each label+input pair in `<div className="flex flex-col gap-1.5">`

- [ ] **T10** — Improve CTA button: add transition, letter-spacing, and icon
  - Add `transition-all duration-200 tracking-wide` to button className
  - Add arrow icon (`→` via `ArrowRight` lucide icon) in non-loading state

- [ ] **T11** — Improve toggle link spacing and style
  - CardFooter: increase top margin with `pt-2 pb-4` or `mt-6` on the `<p>`
  - Link style: add `underline-offset-2 hover:underline` and `font-medium`

---

## Phase 2 — Login Page Specific Features

- [ ] **T12** — Add "Forgot Password?" link below password field on `/login`
  - Add `<div className="flex justify-end">` with link styled `text-sm text-violet-600 hover:underline`
  - Link to `/forgot-password` (page doesn't need to exist yet — add link only)

- [ ] **T13** — Add "Remember Me" checkbox to `/login`
  - Add between password field and error alert
  - State: `const [rememberMe, setRememberMe] = useState(false)`
  - Style: `flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400`

---

## Phase 3 — Sign Up Page Specific Features

- [ ] **T14** — Add "Confirm Password" field to `/signup`
  - New state: `const [confirmPassword, setConfirmPassword] = useState("")`
  - Validate match before calling `authClient.signUp.email()` — show inline error if mismatch
  - Error: `"Passwords do not match."`

- [ ] **T15** — Add password strength indicator below password field on `/signup`
  - Show a 4-segment bar: Weak / Fair / Good / Strong
  - Logic: score based on length ≥8, has uppercase, has number, has special char
  - Colors: red → orange → yellow → green
  - Show helper text: `"Use 8+ characters with letters, numbers & symbols."`

---

## Phase 4 — Accessibility & Security Hardening

- [ ] **T16** — Add password show/hide toggle (eye icon) on both pages
  - State: `const [showPassword, setShowPassword] = useState(false)`
  - Wrap input in `relative div`, add `<button type="button">` with `Eye`/`EyeOff` from lucide-react
  - Toggle `type="password"` / `type="text"`
  - Applies to: login password, signup password, signup confirm password

- [ ] **T17** — Add `aria-describedby` to email and password inputs pointing to error containers
  - `aria-describedby="email-error"` on email input; `<p id="email-error" role="alert">` for field-level error
  - For now, wire to the existing Alert error — it already has `id="login-error"` / `id="signup-error"`

- [ ] **T18** — Normalize error messages to prevent account enumeration
  - On login: catch all `authError` responses → always show `"Invalid email or password. Please try again."`
  - Do not surface "user not found" vs "wrong password" differently

- [ ] **T19** — Fix `autocomplete` on login email input
  - Change `autoComplete="email"` → `autoComplete="username"` on login page only (per WCAG/spec)

- [ ] **T20** — Add security headers to `next.config.mjs`
  - Add `X-Frame-Options: DENY`
  - Add `Content-Security-Policy: frame-ancestors 'none'`
  - Add `X-Content-Type-Options: nosniff`
  - Use `headers()` function in next.config.mjs

---

## Phase 5 — SEO / Metadata

- [ ] **T21** — Add page-specific metadata for login and signup
  - Create `app/(admin)/login/layout.js` exporting `metadata` with title `"Sign In — QA Playground"`
  - Create `app/(admin)/signup/layout.js` exporting `metadata` with title `"Create Account — QA Playground"`

---

## Phase 6 — Dark Mode Refinements

- [ ] **T22** — Refine dark mode auth card appearance
  - Card: `dark:bg-[rgba(15,10,30,0.95)] dark:border-violet-500/25`
  - Inputs: `dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500`
  - Subtitle: `dark:text-gray-400`
  - Background: add `dark:from-[#0a0a1a] dark:to-[#0f0520]` on page container

---

## Progress Summary

| Phase | Tasks | Done |
|-------|-------|------|
| 1 — Visual/Layout | T1–T11 | 0/11 |
| 2 — Login Features | T12–T13 | 0/2 |
| 3 — Signup Features | T14–T15 | 0/2 |
| 4 — A11y & Security | T16–T20 | 0/5 |
| 5 — SEO/Metadata | T21 | 0/1 |
| 6 — Dark Mode | T22 | 0/1 |
| **Total** | | **0/22** |

---

_Last updated: 2026-03-26_