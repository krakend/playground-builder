import CopyIcon from "@/image/icons/copy.svg";
import type { MDXComponents } from "mdx/types";
import React, { useState } from "react";

const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const [copied, setCopied] = useState(false);

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    ...components,
  };
}
