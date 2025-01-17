import { Integration, UseCases } from "@/components/Home";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useGeneralContext } from "@/context/GeneralContext";
import data from "@/data/krakend.json";
import Architecture from "@/image/architecture.svg";
import BGPurplePattern from "@/image/background/bg-pattern-purple.webp";
import Image from "next/image";
import Link from "next/link";

const Index = ({ useCases }) => {
  const { currentTab, updateCurrentTabHandler } = useGeneralContext();

  return (
    <Layout>
      <SEO />

      {/* Hero */}
      <section className="bg-brand-neutral-900 section--sm relative">
        <div className="container--boxed">
          <Image
            src={BGPurplePattern}
            width={580}
            height={321}
            alt=""
            className="absolute top-8 left-1/2 -translate-x-1/2 z-0"
          />
          <div className="relative z-10">
            {process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source" && (
              <span className="text-white tracking-wider uppercase text-center block mx-auto mb-2">
                Open Source
              </span>
            )}
            {process.env.NEXT_PUBLIC_KRAKEND_LICENSE_TYPE === "open-source" ? (
              <h1 className="heading--h1 items-center text-center mb-4 md:mb-7 justify-center">
                <span className="text-white">KrakenD </span>{" "}
                <span className="text-gradient--lavender leading-normal">
                  Playground
                </span>
              </h1>
            ) : (
              <h1 className="heading--h1 flex flex-col items-center text-center mb-4 md:mb-7">
                <span className="text-white">KrakenD Enterprise</span>
                <span className="text-gradient--lavender leading-normal">
                  Playground
                </span>
              </h1>
            )}

            <p
              className="text-brand-neutral-300 text--lg text-center mx-auto"
              style={{ maxWidth: "722px" }}
            >
              This is a demonstration environment that puts together the
              necessary pieces to get you started with our API Gateway, using
              example use-cases.
            </p>
          </div>
        </div>
      </section>

      <main className="section--xl bg-brand-neutral-900 relative">
        <div className="container--boxed">
          <div className="grid grid-cols-12 w-full gap-8">
            <div className="col-span-12 md:col-span-5 lg:col-span-4 flex">
              <div className="max-w-full">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <button
                    className={`px-4 py-2 font-medium rounded-md rounded-l-full ${
                      currentTab === "use-cases"
                        ? "bg-white text-brand-neutral-900"
                        : "bg-brand-neutral-600 text-brand-neutral-300"
                    }`}
                    onClick={() => updateCurrentTabHandler("use-cases")}
                  >
                    Use-cases
                  </button>
                  <button
                    className={`px-4 py-2 font-medium rounded-r-full rounded-l-md ${
                      currentTab === "integrations"
                        ? "bg-white text-brand-neutral-900"
                        : "bg-brand-neutral-600 text-brand-neutral-300"
                    }`}
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

            {/* Diagram */}
            <div className="col-span-12 md:col-span-7 lg:col-span-8 ">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <Architecture />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Questions */}
      <section className="section--xl pt-0 bg-brand-neutral-900">
        <div className="container--boxed flex items-center flex-col ">
          <h2 className="text-center heading--h2 text-white mb-6 md:mb-8">
            Questions?
          </h2>
          <Link
            href={"https://www.krakend.io/support/"}
            className="button--primary"
          >
            Ask Support
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  const endpoints = data.endpoints;

  // In each endpoint, split the @comment by `:` and set the first part as tag, and the second part as name. Set the tag and name in "custom_fields" object
  const useCases = endpoints.map((endpoint) => {
    let [tag, name] = endpoint["@comment"].split(":");
    name = name.trim();
    tag = tag.trim();

    let slug = endpoint.endpoint
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/_/g, "-")
      .replace(/[^a-z0-9/-]/g, "")
      .replace(/(?!^)\//g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "")
      .replace("/", "");
    let category =
      endpoint?.extra_config?.["documentation/openapi"]?.tags?.[0] || "Others";
    category = category.toLowerCase().replace(/ /g, "_");

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
};
