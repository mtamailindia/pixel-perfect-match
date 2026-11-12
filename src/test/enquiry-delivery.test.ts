// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { deliverEnquiry } from "@/lib/enquiry-delivery.server";
import { enquirySchema, enquiryLimits } from "@/lib/enquiry";

const valid = { name: "Example Person", email: "person@example.com", type: "3D Printing", subject: "Prototype", message: "A test enquiry", website: "", submissionId: "aabbccdd-1234-4123-8123-123456789abc" };
function setup(success = true) {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "test-message" }));
  const limit = vi.fn().mockResolvedValue({ success });
  return { apiKey: "test-only-placeholder", ip: "192.0.2.1", limiter: { limit }, fetcher };
}
describe("Secure enquiry delivery", () => {
  it("accepts a complete enquiry only after Resend returns an id", async () => {
    const config = setup();
    expect((await deliverEnquiry(valid, config)).ok).toBe(true);
    const options = config.fetcher.mock.calls[0]?.[1];
    expect(JSON.parse(String(options?.body))).toEqual({ from: "KRYZALON <enquiries@send.kryzalon.com>", to: ["contact@kryzalon.com"], reply_to: "person@example.com", subject: "[3D Printing] Prototype", text: expect.stringContaining("Name: Example Person") });
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe(`kryzalon-enquiry/${valid.submissionId}`);
  });
  it.each([null, {}, { ...valid, email: "invalid" }, { ...valid, submissionId: "invalid" }, { ...valid, extra: "field" }])("rejects malformed input without contacting Resend: %j", async input => {
    const config = setup();
    expect((await deliverEnquiry(input, config)).ok).toBe(false);
    expect(config.fetcher).not.toHaveBeenCalled();
  });
  it.each(Object.entries(enquiryLimits))("enforces the %s field length", (field, max) => {
    const { website: _w, submissionId: _id, ...data } = valid;
    expect(enquirySchema.safeParse({ ...data, [field]: "a".repeat(max + 1) }).success).toBe(false);
  });
  it("rejects header injection", async () => {
    expect((await deliverEnquiry({ ...valid, subject: "test\r\nBcc: other@example.com" }, setup())).ok).toBe(false);
  });
  it("uses plain text so submitted HTML is never executed", async () => {
    const config = setup(); await deliverEnquiry({ ...valid, message: "<script>bad()</script>" }, config);
    const body = JSON.parse(String(config.fetcher.mock.calls[0]?.[1]?.body));
    expect(body.html).toBeUndefined(); expect(body.text).toContain("<script>bad()</script>");
  });
  it("rejects honeypot submissions without sending", async () => {
    const config = setup(); expect((await deliverEnquiry({ ...valid, website: "spam" }, config)).ok).toBe(false); expect(config.fetcher).not.toHaveBeenCalled();
  });
  it("enforces the binding decision", async () => {
    const config = setup(false); expect((await deliverEnquiry(valid, config)).ok).toBe(false); expect(config.limiter.limit).toHaveBeenCalledOnce(); expect(config.fetcher).not.toHaveBeenCalled();
  });
  it.each(["apiKey", "limiter", "ip"] as const)("fails closed without %s", async field => {
    const config = setup(); const without = { ...config, [field]: undefined };
    expect((await deliverEnquiry(valid, without)).ok).toBe(false); expect(config.fetcher).not.toHaveBeenCalled();
  });
  it("fails closed if the limiter throws", async () => {
    const config = setup(); config.limiter.limit.mockRejectedValue(new Error("unavailable"));
    expect((await deliverEnquiry(valid, config)).ok).toBe(false); expect(config.fetcher).not.toHaveBeenCalled();
  });
  it("handles provider rejection without exposing the body", async () => {
    const config = setup(); config.fetcher.mockResolvedValue(Response.json({ message: "private provider detail" }, { status: 403 }));
    const result = await deliverEnquiry(valid, config); expect(result.ok).toBe(false); expect(result.message).not.toContain("private provider detail");
  });
  it("does not treat a malformed success as accepted", async () => {
    const config = setup(); config.fetcher.mockResolvedValue(Response.json({})); expect((await deliverEnquiry(valid, config)).ok).toBe(false);
  });
  it("uses the same idempotency key for retries", async () => {
    const config = setup(); await deliverEnquiry(valid, config); await deliverEnquiry(valid, config);
    const keys = config.fetcher.mock.calls.map(call => new Headers(call[1]?.headers).get("Idempotency-Key"));
    expect(keys).toEqual([`kryzalon-enquiry/${valid.submissionId}`, `kryzalon-enquiry/${valid.submissionId}`]);
  });
});