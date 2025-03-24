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
      <section className="section--sm relative">
        <Image
          src={BGPurplePattern}
          width={900}
          height={810}
          alt=""
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
        />
        <div className="container--boxed">
          <div className="relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="heading--h3 text-white">
                KrakenD{" "}
                {process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source"
                  ? "Open Source"
                  : "Enterprise"}
              </h2>
              <h2
                className="heading--h1 text-gradient--lavender py-1"
                style={{ letterSpacing: "-1px" }}
              >
                Playground
              </h2>

              <p className="text-brand-neutral-300 mt-8 text--lg text-center">
                This is a demonstration environment that puts together the
                necessary pieces to get you started with our API Gateway, using
                example use-cases.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Image
                src={HeroDiagram}
                alt="Hero playground diagram"
                width={1024}
                height={646}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="section--sm">
        <div className="container--boxed">
          <div>
            <div>
              <div className="max-w-screen-md mx-auto">
                <div className="flex items-center justify-center gap-1.5 mb-10">
                  <button
                    className={`px-10 py-2 font-medium ${
                      currentTab === "use-cases"
                        ? "bg-white text-brand-neutral-800"
                        : "bg-brand-neutral-600 text-brand-neutral-300"
                    }`}
                    onClick={() => updateCurrentTabHandler("use-cases")}
                    style={{ borderRadius: "100px 20px 20px 100px" }}
                  >
                    Use-cases
                  </button>
                  <button
                    className={`px-10 py-2 font-medium ${
                      currentTab === "integrations"
                        ? "bg-white text-brand-neutral-800"
                        : "bg-brand-neutral-600 text-brand-neutral-300"
                    }`}
                    onClick={() => updateCurrentTabHandler("integrations")}
                    style={{ borderRadius: "20px 100px 100px 20px" }}
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

              {/* Line */}
              {/* <div
                className="h-auto ml-8 shrink-0"
                style={{
                  width: "1px",
                  minWidth: 1,
                  backgroundImage:
                    "linear-gradient(to bottom, #0b0c10 0%, #545d78 25%, #545d78 51%, #545d78 75%, #0b0c10 100%)",
                }}
              /> */}
            </div>
          </div>
        </div>
      </main>

      <DemoCta />
    </Layout>
  );
};

export default Index;

/**
 * Generates static props for the Index page at build time.
 * Processes endpoint data to create organized use cases with custom fields and categories.
 *
 * @returns {Object} Props containing grouped use cases
 *   - useCases: Object with categories as keys and arrays of processed endpoints as values
 *     - Each use case contains:
 *       - Original endpoint data
 *       - custom_fields: {
 *           tag: First part of "@comment"
 *           name: Second part of "@comment"
 *           slug: URL-friendly version of endpoint
 *           category: From OpenAPI tags or 'others'
 *         }
 */
export function getStaticProps() {
  const endpoints = data.endpoints;

  // In each endpoint, split the @comment by `:` and set the first part as tag, and the second part as name. Set the tag and name in "custom_fields" object
  const useCases = endpoints.map((endpoint) => {
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

  // group the use cases by category and create a new object with the category as key and the use cases as value
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
