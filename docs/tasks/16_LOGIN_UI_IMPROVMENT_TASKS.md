# Login & Sign Up UI Improvement — Tasks

**Source doc:** `docs/16_LOGIN_UI_IMPROVMENT.md`
**Pages:** `/login` (`app/(admin)/login/page.jsx`) · `/signup` (`app/(admin)/signup/page.jsx`)
**Branch:** `fix/login-ui-improvement`
**Status:** ✅ Complete

---

## Notes on Pre-Existing State

- **SEC-01 (GET method):** Already handled — forms use `e.preventDefault()` + Better-Auth JS client. No native form submission occurs.
- **SEC-02 (CSRF):** Already handled — Better-Auth manages CSRF automatically.
- **SEC-10 (Account enumeration):** Error messages should remain generic. Better-Auth returns its own messages; catch and normalize them.
- **SEC-11 (HTTPS):** Already enforced by Vercel in production. No action needed.

---

## Phase 1 — Visual / Layout (Both Pages) ✅

- [x] **T1** — Add full-page background gradient to both `/login` and `/signup` containers
  - Added `.auth-page-bg` utility in `globals.css`; dark override via `.dark .auth-page-bg`

- [x] **T2** — Replace `shadow-2xl` on Card with soft layered custom shadow
  - Added `.auth-card-shadow` utility in `globals.css` with brand-tinted multi-layer shadow

- [x] **T3** — Add subtle purple-tinted card border
  - `border border-violet-200/40 dark:border-violet-500/25` on Card

- [x] **T4** — Expand card max-width from `max-w-md` (448px) to `max-w-[480px]`

- [x] **T5** — Fix icon section: `mb-2` → `mb-4`, added glow ring
  - `shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]` on icon div

- [x] **T6** — Fix `CardTitle` heading semantics
  - Replaced `<CardTitle>` with `<h1 className="text-3xl font-bold gradient-title">` on both pages; removed CardTitle from imports

- [x] **T7** — Improve subtitle contrast
  - `CardDescription className="text-slate-500 dark:text-gray-400"` on both pages

- [x] **T8** — Increase input height and improve input styling
  - Added `h-11 rounded-lg` to all `<Input>` components on both pages

- [x] **T9** — Add consistent form spacing rhythm
  - `space-y-4` → `space-y-5` on form container; field containers use `flex flex-col gap-1.5`

- [x] **T10** — Improve CTA button: transition + tracking + arrow icon
  - Added `transition-all duration-200 tracking-wide` + `<ArrowRight>` icon in non-loading state

- [x] **T11** — Improve toggle link spacing and style
  - CardFooter: `pb-6`; link: `text-violet-600 dark:text-violet-400 underline-offset-2`; also normalised login error to generic message (SEC-10 bonus)

---

## Phase 2 — Login Page Specific Features ✅

- [x] **T12** — Add "Forgot Password?" link below password field on `/login`
  - Placed inline with the Password label (label left, link right) via `flex items-center justify-between`
  - Styled `text-sm text-violet-600 dark:text-violet-400 hover:underline underline-offset-2`
  - Links to `/forgot-password` with `prefetch={false}`; `data-testid="forgot-password-link"` added

- [x] **T13** — Add "Remember Me" checkbox to `/login`
  - State: `const [rememberMe, setRememberMe] = useState(false)`
  - Used shadcn `<Checkbox>` + `<Label htmlFor="remember-me">` with `onCheckedChange`
  - Placed between password field and error alert; `data-testid="remember-me-checkbox"` added
  - UI-only for now — session extension via Better-Auth config is a future enhancement

---

## Phase 3 — Sign Up Page Specific Features ✅

- [x] **T14** — Add "Confirm Password" field to `/signup`
  - State: `const [confirmPassword, setConfirmPassword] = useState("")`
  - `passwordsMatch` derived value drives real-time inline error (`role="alert"`) + red border on input
  - Submit guard: validates match before calling `authClient.signUp.email()`; button also disabled while mismatched
  - `data-testid="confirm-password-input"` + `data-testid="confirm-password-error"` added

- [x] **T15** — Add password strength indicator below password field on `/signup`
  - `getPasswordStrength(pwd)` scores 0–4: length≥8, uppercase, number, special char
  - `strengthConfig` lookup map uses full-string Tailwind classes (`w-1/4 bg-red-500` etc.) — no dynamic class construction
  - Bar + label only render when `password.length > 0`; smooth `transition-all duration-300` on bar width
  - Strength labels: Weak (red) / Fair (orange) / Good (yellow) / Strong (green)
  - Helper text always visible when bar is shown: `"Use 8+ characters with uppercase, numbers & symbols."`
  - `data-testid="password-strength"`, `data-testid="strength-bar"`, `data-testid="strength-label"` added

---

## Phase 4 — Accessibility & Security Hardening ✅

- [x] **T16** — Add password show/hide toggle (eye icon) on both pages
  - Login: `showPassword` state; `Eye`/`EyeOff` button inside `relative div` on password field; `tabIndex={-1}` so it doesn't disrupt tab flow; `aria-label` toggles with state
  - Signup: separate `showPassword` + `showConfirmPassword` states; same pattern on both password fields
  - `data-testid="toggle-password-visibility"` + `data-testid="toggle-confirm-password-visibility"` added

- [x] **T17** — Add `aria-describedby` to inputs pointing to error containers
  - Login: email + password inputs get `aria-describedby="login-error"` and `aria-invalid={!!error}` when error exists
  - Signup: email gets `aria-describedby="signup-error"`; password points to strength container when visible; confirm password points to its inline mismatch error or global error
  - Alert elements now have explicit `role="alert"` for immediate announcement

- [x] **T18** — Normalize error messages *(done in Phase 1)*
  - Login hardcodes `"Invalid email or password. Please try again."` — no leakage

- [x] **T19** — Fix `autocomplete` on login email input *(done in Phase 1)*
  - `autoComplete="username"` on login page email field

- [x] **T20** — Add security headers to `next.config.mjs`
  - `securityHeaders` array added; `headers()` function applies them to `source: "/(.*)"` (all routes)
  - Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Phase 5 — SEO / Metadata ✅

- [x] **T21** — Add page-specific metadata for login and signup
  - Created `app/(admin)/login/layout.js` — title `"Sign In — QA Playground"` + canonical + OG
  - Created `app/(admin)/signup/layout.js` — title `"Create Account — QA Playground"` + canonical + OG
  - Both layouts return `children` directly — no layout wrapping, metadata only

---

## Phase 6 — Dark Mode Refinements ✅

- [x] **T22** — Refine dark mode auth card appearance
  - Card: `dark:bg-[rgba(15,10,30,0.95)]` added to both pages (border-violet-500/25 was already in Phase 1)
  - All inputs: `dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500` on every Input on both pages (confirm password preserves its conditional border-red classes)
  - Subtitle `dark:text-gray-400` — done in Phase 1
  - Background dark gradient — done in Phase 1 via `.dark .auth-page-bg` in globals.css

---

## Progress Summary

| Phase | Tasks | Done |
|-------|-------|------|
| 1 — Visual/Layout | T1–T11 | ✅ 11/11 |
| 2 — Login Features | T12–T13 | ✅ 2/2 |
| 3 — Signup Features | T14–T15 | ✅ 2/2 |
| 4 — A11y & Security | T16–T20 | ✅ 5/5 |
| 5 — SEO/Metadata | T21 | ✅ 1/1 |
| 6 — Dark Mode | T22 | ✅ 1/1 |
| **Total** | | **✅ 22/22** |

---

_Last updated: 2026-03-26_