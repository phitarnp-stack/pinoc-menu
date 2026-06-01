import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/special", label: "Special" },
  { href: "/account", label: "My Cup" },
];

export function PublicHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-6 pt-6 sm:px-10 lg:px-16">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-[#3d2618]/12 bg-[#fff8ed]/58 p-3 shadow-[0_14px_34px_rgba(84,55,34,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="px-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
        >
          Pinoc
        </Link>

        <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/76 hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-2 focus:ring-offset-[#fff8ed]/70 sm:px-4"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
