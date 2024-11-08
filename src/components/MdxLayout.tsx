import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import CopyIcon from "@/image/icons/copy.svg";
import Prism from "prismjs";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import data from "@/data/krakend.json";

require("prismjs/components/prism-json");

export default function MdxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const useCaseSlug = pathname.replace("/use-cases/", "");
  const [isCopied, setIsCopied] = useState(false);
  const useCases = data.endpoints;

  const currentUseCase = useCases.find((useCase) => {
    let [tag, name] = useCase["@comment"].split(":");
    name = name.trim();
    tag = tag.trim();
    let slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .replace(/--+/g, "-");

    return slug === useCaseSlug;
  });

  const tag = currentUseCase?.["@comment"].split(":")[0].trim();
  const name = currentUseCase?.["@comment"].split(":")[1].trim();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

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
    <>
      <Header />
      <div className="bg-brand-neutral-900 text-white">
        <div className="container--boxed-xl py-8">
          <button
            onClick={() => router.back()}
            className="bg-brand-neutral-600 hover:scale-95 transition-transform rounded-full px-4 py-2 flex items-center justify-center gap-1"
          >
            <ArrowLeftIcon className="size-5" />
            <span className="text-base">Go back</span>
          </button>

          <div className="mt-10">
            <p className="uppercase tracking-wider text-sm text-brand-neutral-300 mb-2">
              {tag}
            </p>
            <h1 className="heading--h2 mb-10">{name}</h1>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left section */}
              <div className="lg:w-1/2 overflow-auto">
                <p className="font-semibold mb-2">KrakenD Config</p>
                <pre className="text-sm relative">
                  <button
                    className={`absolute right-2 top-3 sm:right-6 sm:top-4 icon ${
                      isCopied ? "text-green-500" : "text-brand-neutral-200"
                    }`}
                    onClick={handleCopy}
                  >
                    <CopyIcon width={20} height={20} />
                  </button>
                  <code className="language-json">
                    {JSON.stringify(currentUseCase, null, 2)}
                  </code>
                </pre>
              </div>

              {/* Right section */}
              <div className="lg:w-1/2">
                <div className="prose--mdx">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
