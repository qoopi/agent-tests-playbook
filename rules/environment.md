# Environment rules
<!-- version: 2026-09-23 -->

## Purpose
What we may do on the target, where secrets live, and how data and external sites are treated. Loaded by every agent, by `/init-project` and by `bootstrap`.

## Rules
1. Know the target before the first action: base URL, whether it is production, staging or local, and what we may do there. It is written in the requirements handoff, and `TEST_ENV` in `.env` names it for the config, which reads that environment's `BASE_URL_<NAME>`.
2. Production is read-only: no accounts created, no bids, purchases, messages, or forms that create data. Searching, filtering and opening pages are fine. Logging in on production needs a test account named in the brief, and stays read-only after login. The test account is password-based with MFA off; an SSO or MFA account makes login not verifiable.
3. Anything that writes needs staging and a test account. Without them, the criterion is marked not verifiable with the reason, and the human is asked. Never work around it. Writing tests on staging run with one worker, or one account per worker.
4. Base URLs, one `BASE_URL_<NAME>` per environment, and credentials live in `.env`, loaded by the config. `.env` is never committed, never printed, never opened by an agent tool. `.env.example` lists the names with empty values. The config throws when the current environment's base URL or a credential the setup project needs is missing; never a fallback URL.
5. Secrets never appear in a handoff, a report, a commit or a quoted output. Traces, HAR files and screenshots of a logged-in session carry session tokens: they stay in the private artifact store and are quoted only by the lines that carry the signal. Redact before quoting.
6. Logged-in state is a fixture: sign in once in a setup project, save the storage state, reuse it. The state file is a live credential: it lives under the gitignored `.playwright/auth/`, is never opened, quoted or committed, and is removed when the run ends. Never a login in every test, never credentials in a spec.
7. Every test brings its own data, named in the plan. Data on the target that changes per visit is asserted by shape. Data on the target that other tests or people can change is a risk written in the plan. Personal data read on the target, such as seller names, contacts or addresses, never lands in a plan, a map, an expectation or a handoff; assert by shape or use a synthetic value.
8. On an external site we are a guest: the worker cap in the config stays on, and no test hits one endpoint in a loop. Rate limits are an environment cause, reported, not fought.
9. A 403 or a challenge page stops the run. Headed mode, a real Chrome channel or an allow-listed address are options for the human to choose; a headed pass does not carry to headless CI, which needs a virtual display or an allow-listed address. Never try to get around a challenge.
10. Runs must match across machines: the config pins viewport, device scale factor, timezone and locale; the lockfile is committed, and every machine installs with `bun install --frozen-lockfile` and browsers at the locked Playwright version. A difference between local and CI is recorded with its cause, never shrugged off.

## `.env.example`
```
TEST_ENV=
BASE_URL_PR=
BASE_URL_STAGING=
BASE_URL_PROD=
TEST_USER_EMAIL=
TEST_USER_PASSWORD=
```

## Example: the environment section of a requirements handoff
```
Target:       https://example-marketplace.test
Environment:  production, read-only
Account:      none; login flows out of scope until a test account is provided
Writes:       none allowed; the bid and checkout criteria marked not verifiable, asked Q4
Workers:      2, external site
Known blocks: Cloudflare challenge on headless Chromium; headed Chrome passed locally; CI needs an allow-listed address, asked Q5
```

## Checklist
- Is the target and its write policy written down before the first action?
- Does any test write on production?
- Is any secret in a committed file, handoff, report, commit or quoted output?
- Is the auth state file gitignored and absent from every handoff?
- Is the worker cap on for an external site?
- Did a 403 or a challenge stop the run and get reported?
- Are viewport, scale, timezone and locale pinned, and versions locked?
