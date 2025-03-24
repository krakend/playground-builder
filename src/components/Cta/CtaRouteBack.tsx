import ChevronLeft from "@/image/icons/chevron-left.svg";
import { useRouter } from "next/router";
import { useCallback } from "react";

type props = {
  wrapperClassname?: string;
};

/**
 * CtaRouteBack component that displays a button to navigate back to the previous page.
 *
 * @param {string} [wrapperClassname] - Optional additional class names for the wrapper div.
 * @returns {JSX.Element} The rendered CtaRouteBack component.
 */
function CtaRouteBack({ wrapperClassname = "" }: props): JSX.Element {
  const router = useRouter();

  /**
   * Handles the click event on the back button.
   * Navigates back to the previous page.
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className={`flex${wrapperClassname ? ` ${wrapperClassname}` : ""}`}>
      <button
        onClick={handleBack}
        className="button--primary flex items-center gap-1"
      >
        <ChevronLeft className="size-6" />
        <span className="text-base">Go back</span>
      </button>
    </div>
  );
}

export default CtaRouteBack;
