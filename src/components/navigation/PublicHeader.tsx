import Link from "next/link";
import { DataSourceIndicator } from "./DataSourceIndicator";

const links = [
  { href: "/menu", label: "Menu" },
];

const journeyLinks = [
  { href: "/find-yours", label: "Find Yours" },
  { href: "/passport", label: "My Cup" },
];

export function PublicHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-10 lg:px-16">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-[#3d2618]/10 bg-[#fff8ed]/54 px-3 py-2 shadow-[0_10px_28px_rgba(84,55,34,0.1)] backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href="/"
            className="px-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
          >
            Pinoc
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-3 text-xs font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/76 hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-2 focus:ring-offset-[#fff8ed]/70 sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="hidden sm:block">
            <DataSourceIndicator />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {journeyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-3 text-xs font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/76 hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-2 focus:ring-offset-[#fff8ed]/70 sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
