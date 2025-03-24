import IconChevron from "@/image/icons/chevron-left.svg";
import React, { useCallback, useRef } from "react";

type Props = {
  children: React.ReactNode;
  heading: string | React.ReactNode;
};

/**
 * Accordion component that can be expanded or collapsed to show or hide content.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the accordion.
 * @param {string | React.ReactNode} heading - The heading of the accordion.
 * @returns {JSX.Element} The rendered Accordion component.
 */
function Accordion({ children, heading }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Handles the click event on the accordion button.
   * Toggles the active class and adjusts the height of the content.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event.
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.classList.toggle("active");
    if (ref.current.style.height === "0px") {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    } else {
      ref.current.style.height = "0px";
    }
  }, []);

  return (
    <div>
      <button
        onClick={handleClick}
        className="group flex justify-between items-center w-full rounded-xl p-5 text--lg text-white bg-brand-blue-900 hover:bg-opacity-85"
      >
        {heading}
        <IconChevron className="transition-transform duration-300 -rotate-90 group-[.active]:rotate-90" />
      </button>

      <div
        style={{ height: 0 }}
        ref={ref}
        className="transition-all duration-300 overflow-hidden"
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
