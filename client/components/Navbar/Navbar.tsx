// const navItems = [
//   { label: "Overview", href: "#" },
//   { label: "Analytics", href: "#" },
//   { label: "Campaigns", href: "#" },
//   { label: "Audience", href: "#" },
// ];

export default function Navbar() {
  return (
    <header className="border-none bg-[#0f0f0f] text-[#f1f1f1]">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-black tracking-[0.24em] text-[#f1f1f1] transition-opacity hover:opacity-90 sm:text-base"
        >
          <span className="inline-flex h-7 w-10 items-center justify-center rounded-md bg-[#ff0033]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-8 w-8 fill-white"
            >
              <path d="M9 7.5v9l7-4.5-7-4.5z" />
            </svg>
          </span>
          MY SOCIAL
        </a>

        {/* <ul className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] sm:gap-3 sm:text-sm">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                className="inline-flex items-center rounded-xl bg-[#0f0f0f] px-4 py-2 text-[#f1f1f1] transition-colors hover:bg-[#1a1a1a]"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul> */}
      </nav>
    </header>
  );
}
