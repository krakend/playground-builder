import integrationData from "@/data/integrations.json";
import Image from "next/image";
import { useRouter } from "next/router";
import Prism from "prismjs";
import { useEffect } from "react";
import CtaRouteBack from "./Cta/CtaRouteBack";
import DemoCta from "./Cta/DemoCta";
import DemoResources from "./DemoResources";
import Layout from "./Layout";
import SEO from "./SEO";

require("prismjs/components/prism-json");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-yaml");

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
  <div className="mt-8">
    <div className="flex items-center gap-3 mb-3">
      {iconUrl && (
        <div className="p-1 size-10 rounded-md bg-brand-blue-800 flex items-center justify-center">
          <Image
            src={iconUrl}
            alt={`${name} logo`}
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
      )}
      <span className="section-eyebrow">{name}</span>
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
type ResourcesProp = {
  interactive?: { url: string; label: string };
  docs?: { url: string; label: string }[];
};

const IntegrationLayout = ({
  children,
  resources,
}: {
  children: React.ReactNode;
  resources?: ResourcesProp;
}) => {
  const router = useRouter();
  const pathname = router.asPath.replace(/\/$/, "");

  // Extract the slug from the pathname
  const slug = pathname.split("/").pop();

  // Find the integration data based on the slug
  const integration = integrationData.integrations.find(
    (integration) => integration.slug === slug
  );

  useEffect(() => {
    Prism.highlightAll();
  }, []);

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
          {resources && <DemoResources {...resources} />}
          <IntegrationContent>{children}</IntegrationContent>
        </div>
      </section>

      <DemoCta />
    </Layout>
  );
};

export default IntegrationLayout;
