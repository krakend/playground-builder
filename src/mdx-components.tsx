import DemoResources from "@/components/DemoResources";
import CopyIcon from "@/image/icons/copy.svg";
import type { MDXComponents } from "mdx/types";
import { useState } from "react";

/**
 * Wraps every prose <pre> with a copy button that mirrors the look and
 * feedback of the dedicated config code panel: icon + "Copy" label that
 * flips to a checkmark + "Copied" in brand green for ~1.4s.
 */
const Pre = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text =
      typeof children?.props?.children === "string"
        ? children.props.children
        : "";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      })
      .catch((err) => console.error("Failed to copy!", err));
  };

  return (
    <div className="prose-pre-wrapper">
      <pre {...props}>{children}</pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={`code-panel__copy prose-pre-copy ${copied ? "is-copied" : ""}`}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <CopyIcon width={14} height={14} />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    DemoResources,
    ...components,
  };
}
