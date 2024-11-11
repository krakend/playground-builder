import Head from "next/head";
import { useRouter } from "next/router";
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

const SEO: React.FC<SEOProps | any> = ({ title, description }) => {
  const router = useRouter();
  const meta = {
    title: title || siteConfig.siteTitle,
    description: description,
  };

  return (
    <>
      <Head>
        <title key="title">{meta.title}</title>

        {meta.description && (
          <meta name="description" content={meta.description} />
        )}
      </Head>
    </>
  );
};

export default SEO;
