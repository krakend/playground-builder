import BGPattern from "@/image/background/illustration-top.png";
import Image from "next/image";
import Link from "next/link";

/**
 * DemoCta — gradient panel with a single primary CTA.
 */
function DemoCta() {
  return (
    <section className="py-10 lg:py-14">
      <div className="container--boxed">
        <div className="relative px-6 md:px-12 py-8 md:py-10 overflow-hidden bg-gradient-lavender text-center rounded-2xl shadow--lg">
          <div className="absolute hidden md:block left-0 top-0 pointer-events-none opacity-50">
            <Image src={BGPattern} alt="" width={459} height={331} />
          </div>

          <div className="relative">
            <p className="section-eyebrow text-white/80 mb-2">Need a hand?</p>
            <h2 className="heading--h3 text-white">
              We are here to help
            </h2>
            <p className="text-white/85 text-base mt-2 mb-5 max-w-xl mx-auto">
              Reach out and we&apos;ll get back with the best way to integrate
              KrakenD into your stack.
            </p>
            <Link
              href={"https://www.krakend.io/support/"}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 bg-white text-brand-neutral-900 font-semibold no-underline transition-all duration-200 hover:scale-105"
            >
              Talk to support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoCta;
