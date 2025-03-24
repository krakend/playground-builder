import Accordion from "@/components/Accordion";
import integrationData from "@/data/integrations.json";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import parser from "html-react-parser";
import Image from "next/image";
import Link from "next/link";

interface IntegrationItemProps {
  integration: (typeof integrationData.integrations)[0];
  licenseType: string;
}

const IntegrationHeader: React.FC<{
  integration: (typeof integrationData.integrations)[0];
}> = ({ integration }) => (
  <div className="flex items-center gap-3">
    <div className="p-1 box-border size-10 shadow--lg bg-brand-blue-800 rounded-md flex justify-center items-center">
      <Image
        src={integration.iconUrl}
        height={30}
        width={30}
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
    <span className="font-medium text-white">{integration.title}</span>
  </div>
);

const IntegrationContent: React.FC<IntegrationItemProps> = ({
  integration,
  licenseType,
}) => (
  <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center justify-between">
    <Link
      href={`/integrations/${licenseType}/${integration.slug}`}
      className="rounded-md shadow-md inline-block"
    >
      <p className="text-brand-neutral-300">
        {parser(integration?.description?.[0])}
      </p>
    </Link>
    <Link
      href={`/integrations/${licenseType}/${integration.slug}`}
      className="button--primary flex items-center gap-1 w-full md:w-auto justify-center"
    >
      <span className="text-base whitespace-nowrap">Demo</span>
      <ChevronLeft className="size-6 rotate-180" />
    </Link>
  </div>
);

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  licenseType,
}) => (
  <li key={integration.slug}>
    <Accordion heading={<IntegrationHeader integration={integration} />}>
      <IntegrationContent integration={integration} licenseType={licenseType} />
    </Accordion>
  </li>
);

/**
 * Integration component that displays integrations based on license type.
 *
 * @param {IntegrationProps} props - Component properties.
 * @returns {JSX.Element} - Rendered component.
 */
const Integration = ({ licenseType = "open-source" }) => {
  let integrations = integrationData.integrations;

  if (licenseType === "open-source") {
    integrations = integrations.filter((integration) =>
      integration?.license?.includes("open-source")
    );
  } else if (licenseType === "enterprise") {
    integrations = integrations.filter((integration) =>
      integration?.license?.includes("enterprise")
    );
  }

  return (
    <div>
      <h2 className="heading--h5 text-white mb-4">
        Explore demos for these integrations:
      </h2>
      <ul className="space-y-4">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.slug}
            integration={integration}
            licenseType={licenseType}
          />
        ))}
      </ul>
    </div>
  );
};

export default Integration;
