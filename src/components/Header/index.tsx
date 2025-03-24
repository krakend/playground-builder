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
      className="font-medium text-base hover:underline flex items-end gap-2.5"
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
    >
      <span className="leading-none">{label}</span>
      <ExternalIcon width={24} height={24} />
    </Link>
  </li>
);

const Navigation = () => {
  const docsUrl =
    process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source"
      ? "https://www.krakend.io/docs/"
      : "https://www.krakend.io/docs/enterprise/";

  return (
    <nav className="flex items-center justify-end">
      <ul className="flex gap-3 md:gap-6 items-center justify-between">
        <NavLink href={docsUrl} label="Docs" external />
        <NavLink href="https://www.krakend.io" label="Website" />
      </ul>
    </nav>
  );
};

/**
 * Header component with navigation links.
 * Includes external links to the KrakenD docs and website.
 */
const Header = () => (
  // skipcq: JS-0415
  <header>
    <div className="container--boxed">
      <div className="relative py-4 lg:py-6">
        <div className="text-white flex items-center justify-between h-full">
          <div className="relative z-10">
            <Link href="/">
              <KrakendLogo />
            </Link>
          </div>
          <Navigation />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
