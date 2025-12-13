import Link from "next/link";
import { useMemo } from "react";

interface FooterLink {
  label: string;
  to: string;
}
interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Shop",
    links: [{ label: "Catalog", to: "/catalog" }],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Our Fabrics", to: "/fabrics" },
      { label: "Journal", to: "/journal" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/faq" },
      { label: "Sizing Chart", to: "/sizing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-neutral-800 text-white border-t border-neutral-700">
      <div className="px-6 py-16">
        {/* Split: tagline + menus */}
        <div className="flex flex-col md:flex-row md:space-x-16">
          {/* Tagline (left on md+) */}
          <div className="md:w-1/3 mb-10 md:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold font-bebas tracking-wide">
              Effortlessly refined. Comfortably bold.
            </h2>
            <p className="mt-2 text-gray-400 text-sm lg:text-base">
              Classic essentials made for the modern little gentleman.
            </p>
          </div>

          {/* Menus (right on md+): grid of 3 columns */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {footerSections.map((sec) => (
                <nav
                  key={sec.title}
                  aria-label={sec.title}
                  className="space-y-2"
                >
                  <h3 className="font-semibold text-base">{sec.title}</h3>
                  <ul role="list" className="space-y-1 text-xs">
                    {sec.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          href={link.to}
                          className="hover:underline transition"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-700 bg-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-300">
          © {currentYear} Ezio Kids. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
