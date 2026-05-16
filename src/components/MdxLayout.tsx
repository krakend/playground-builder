import SEO from "@/components/SEO";
import data from "@/data/krakend.json";
import CopyIcon from "@/image/icons/copy.svg";
import { useRouter } from "next/router";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import AIGatewayNotice from "./AIGatewayNotice";
import CtaRouteBack from "./Cta/CtaRouteBack";
import DemoCta from "./Cta/DemoCta";
import DemoResources from "./DemoResources";
import Layout from "./Layout";
import URLInputBox from "./URLInputBox";

require("prismjs/components/prism-json");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-yaml");
require("prismjs/plugins/line-numbers/prism-line-numbers.js");

interface EndpointHeaderProps {
  tag: string;
  name: string;
  method?: string;
  endpoint?: string;
}

/**
 * Title block of an endpoint page: category eyebrow + name + a compact
 * pill that surfaces the HTTP method and path. The chip means each MDX
 * no longer needs `## Endpoint /path` at the top — the data already
 * lives in krakend.json.
 */
const EndpointHeader: React.FC<EndpointHeaderProps> = ({ tag, name }) => (
  <>
    <p className="section-eyebrow mb-3">{tag}</p>
    <h1 className="heading--h2 text-white">{name}</h1>
  </>
);

interface CodeBlockProps {
  code: object;
  isCopied: boolean;
  onCopy: () => void;
}

/**
 * Renders a code block with syntax highlighting and copy functionality.
 * Displays JSON configuration with a copy button and copy status indicator.
 *
 * @param {CodeBlockProps} props - The component props
 * @param {object} props.code - The code object to be displayed
 * @param {boolean} props.isCopied - Whether the code has been copied
 * @param {() => void} props.onCopy - Function to handle code copying
 * @returns {JSX.Element} The rendered code block component
 */
const CodeBlock: React.FC<CodeBlockProps & { endpoint?: string; method?: string }> = ({
  code,
  isCopied,
  onCopy,
  endpoint,
  method,
}) => (
  <div className="code-panel">
    <div className="code-panel__header">
      {endpoint ? (
        <span className="endpoint-chip endpoint-chip--inline">
          <span className="endpoint-chip__method">{method || "GET"}</span>
          <span className="endpoint-chip__path">{endpoint}</span>
        </span>
      ) : (
        <span className="code-panel__label">Endpoint configuration</span>
      )}
      <button
        className={`code-panel__copy ${isCopied ? "is-copied" : ""}`}
        onClick={onCopy}
        aria-label="Copy configuration"
      >
        <CopyIcon width={14} height={14} />
        <span>{isCopied ? "Copied" : "Copy"}</span>
      </button>
    </div>
    <div className="code-panel__body">
      <pre className="line-numbers">
        <code className="language-json">{JSON.stringify(code, null, 2)}</code>
      </pre>
    </div>
  </div>
);

/**
 * Renders the content section of the documentation page.
 * Wraps the MDX content with appropriate styling.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be rendered
 * @returns {JSX.Element} The rendered content section
 */
const ContentSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="prose--mdx">{children}</div>;

/**
 * Creates a URL-friendly slug from an endpoint string.
 * Converts the endpoint to lowercase, replaces spaces and special characters with hyphens.
 *
 * @param {string} endpoint - The endpoint string to convert
 * @returns {string} The URL-friendly slug
 */
const createSlug = (endpoint: string): string => {
  return endpoint
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9/-]/g, "")
    .replace(/(?!^)\//g, "-")
    .replace(/--+/g, "-")
    .replace(/-$/g, "")
    .replace("/", "");
};

/**
 * Layout component for rendering MDX pages related to KrakenD use-cases.
 * It displays API endpoint details and allows users to copy configurations.
 * Includes syntax highlighting for JSON and clipboard functionality.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The MDX content to render
 * @returns {JSX.Element} The complete layout with metadata, endpoint details, and content
 */
type ResourcesProp = {
  interactive?: { url: string; label: string };
  docs?: { url: string; label: string }[];
  tryUrl?: { endpoint: string; placeholder?: string; isStatic?: boolean };
  aiFeature?: boolean;
};

export default function MdxLayout({
  children,
  resources,
}: Readonly<{
  children: React.ReactNode;
  resources?: ResourcesProp;
}>) {
  const router = useRouter();
  const pathname = router.asPath.replace(/\/$/, "");
  const useCaseSlug = pathname.replace("/use-cases/", "");
  const [isCopied, setIsCopied] = useState(false);

  const currentUseCase = data.endpoints.find(
    (useCase) => createSlug(useCase.endpoint) === useCaseSlug
  );

  const tag = currentUseCase?.["@comment"].split(":")[0].trim();
  const name = currentUseCase?.["@comment"].split(":")[1].trim();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  /**
   * Handles copying the current use-case configuration to the clipboard.
   * Sets a temporary success state for user feedback.
   *
   * @returns {void}
   */
  const handleCopy = () => {
    navigator.clipboard
      .writeText(JSON.stringify(currentUseCase, null, 2))
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy!", err));
  };

  if (!currentUseCase) {
    return <p>Use-Case not found</p>;
  }

  return (
    // skipcq: JS-0415
    <Layout>
      <SEO
        title={`${name} | KrakenD Playground`}
        description={
          currentUseCase?.extra_config?.["documentation/openapi"]?.summary ||
          currentUseCase?.extra_config?.["documentation/openapi"]?.description
        }
      />
      <section className="section--sm">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          {resources?.aiFeature && <AIGatewayNotice />}
          <CtaRouteBack wrapperClassname="mb-7" />
          <EndpointHeader tag={tag} name={name} />
          <div className="flex flex-col lg:flex-row gap-10 mt-6">
            <div className="w-full lg:basis-[640px] lg:shrink-0 lg:grow-0 min-w-0">
              <CodeBlock
                code={currentUseCase}
                endpoint={currentUseCase?.endpoint}
                method={currentUseCase?.method}
                isCopied={isCopied}
                onCopy={handleCopy} // skipcq: JS-0417
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {resources && <DemoResources {...resources} />}
              <ContentSection>{children}</ContentSection>
            </div>
          </div>
        </div>
      </section>
      <DemoCta />
    </Layout>
  );
}
