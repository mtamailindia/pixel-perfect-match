import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";

describe("Public contact details", () => {
  it("uses the supplied email by default", () => {
    expect(site.contactEmail).toBe("contact@kryzalon.com");
  });
  it("uses the supplied Indian WhatsApp number", () => {
    expect(site.whatsappNumber).toBe("8867905924");
    expect(site.whatsappUrl).toBe("https://wa.me/918867905924");
  });
});