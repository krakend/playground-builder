import SEO from "@/components/SEO";
import data from "@/data/krakend.json";
import CopyIcon from "@/image/icons/copy.svg";
import { useRouter } from "next/router";
import Prism from "prismjs";
import React, { useEffect, useState } from "react";
import CtaRouteBack from "./Cta/CtaRouteBack";
import DemoCta from "./Cta/DemoCta";
import Layout from "./Layout";

require("prismjs/components/prism-json");

interface EndpointHeaderProps {
  tag: string;
  name: string;
}

/**
 * Renders the header section of an endpoint documentation page.
 * Displays the tag and name of the endpoint with appropriate styling.
 *
 * @param {EndpointHeaderProps} props - The component props
 * @param {string} props.tag - The category or type tag of the endpoint
 * @param {string} props.name - The name or title of the endpoint
 * @returns {JSX.Element} The rendered header component
 */
const EndpointHeader: React.FC<EndpointHeaderProps> = ({ tag, name }) => (
  <>
    <p className="text--lg text-brand-neutral-300 mb-2">{tag}</p>
    <h1 className="heading--h3 mb-5 text-white">{name}</h1>
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
const CodeBlock: React.FC<CodeBlockProps> = ({ code, isCopied, onCopy }) => (
  <div className="lg:w-1/2 overflow-auto">
    <p className="text--lg text-white font-semibold mb-5">
      Endpoint Configuration
    </p>
    <pre className="text-sm relative">
      <button
        className={`absolute right-2 top-3 sm:right-6 sm:top-4 icon ${
          isCopied ? "text-green-500" : "text-brand-neutral-200"
        }`}
        onClick={onCopy}
      >
        <CopyIcon width={20} height={20} />
      </button>
      <code className="language-json">{JSON.stringify(code, null, 2)}</code>
    </pre>
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
}) => (
  <div className="lg:w-1/2">
    <div className="prose--mdx">{children}</div>
  </div>
);

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
export default function MdxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
        <div className="container--boxed">
          <CtaRouteBack wrapperClassname="mb-7" />
          <EndpointHeader tag={tag} name={name} />
          <div className="flex flex-col lg:flex-row gap-12">
            <CodeBlock
              code={currentUseCase}
              isCopied={isCopied}
              onCopy={handleCopy} // skipcq: JS-0417
            />
            <ContentSection>{children}</ContentSection>
          </div>
        </div>
      </section>
      <DemoCta />
    </Layout>
  );
}
