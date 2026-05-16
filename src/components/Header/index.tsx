import ExternalIcon from "@/image/icons/icon-external.svg";
import KrakendLogo from "@/image/logos/logo-krakend-bw.svg";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, external }) => (
  <li>
    <Link
      href={href}
      className="font-medium text-sm text-brand-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
    >
      <span>{label}</span>
      {external && <ExternalIcon width={14} height={14} className="opacity-60" />}
    </Link>
  </li>
);

const Navigation = () => {
  const docsUrl =
    process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source"
      ? "https://www.krakend.io/docs/"
      : "https://www.krakend.io/docs/enterprise/";

  return (
    <nav>
      <ul className="flex items-center gap-6">
        <NavLink href={docsUrl} label="Docs" external />
        <NavLink href="https://www.krakend.io" label="Website" external />
        <li>
          <Link
            href="https://go.krakend.io/playground"
            target="_blank"
            rel="noopener"
            className="header-cta"
          >
            Contact our team
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const Header = () => (
  <header className="sticky top-0 z-40 border-b border-solid border-brand-neutral-600/40 bg-brand-blue-900/85 backdrop-blur supports-[backdrop-filter]:bg-brand-blue-900/70">
    <div className="container--boxed">
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex flex-col items-start gap-[3px] leading-none">
            <KrakendLogo />
            <span
              className="font-mono uppercase text-brand-neutral-300/70 text-[0.55rem] tracking-eyebrow"
              style={{ paddingLeft: "35px" }}
            >
              EE Playground
            </span>
          </div>
          <span className="text-brand-neutral-300/40 font-light text-lg select-none">/</span>
          <span
            className="font-semibold text-sm tracking-wide bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(96deg, #ab83ff 0%, #4177fd 75%)",
            }}
          >
            Documentation
          </span>
        </Link>
        <Navigation />
      </div>
    </div>
  </header>
);

export default Header;
