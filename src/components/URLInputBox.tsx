"use client";
import { useRef, useState } from "react";

interface URLInputBoxProps {
  endpoint?: string;
  placeholder?: string;
  helpText?: string;
  isStatic?: boolean;
}

/**
 * Address-bar-style component for previewing and opening a gateway URL.
 * Renders the endpoint base in muted text + an input the user can type into,
 * with a single primary action ("View") that opens the result in a new tab.
 */
const URLInputBox: React.FC<URLInputBoxProps> = ({
  endpoint,
  placeholder,
  helpText,
  isStatic = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [completeUrl, setCompleteUrl] = useState(endpoint || "");

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newUrl = endpoint
      ? `${endpoint.replace(/\/$/, "")}/${value}`
      : value;
    setCompleteUrl(newUrl);
  };

  return (
    <div className="not-prose my-6">
      <div className="url-input-box" onClick={handleClick}>
        <span className="url-input-box__scheme">GET</span>
        <div className="url-input-box__field">
          <span className="url-input-box__base">{endpoint || ""}</span>
          {!isStatic && (
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              className="url-input-box__input"
              onChange={handleInputChange}
            />
          )}
        </div>
        <a
          className="url-input-box__view"
          href={completeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      </div>
      {helpText && (
        <p className="mt-2 text-xs text-brand-neutral-300">{helpText}</p>
      )}
    </div>
  );
};

export default URLInputBox;
