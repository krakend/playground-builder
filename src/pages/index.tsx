import DemoCta from "@/components/Cta/DemoCta";
import { Integration, UseCases } from "@/components/Home";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useGeneralContext } from "@/context/GeneralContext";
import data from "@/data/krakend.json";
import BGPurplePattern from "@/image/background/bg-pattern.png";
import HeroDiagram from "@/image/diagram/hero-playground-diagram-new.png";
import Image from "next/image";

const Index = ({ useCases }) => {
  const { currentTab, updateCurrentTabHandler } = useGeneralContext();

  return (
    <Layout>
      <SEO />

      {/* Hero */}
      <section className="section--sm relative overflow-hidden">
        <Image
          src={BGPurplePattern}
          width={900}
          height={810}
          alt=""
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-60"
        />
        <div className="container--boxed">
          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="section-eyebrow mb-4">
                {process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source"
                  ? "KrakenD Open Source"
                  : "KrakenD Enterprise"}
              </p>
              <h1
                className="heading--h1 text-white"
                style={{ letterSpacing: "-1.5px" }}
              >
                <span className="text-gradient--lavender">Playground</span>{" "}
                Documentation
              </h1>

              <p className="text-brand-neutral-300 mt-6 text--lg">
                Browse the demos, integrations and configurations included in
                this playground. Each card links to a deep-dive page with the
                endpoint config, sample requests and behind-the-scenes details.
              </p>
            </div>
            <div className="mt-10 flex justify-center">
              <Image
                src={HeroDiagram}
                alt="Hero playground diagram"
                width={1024}
                height={646}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="section--sm">
        <div className="container--boxed">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-12">
              <button
                className={`nav-tab ${currentTab === "use-cases" ? "is-active" : ""}`}
                onClick={() => updateCurrentTabHandler("use-cases")}
              >
                Use cases
              </button>
              <button
                className={`nav-tab ${currentTab === "integrations" ? "is-active" : ""}`}
                onClick={() => updateCurrentTabHandler("integrations")}
              >
                Integrations
              </button>
            </div>
            {currentTab === "use-cases" && <UseCases data={useCases} />}
            {currentTab === "integrations" && (
              <Integration
                licenseType={process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE}
              />
            )}
          </div>
        </div>
      </main>

      <DemoCta />
    </Layout>
  );
};

export default Index;

// Endpoints whose @comment starts with these prefixes are infrastructure
// (gateway-side plumbing, internal aggregators feeding MCP tools, static
// asset servers, etc.) and don't surface as user-facing demo cards or
// MDX pages. The validation script applies the same filter.
const NON_DEMO_TAGS = new Set(["Utility", "Internal"]);

export function getStaticProps() {
  const endpoints = data.endpoints;

  const useCases = endpoints
    .filter((endpoint) => {
      const tag = (endpoint["@comment"] || "").split(":")[0].trim();
      return !NON_DEMO_TAGS.has(tag);
    })
    .map((endpoint) => {
      let [tag, name] = endpoint["@comment"].split(":");
      name = name.trim();
      tag = tag.trim();

      const slug = endpoint.endpoint
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^a-z0-9/-]/g, "")
        .replace(/(?!^)\//g, "-")
        .replace(/--+/g, "-")
        .replace(/-$/g, "")
        .replace("/", "");
      const category =
        endpoint?.extra_config?.["documentation/openapi"]?.tags?.[0] || "others";

      return {
        ...endpoint,
        custom_fields: {
          tag,
          name,
          slug,
          category,
        },
      };
    });

  const groupedUseCases = useCases.reduce((acc, useCase) => {
    const category = useCase.custom_fields.category;

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(useCase);
    return acc;
  }, {});

  return {
    props: {
      useCases: groupedUseCases,
    },
  };
}
