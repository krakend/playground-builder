import integrationData from "@/data/integrations.json";
import parser from "html-react-parser";
import Image from "next/image";
import Link from "next/link";

interface IntegrationItemProps {
  integration: (typeof integrationData.integrations)[0];
  licenseType: string;
}

const IntegrationCard: React.FC<IntegrationItemProps> = ({
  integration,
  licenseType,
}) => (
  <Link
    href={`/integrations/${licenseType}/${integration.slug}`}
    className="demo-card"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-1 size-10 rounded-md bg-brand-blue-800 flex items-center justify-center shrink-0">
        <Image
          src={integration.iconUrl}
          height={28}
          width={28}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-sm font-semibold text-white">
        {integration.title}
      </span>
    </div>
    {integration?.description?.[0] && (
      <p className="text-sm text-brand-neutral-300 leading-relaxed">
        {parser(integration.description[0])}
      </p>
    )}
  </Link>
);

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
      <h3 className="section-eyebrow mb-4">
        Integrations available in this playground
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <li key={integration.slug} className="list-none">
            <IntegrationCard
              integration={integration}
              licenseType={licenseType}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Integration;
