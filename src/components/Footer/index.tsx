import IconGithub from "@/image/icons/social/github.svg";
import IconLinkedin from "@/image/icons/social/linkedin.svg";
import IconMedium from "@/image/icons/social/medium.svg";
import IconX from "@/image/icons/social/x.svg";

interface SocialLinkProps {
  href: string;
  Icon: React.FC<{ className?: string }>;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, Icon }) => (
  <a
    href={href}
    className="text-brand-neutral-300 hover:text-white transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="size-4" />
  </a>
);

/**
 * Footer component with copyright information and social links.
 */
const Footer = () => {
  return (
    <footer>
      <div className="container--boxed">
        <div className="border-t border-solid border-brand-neutral-500 border-opacity-40 py-10 md:py-4 flex items-center justify-between flex-col md:flex-row gap-6 md:gap-4">
          <p className="text-brand-neutral-300 text-sm">
            Copyright &copy; 2017 - {new Date().getFullYear()} KRAKEND S.L.
          </p>
          <div className="flex flex-row items-center gap-5">
            <SocialLink href="https://twitter.com/krakend_io" Icon={IconX} />
            <SocialLink
              href="https://www.linkedin.com/company/krakend/"
              Icon={IconLinkedin}
            />
            <SocialLink href="https://github.com/krakend/" Icon={IconGithub} />
            <SocialLink href="https://medium.com/krakend" Icon={IconMedium} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
