# KRYZALON website

Seven-page informational site using React, TypeScript, TanStack Start, Vite and Tailwind CSS. Public content is prerendered; the contact form now requires a running TanStack server function. Static-only Nginx hosting cannot send enquiries. No enquiry database has been added. See `EMAIL_IMPLEMENTATION.md` for current email setup and verification status.

## Local setup
Install Node.js 22.12+ (or a current LTS) and npm. Clone your GitHub repository, then:

```sh
npm install
cp .env.example .env
npm run dev
```

Commands: `npm run dev` starts development; `npm run build` creates production output; `npm run preview` previews it locally; `npm test` runs tests. A package-lock.json is included for reproducible `npm ci` installs. The existing bun.lock supports reproducible Bun installs too.

## Independent static deployment
`vite.config.ts` explicitly prerenders all seven routes. The production output is normally `dist/client`, containing `index.html`, `about/index.html`, `3d-printing/index.html`, etc., plus browser assets. Depending on the build adapter, public files may be copied to `.output/public`; inspect the build’s reported output folder. Deploy the directory containing the generated root index.html and all seven route folders together. Do not deploy server bundles. No builder account or running Node.js server is required to serve these static files. Check that all seven HTML files exist before deployment; do not substitute an SPA fallback for missing prerendered pages.

Build and static output verification should be performed on your deployment machine before uploading. Static prerendering is configured, but its final generated HTML files have not been inspected in this workspace. This repository’s hosted preview is separate from a VPS deployment.

## GitHub workflow
Connect this project to GitHub through project settings, or use the editable source in your own repository. Keep environment files out of source control. On a local clone, create a branch, make changes, run tests and a production build, review and merge. Deploy from the reviewed branch. Do not commit node_modules, build output or secrets. For a CI workflow, run `npm ci` after committing package-lock.json, `npm test`, and `npm run build`, then upload only the static output directory.

## Linux VPS with Nginx
1. Install Nginx on your Linux VPS; install Node.js only if building on the VPS.
2. Copy the complete static output directory to `/var/www/kryzalon`.
3. Create a server configuration such as:

```nginx
server {
    listen 80;
    server_name www.kryzalon.com;
    root /var/www/kryzalon;
    index index.html;
    location / { try_files $uri $uri/index.html =404; }
    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
server {
    listen 80;
    server_name kryzalon.com;
    return 301 https://www.kryzalon.com$request_uri;
}
```

Enable this configuration, run `sudo nginx -t`, and reload Nginx. Keep HTML short-lived in cache. Use firewall rules permitting HTTP and HTTPS. Test direct navigation and refresh on all seven pages.

## Domain and SSL
Point the domain’s A records (and AAAA only if IPv6 is configured) to your VPS. Configure `www` to reach the same server. Canonical URLs use `https://www.kryzalon.com`. Install Certbot with the Nginx plugin, request certificates for `kryzalon.com` and `www.kryzalon.com`, enable HTTPS redirection, and check automated renewal with `certbot renew --dry-run`. Domain ownership, DNS and certificates must be configured by the operator; they are not provisioned by this code.

## Content and contact configuration
- Public configuration and canonical origin: `src/lib/site.ts`.
- Contact recipient: set `VITE_CONTACT_EMAIL` to a verified public address before building. It is public, not a secret. Do not put credentials in it.
- The form sends through Resend to contact@kryzalon.com; VITE_CONTACT_EMAIL controls the separately displayed public contact link, not the server recipient. Missing credentials or Cloudflare protection disable submission safely. Resend and the receiving mailbox may retain enquiries and delivery records.
- Page content and unique SEO metadata: `src/routes/*.tsx`.
- Shared header/footer: `src/components/site-shell.tsx`; shared content sections: `src/components/page-parts.tsx`.
- Palette, spacing and typography: `src/styles.css`; fonts load in the root page head. Google Fonts is a third-party request; self-host fonts if required and revise privacy wording.
- Sitemap/robots: `public/sitemap.xml` and `public/robots.txt`; update if canonical origin or pages change.
- Concept-generated imagery: `src/assets/`. These are illustrative, not actual KRYZALON products/facilities. Social image tags are intentionally omitted for relative bundled assets.

## Before launch
Verify a real contact email, review draft privacy/terms with appropriate advice, confirm font and hosting privacy disclosures, validate static build output, test email handoff and mobile navigation, and review every availability statement. The brand is pre-launch and no incorporated status, launched software, equipment, customers, prices or guarantees are asserted.
