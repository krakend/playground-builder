import CopyIcon from "@/image/icons/copy.svg";
import type { MDXComponents } from "mdx/types";
import { useState } from "react";

/**
 * A wrapper component for rendering preformatted code blocks with a copy button to copy the code content to the clipboard.
 *
 * @param children The code block content to be displayed inside `<pre>`.
 * @param props Additional properties passed to the `<pre>` element.
 * @returns A styled `<pre>` element with a copy button.
 */
const Pre = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the text content of a child component to the clipboard.
   * Sets a temporary copied state for user feedback.
   */
  const copyCodeHandler = () => {
    navigator.clipboard
      .writeText(children.props.children)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy!", err));
  };

  return (
    <div className="relative">
      <pre {...props}>{children}</pre>
      <button
        onClick={copyCodeHandler}
        className={`absolute right-2 top-2 ${
          copied ? "text-green-500" : "text-brand-neutral-200"
        }`}
      >
        <CopyIcon width={20} height={20} />
      </button>
    </div>
  );
};

/**
 * Customizes the default MDX components by providing a custom component.
 * This function allows for extending or overriding MDX components dynamically.
 *
 * @param components The existing MDX components to extend.
 * @returns A new object with the custom `<pre>` component and any provided components.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    ...components,
  };
}
