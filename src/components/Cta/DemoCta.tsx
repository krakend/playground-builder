import BGPattern from "@/image/background/illustration-top.png";
import Image from "next/image";
import Link from "next/link";

/**
 * DemoCta component that displays a call-to-action section with a background image,
 * heading, description, and a link to the support page.
 *
 * @returns {JSX.Element} The rendered DemoCta component.
 */
function DemoCta(): JSX.Element {
  return (
    <section className="section--xl">
      <div className="container--boxed">
        <div className="relative px-5 md:px-10 py-16 overflow-hidden bg-gradient--lavender text-center rounded-xl">
          <div className="absolute hidden md:block left-0 top-0 pointer-events-none">
            <Image src={BGPattern} alt="" width={459} height={331} />
          </div>

          <h2 className="text-center heading--h2 text-white">Questions?</h2>
          <p className="text-white/65 heading--h3 mt-3 mb-8">
            If you have any questions, contact us
          </p>
          <Link
            href={"https://www.krakend.io/support/"}
            className="button--primary"
          >
            Ask Support
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DemoCta;
