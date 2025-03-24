import Head from "next/head";
import React from "react";

const siteConfig = {
  siteTitle: "KrakenD Playground",
  siteDescription:
    "This is a demonstration environment that puts together the necessary pieces to get you started with our API Gateway, using example use-cases.",
  siteLanguage: "en",
};

type SEOProps = {
  title?: string;
  description?: string;
};

/**
 * SEO component to manage the document's title and meta tags.
 *
 * @param title The page title, defaults to `siteConfig.siteTitle` if not provided.
 * @param description The meta description of the page.
 * @returns A `<Head>` component with dynamic title and meta description.
 */
const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const meta = {
    title: title || siteConfig.siteTitle,
    description,
  };

  return (
    <Head>
      <title key="title">{meta.title}</title>

      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
    </Head>
  );
};

export default SEO;
