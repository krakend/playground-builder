"use client";
import { useRef, useState } from "react";

type DocLink = { url: string; label: string };
type Interactive = { url: string; label: string };
type TryUrl = { endpoint: string; placeholder?: string; isStatic?: boolean };
type FallbackEndpoint = { method: string; path: string };

interface DemoResourcesProps {
  interactive?: Interactive;
  docs?: DocLink[];
  tryUrl?: TryUrl;
  fallbackEndpoint?: FallbackEndpoint;
}

const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconBook = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/**
 * Resources rail shown above the prose. Two stacked cells:
 *   1. Try it — three flavours sharing one visual treatment:
 *      a) tryUrl (URL input + Open)            — interactive same-page test
 *      b) interactive (label + Open)            — external demo link
 *      c) fallbackEndpoint (method + path)      — read-only chip
 *   2. Docs   — labelled list of doc links.
 */
const TryUrlRow: React.FC<{ tryUrl: TryUrl }> = ({ tryUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(tryUrl.endpoint);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(`${tryUrl.endpoint.replace(/\/$/, "")}/${value}`);
  };

  return (
    <div className="demo-resources__row demo-resources__row--try">
      <span className="demo-resources__icon" aria-hidden="true"><IconPlay /></span>
      <span className="demo-resources__eyebrow">Try it</span>
      <div className="demo-resources__try-field" onClick={() => inputRef.current?.focus()}>
        <span className="demo-resources__try-base">{tryUrl.endpoint}</span>
        {!tryUrl.isStatic && (
          <input
            ref={inputRef}
            type="text"
            placeholder={tryUrl.placeholder || ""}
            className="demo-resources__try-input"
            onChange={handleChange}
          />
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="demo-resources__open"
      >
        <span>Open</span>
        <span className="demo-resources__open-arrow"><IconArrow /></span>
      </a>
    </div>
  );
};

const InteractiveRow: React.FC<{ interactive: Interactive }> = ({ interactive }) => (
  <a
    href={interactive.url}
    target="_blank"
    rel="noopener noreferrer"
    className="demo-resources__row demo-resources__row--try demo-resources__row--cta"
  >
    <span className="demo-resources__icon" aria-hidden="true"><IconPlay /></span>
    <span className="demo-resources__eyebrow">Try it</span>
    <span className="demo-resources__value">{interactive.label}</span>
    <span className="demo-resources__open">
      <span>Open</span>
      <span className="demo-resources__open-arrow"><IconArrow /></span>
    </span>
  </a>
);

const FallbackRow: React.FC<{ endpoint: FallbackEndpoint }> = ({ endpoint }) => (
  <div className="demo-resources__row demo-resources__row--endpoint">
    <span className="endpoint-chip endpoint-chip--inline">
      <span className="endpoint-chip__method">{endpoint.method}</span>
      <span className="endpoint-chip__path">{endpoint.path}</span>
    </span>
  </div>
);

const DemoResources: React.FC<DemoResourcesProps> = ({
  interactive,
  docs,
  tryUrl,
  fallbackEndpoint,
}) => {
  const hasDocs = docs && docs.length > 0;
  const trySlot = tryUrl
    ? <TryUrlRow tryUrl={tryUrl} />
    : interactive
      ? <InteractiveRow interactive={interactive} />
      : fallbackEndpoint
        ? <FallbackRow endpoint={fallbackEndpoint} />
        : null;

  if (!trySlot && !hasDocs) return null;

  return (
    <div className="demo-resources not-prose">
      {trySlot}
      {hasDocs && (
        <div className="demo-resources__row">
          <span className="demo-resources__icon" aria-hidden="true"><IconBook /></span>
          <span className="demo-resources__eyebrow">Read the docs</span>
          <span className="demo-resources__value">
            {docs.map((d, i) => (
              <span key={d.url}>
                {i > 0 && <span className="demo-resources__sep" aria-hidden="true">·</span>}
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-resources__doc-link"
                >
                  {d.label}
                </a>
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
};

export default DemoResources;
