import { useRouter } from "next/router";
import { useCallback } from "react";

type props = {
  wrapperClassname?: string;
};

function CtaRouteBack({ wrapperClassname = "" }: props): JSX.Element {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className={`flex${wrapperClassname ? ` ${wrapperClassname}` : ""}`}>
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-neutral-300 hover:text-white transition-colors"
      >
        <span aria-hidden="true">←</span>
        <span>Back to playground</span>
      </button>
    </div>
  );
}

export default CtaRouteBack;
