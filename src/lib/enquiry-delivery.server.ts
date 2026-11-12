import { enquiryText, submissionSchema } from "./enquiry";

export type RateLimiter = { limit: (options: { key: string }) => Promise<{ success: boolean }> };
export type DeliveryConfig = { apiKey?: string | undefined; limiter?: RateLimiter | undefined; ip?: string | undefined; fetcher?: typeof fetch; logger?: (status: number, code: string) => void };
export type DeliveryResult = { ok: boolean; message: string };
const unavailable: DeliveryResult = { ok: false, message: "Enquiry submission is temporarily unavailable. Please contact us by email or WhatsApp." };

export async function deliverEnquiry(input: unknown, config: DeliveryConfig): Promise<DeliveryResult> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Please check your enquiry details and try again." };
  const data = parsed.data;
  // Never fake a successful email acceptance for a honeypot submission.
  if (data.website) return { ok: false, message: "We couldn’t submit this enquiry. Please contact us directly." };
  if (!config.apiKey || !config.limiter || !config.ip) return unavailable;
  try {
    const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(config.ip));
    const key = Array.from(new Uint8Array(ipHash), b => b.toString(16).padStart(2, "0")).join("");
    if (!(await config.limiter.limit({ key: `enquiry:${key}` })).success) return { ok: false, message: "Too many attempts. Please wait a minute before trying again." };
    // Resend's idempotency key prevents repeated requests from sending the same email.
    const { website: _website, submissionId: _id, ...enquiry } = data;
    const response = await (config.fetcher ?? fetch)("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `kryzalon-enquiry/${data.submissionId}` },
      body: JSON.stringify({ from: "KRYZALON <enquiries@send.kryzalon.com>", to: ["contact@kryzalon.com"], reply_to: data.email, subject: `[${data.type}] ${data.subject}`, text: `KRYZALON website enquiry\n\n${enquiryText(enquiry)}` }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      // Do not log provider bodies: they can echo credentials or customer data.
      config.logger?.(response.status, "resend_rejected");
      return { ok: false, message: "The email service could not accept your enquiry. Please try again or contact us directly." };
    }
    const body: unknown = await response.json();
    if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string" || !body.id) return unavailable;
    return { ok: true, message: "Your enquiry has been accepted by our email service. Inbox delivery is not guaranteed." };
  } catch {
    config.logger?.(0, "submission_unavailable");
    return unavailable;
  }
}