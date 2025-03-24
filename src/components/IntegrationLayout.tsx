import integrationData from "@/data/integrations.json";
import Image from "next/image";
import { useRouter } from "next/router";
import CtaRouteBack from "./Cta/CtaRouteBack";
import DemoCta from "./Cta/DemoCta";
import Layout from "./Layout";
import SEO from "./SEO";

interface IntegrationHeaderProps {
  name: string;
  title: string;
  iconUrl?: string;
}

const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({
  name,
  title,
  iconUrl,
}) => (
  <div className="mt-10">
    <div className="flex items-center gap-3 mb-2">
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={`${name} logo`}
          width={30}
          height={30}
          className="object-contain"
        />
      )}
      <span className="uppercase tracking-wider text-sm text-brand-neutral-300">
        {name}
      </span>
    </div>
    <h1 className="heading--h2 mb-10 text-white">{title}</h1>
  </div>
);

const IntegrationContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="prose--mdx" style={{ maxWidth: "none" }}>
    {children}
  </div>
);

/**
 * IntegrationLayout component wraps content with integration-specific data.
 *
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - The content to be displayed.
 * @returns {JSX.Element} The IntegrationLayout component.
 */
const IntegrationLayout = ({ children }) => {
  const router = useRouter();
  const pathname = router.asPath.replace(/\/$/, "");

  // Extract the slug from the pathname
  const slug = pathname.split("/").pop();

  // Find the integration data based on the slug
  const integration = integrationData.integrations.find(
    (integration) => integration.slug === slug
  );

  if (!integration) {
    return <div>Integration not found</div>;
  }

  return (
    <Layout>
      <SEO
        title={`${integration.title} | KrakenD Playground`}
        description={integration.description[0]}
      />

      <section className="section--sm">
        <div className="container--boxed">
          <CtaRouteBack />
          <IntegrationHeader
            name={integration.name}
            title={integration.title}
            iconUrl={integration.iconUrl}
          />
          <IntegrationContent>{children}</IntegrationContent>
        </div>
      </section>

      <DemoCta />
    </Layout>
  );
};

export default IntegrationLayout;
