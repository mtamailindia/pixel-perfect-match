# Secure KRYZALON enquiry email

## Architecture and scope
The existing contact layout and five visible fields are preserved. A POST TanStack server function calls a server-only delivery service. Shared Zod schemas validate on both sides. Resend receives plain text via its HTTPS REST API (no SDK is necessary; the uploaded brief's locally installed SDK is not present in this checkout). From: `KRYZALON <enquiries@send.kryzalon.com>`. To: `contact@kryzalon.com`. Reply-To: validated visitor email. Subject includes enquiry type and subject.

No database, DNS changes, Framer changes, resource provisioning or deployment were performed. The Resend secret form was declined; no key was saved. Sending is intentionally unavailable without the secret, binding and trusted Cloudflare IP. Delivery has not been verified in a real mailbox. A stored copy would preserve enquiries if sending fails, but none was added, as requested.

## Security
- Strict schemas reject unknown fields, malformed data, invalid types, header control characters and excessive lengths (name 100, email 254, subject 200, message 5000).
- Honeypot blocks filled hidden website fields without falsely acknowledging an email.
- Existing TanStack CSRF middleware remains enabled.
- Request-time `CONTACT_RATE_LIMITER` binding checks a SHA-256 IP-derived key. No application in-memory limiter, enquiry records or raw IP logs are used.
- Missing binding/IP/key or a failed binding check fails closed. `x-forwarded-for` is not used.
- Button loading and a synchronous in-flight guard block accidental concurrent sends. Unchanged accepted enquiries are blocked in the current page session. A UUID reused on retries becomes Resend's Idempotency-Key (provider retention is 24 hours). Page refresh/new IDs can send again, subject to the limiter.
- Plain text avoids HTML injection. A 15-second fetch timeout and safe error results preserve form input. Logs contain only status and a fixed diagnostic code, never API keys, provider response bodies or enquiry contents.
- Email acceptance is not inbox delivery. Honeypots and approximate rate limits are not comprehensive bot detection; distributed spam and varying IPs remain possible.

## Runtime verification
The installed Nitro `cloudflare-module` preset's `_module-handler.mjs` augments requests with `request.runtime.cloudflare.env` before calling the app. The server function reads the actual secret and binding there, inside the handler. The handler-only `process.env['RESEND_API_KEY']` fallback supports Lovable secret injection; it does not replace the binding check. No secrets are read at module scope or through VITE variables. Actual deployed request augmentation still needs an external production smoke test; if absent, sending stays disabled.

## Required manual configuration
Cloudflare deployment of this Lovable app is not supported from this workflow. No deployment infrastructure or invented resource identifiers have been generated. Use your existing externally maintained deployment configuration and verify it with the installed Nitro adapter; this document does not claim a deployable Cloudflare package was tested here.

For an already configured Cloudflare Worker, add the real Resend sending-enabled key without placing its value in files or shell history:

```sh
npx wrangler secret put RESEND_API_KEY --config /path/to/your/existing/wrangler.jsonc
```

Enter it at Wrangler's hidden prompt. For a named environment add `--env production` consistently to your configuration commands. Dashboard alternative: open the existing Worker → Settings → Variables and Secrets → Add → Secret; name it `RESEND_API_KEY`. Neither action changes DNS. Use a sending-only key restricted to the verified sending domain where possible. Domain verification is user-reported, not independently checked.

In the existing Worker configuration, manually add a Rate Limiting binding named `CONTACT_RATE_LIMITER`. Cloudflare documents the `ratelimits` array entries as `name`, an account-unique integer-string `namespace_id`, and `simple: { limit: 3, period: 60 }`. Choose a namespace identifier unique to your account rather than copying an invented one. A named environment needs its own binding configuration. Wrangler 4.36+ supports this API. Check current account availability/pricing before enabling it. No KV or Durable Object is required.

Cloudflare rate limits are approximate, eventually consistent and scoped to a location, not exact global quotas; requests can exceed three per minute before counters synchronize. This tradeoff was explicitly approved. Reference: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Local tests and production verification
```sh
npm ci
npm test
npm run build
```
Run your available TypeScript checker separately. Ordinary Vite development has no Cloudflare binding and intentionally shows an unavailable error; tests supply a fake binding and mock the Resend API. Never set a VITE API key or add a production bypass to make local sending work.

After your own deployment process, submit a clearly marked test through `/contact` using a real email. Confirm acceptance in the UI, inspect Resend logs and confirm arrival in `contact@kryzalon.com`; then reply to confirm Reply-To. Retry unchanged data to check duplicate protection, fill the honeypot to check rejection, and exceed the configured limit to check the rate-limit response. Verify failed sends preserve inputs. Confirm secrets are absent from public assets. Keep the site's existing DNS and Framer hosting untouched.

## Changed files
`src/lib/enquiry.ts`, `src/routes/contact.tsx`, `src/routes/privacy.tsx`, `src/lib/enquiry.functions.ts` (new), `src/lib/enquiry-delivery.server.ts` (new), `src/test/enquiry-delivery.test.ts` (new), `src/test/setup.ts` (supports server tests), `package.json`, `bun.lock`, `package-lock.json`, `README.md`, `AGENTS.md`, `roadmap.md`, and this report.

## Results
All 38 tests pass across enquiry validation, delivery, contact details and navigation (four suites). Latest preview harness result: `build OK`, with no current TypeScript errors. No manual production build or TypeScript command was run, as this workspace delegates both to the harness; the external production bundle and its runtime behavior are unverified.

Browser verification on `/contact`: a complete enquiry returns the safe unavailable response, keeps visitor inputs, and does not open an email application. Desktop and 390px mobile screenshots confirm the preserved layout and no horizontal overflow. Success is tested with a mocked Resend response only. The real accepted-email and mailbox flow cannot be verified without the declined secret and external binding setup. No owner email was sent.

Dependency synchronization reported seven moderate advisories; no unrelated dependency fixes were applied. The test runner reports an existing `__dirname` configuration warning. Manual deployment, Cloudflare bindings, real Resend acceptance and mailbox arrival remain unverified until the above setup is completed.