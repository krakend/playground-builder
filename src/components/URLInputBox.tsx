"use client";
import ExternalIcon from "@/image/icons/icon-external.svg";
import { useRef, useState } from "react";

interface URLInputBoxProps {
  endpoint?: string;
  placeholder?: string;
  helpText?: string;
  isStatic?: boolean;
}

const URLInputBox: React.FC<URLInputBoxProps> = ({
  endpoint,
  placeholder,
  helpText,
  isStatic = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [buttonText, setButtonText] = useState<string>("View"); // Button text state
  const [isCopied, setIsCopied] = useState(false); // State to track if the URL is copied
  const [completeUrl, setCompleteUrl] = useState(endpoint || ""); // State to store the complete URL

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newUrl = endpoint
      ? `${endpoint.replace(/\/$/, "")}/${inputValue}`
      : inputValue;
    setCompleteUrl(newUrl);
  };

  const handleCopyUrl = () => {
    const inputValue = inputRef.current?.value || "";

    // Concatenate the URL and input value
    const fullUrl = `${endpoint}${inputValue}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setButtonText("Copied!");
        setIsCopied(true);

        setTimeout(() => {
          setButtonText("Copy");
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div className="not-prose">
      <div
        className="bg-white py-4 px-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between relative"
        onClick={handleDivClick}
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
          className={`bg-brand-neutral-900 text-white rounded-md px-6 py-2 absolute top-2 right-2 flex items-center gap-1 ${
            isCopied ? "bg-blue-500" : ""
          }`}
          href={completeUrl}
          target="_blank"
          rel="noopener"
        >
          {buttonText}
          <ExternalIcon />
        </a>
      </div>
      {helpText && (
        <small className="mt-2 text-sm font-normal">{helpText}</small>
      )}
    </div>
  );
};

export default URLInputBox;
