import IconGithub from "@/image/icons/social/github.svg";
import IconLinkedin from "@/image/icons/social/linkedin.svg";
import IconMedium from "@/image/icons/social/medium.svg";
import IconX from "@/image/icons/social/x.svg";

interface SocialLinkProps {
  href: string;
  Icon: React.FC<{ className?: string }>;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, Icon, label }) => (
  <a
    href={href}
    aria-label={label}
    className="text-brand-neutral-300 hover:text-white transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="size-4" />
  </a>
);

const Footer = () => (
  <footer className="border-t border-solid border-brand-neutral-600/40 mt-10">
    <div className="container--boxed">
      <div className="py-6 flex items-center justify-between flex-col md:flex-row gap-4">
        <p className="text-brand-neutral-300 text-xs font-mono uppercase tracking-eyebrow">
          KrakenD &middot; {new Date().getFullYear()}
        </p>
        <div className="flex flex-row items-center gap-5">
          <SocialLink href="https://twitter.com/krakend_io" Icon={IconX} label="X" />
          <SocialLink
            href="https://www.linkedin.com/company/krakend/"
            Icon={IconLinkedin}
            label="LinkedIn"
          />
          <SocialLink href="https://github.com/krakend/" Icon={IconGithub} label="GitHub" />
          <SocialLink href="https://medium.com/krakend" Icon={IconMedium} label="Medium" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
