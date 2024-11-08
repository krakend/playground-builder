import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className} bg-brand-neutral-900`}>
      <Component {...pageProps} />
    </div>
  );
}
