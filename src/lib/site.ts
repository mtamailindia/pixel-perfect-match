export const site = {
  name: "KRYZALON",
  url: "https://www.kryzalon.com",
  location: "Bengaluru, India",
  contactEmail: import.meta.env['VITE_CONTACT_EMAIL'] || "contact@kryzalon.com",
  whatsappNumber: "8867905924",
  whatsappUrl: "https://wa.me/918867905924",
};

export const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "3D Printing", to: "/3d-printing" },
  { label: "Software Products", to: "/software" },
  { label: "Contact", to: "/contact" },
] as const;

export function pageHead(title: string, description: string, path = "/") {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}${path}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${site.url}${path}` }],
  };
}