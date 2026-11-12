export const enquiryTypes = ["3D Printing", "Product Enquiry", "Software Products", "Collaboration", "General Enquiry"] as const;
export type Enquiry = { name: string; email: string; type: string; subject: string; message: string };
export function validateEnquiry(data: Enquiry) {
  const errors: Partial<Record<keyof Enquiry, string>> = {};
  if (!data.name.trim()) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Please enter a valid email address.";
  if (!enquiryTypes.some((type) => type === data.type)) errors.type = "Please select an enquiry type.";
  if (!data.subject.trim()) errors.subject = "Please enter a subject.";
  if (!data.message.trim()) errors.message = "Please tell us about your enquiry.";
  return errors;
}
export function enquiryText(data: Enquiry) {
  return `Name: ${data.name.trim()}\nEmail: ${data.email.trim()}\nEnquiry type: ${data.type}\nSubject: ${data.subject.trim()}\n\n${data.message.trim()}`;
}