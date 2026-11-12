import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { DeliveryResult, RateLimiter } from "./enquiry-delivery.server";

export const submitEnquiry = createServerFn({ method: "POST" })
  // Schema errors are handled as a safe result inside the server service.
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<DeliveryResult> => {
    const request = getRequest();
    const runtime = (request as Request & { runtime?: { cloudflare?: { env?: Record<string, unknown> } } }).runtime;
    const env = runtime?.cloudflare?.env;
    // Nitro's Cloudflare module augments the request with the actual env bindings.
    const rawKey = env?.['RESEND_API_KEY'];
    const apiKey = typeof rawKey === "string" ? rawKey : process.env['RESEND_API_KEY'];
    const binding = env?.['CONTACT_RATE_LIMITER'];
    const limiter = binding && typeof binding === "object" && "limit" in binding && typeof binding.limit === "function" ? binding as RateLimiter : undefined;
    // Cloudflare sets this at its edge. Never trust x-forwarded-for or a client-supplied IP field.
    const ip = env ? request.headers.get("cf-connecting-ip") ?? undefined : undefined;
    const { deliverEnquiry } = await import("./enquiry-delivery.server");
    return deliverEnquiry(data, { apiKey, limiter, ip, logger: (status, code) => console.error("Enquiry service error", { status, code }) });
  });