"use client";
import { useRef, useState } from "react";

interface URLInputBoxProps {
  endpoint?: string;
  placeholder?: string;
  helpText?: string;
  isStatic?: boolean;
}

/**
 * A reusable URL input component that dynamically generates a complete URL.
 * Users can enter a value, which gets appended to the given `endpoint`.
 * The resulting URL is displayed with an option to open it in a new tab.
 *
 * @param endpoint The base endpoint to prepend to the input value.
 * @param placeholder The placeholder text for the input field.
 * @param helpText A small help text displayed below the input field.
 * @param isStatic If `true`, disables input and only displays the endpoint.
 * @returns A styled URL input box with a preview link.
 */
const URLInputBox: React.FC<URLInputBoxProps> = ({
  endpoint,
  placeholder,
  helpText,
  isStatic = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [completeUrl, setCompleteUrl] = useState(endpoint || ""); // State to store the complete URL

  /**
   * Focuses the input field when the surrounding div is clicked.
   */
  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input
    }
  };

  /**
   * Handles changes in the input field and updates the complete URL.
   *
   * @param e The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newUrl = endpoint
      ? `${endpoint.replace(/\/$/, "")}/${inputValue}`
      : inputValue;
    setCompleteUrl(newUrl);
  };

  return (
    <div className="not-prose">
      <div
        className="bg-white py-4 px-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between relative"
        onClick={handleDivClick}
        // skipcq: JS-0417
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleDivClick();
          }
        }}
        role="textbox"
        tabIndex={0}
      >
        <div className="flex text-brand-neutral-600 w-full">
          <p className="shrink-0">{endpoint || ""}</p>
          {!isStatic && (
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              className="focus:outline-none w-full"
              onChange={handleInputChange}
            />
          )}
        </div>

        <a
          className="bg-brand-neutral-900 text-white rounded-md px-6 py-2 absolute top-2 right-2 flex items-center gap-1"
          href={completeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      </div>
      {helpText && (
        <small className="mt-2 text-sm font-normal">{helpText}</small>
      )}
    </div>
  );
};

export default URLInputBox;
