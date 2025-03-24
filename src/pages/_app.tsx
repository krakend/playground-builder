import GeneralContextProvider from "@/context/GeneralContext";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <GeneralContextProvider>
        <Component {...pageProps} />
      </GeneralContextProvider>
    </div>
  );
}
