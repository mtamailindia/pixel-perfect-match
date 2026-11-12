import { z } from "zod";

export const enquiryTypes = ["3D Printing", "Product Enquiry", "Software Products", "Collaboration", "General Enquiry"] as const;
export type Enquiry = { name: string; email: string; type: string; subject: string; message: string };
export const enquiryLimits = { name: 100, email: 254, subject: 200, message: 5000 } as const;
const singleLine = (max: number, label: string) => z.string().trim().min(1, `Please enter ${label}.`).max(max, `Use ${max} characters or fewer.`).regex(/^[^\r\n\u0000-\u001f\u007f]*$/, "Please use a single line of text.");
export const enquirySchema = z.object({
  name: singleLine(enquiryLimits.name, "your full name"),
  email: singleLine(enquiryLimits.email, "a valid email address").email("Please enter a valid email address."),
  type: z.enum(enquiryTypes, { error: "Please select an enquiry type." }),
  subject: singleLine(enquiryLimits.subject, "a subject"),
  message: z.string().trim().min(1, "Please tell us about your enquiry.").max(enquiryLimits.message, "Use 5000 characters or fewer.").regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]*$/, "Please remove unsupported characters."),
}).strict();
export const submissionSchema = enquirySchema.extend({
  website: z.string().max(200),
  submissionId: z.string().uuid(),
}).strict();
export function validateEnquiry(data: Enquiry) {
  const errors: Partial<Record<keyof Enquiry, string>> = {};
  const result = enquirySchema.safeParse(data);
  if (!result.success) for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key in data && !errors[key as keyof Enquiry]) errors[key as keyof Enquiry] = issue.message;
  }
  return errors;
}
export function enquiryText(data: Enquiry) {
  return `Name: ${data.name.trim()}\nEmail: ${data.email.trim()}\nEnquiry type: ${data.type}\nSubject: ${data.subject.trim()}\n\n${data.message.trim()}`;
}