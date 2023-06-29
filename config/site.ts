export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "TickGate",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Create Event",
      href: "/create-event",
    },
    {
      title: "Event History",
      href: "/event-history",
    },
    {
      title: "My QR",
      href: "/my-qr",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
