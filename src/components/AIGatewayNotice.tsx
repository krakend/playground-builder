"use client";
import { useEffect, useRef, useState } from "react";

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * AI Gateway notice — ONE container, two states:
 *   - closed: small chip at top-right (handle only)
 *   - open: same DOM element, expanded into a fixed modal with body visible
 * The element transitions its own size/padding/content rather than swapping
 * for a separate modal. Backdrop dims+blurs the page while open.
 */
const AIGatewayNotice: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    // Drop focus so the trigger doesn't render with a leftover focus ring.
    handleRef.current?.blur();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="ai-notice-backdrop"
          onClick={close}
        />
      )}
      <div
        className={`ai-notice ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-labelledby="ai-notice-handle"
      >
        <button
          ref={handleRef}
          id="ai-notice-handle"
          type="button"
          onClick={() => !open && setOpen(true)}
          className="ai-notice__handle"
          aria-expanded={open}
        >
          <span className="ai-notice__handle-icon"><IconInfo /></span>
          <span className="ai-notice__handle-text">
            {open ? "AI Gateway feature" : "Heads up: This is an AI Gateway feature"}
          </span>
          {!open && (
            <span className="ai-notice__handle-hint">more details</span>
          )}
          {open && (
            <span
              className="ai-notice__close"
              role="button"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); close(); }}
            >
              <IconClose />
            </span>
          )}
        </button>

        <div className="ai-notice__body">
          <p className="ai-notice__lede">
            To run this demo end-to-end you need two things in place:
          </p>

          <section className="ai-notice__section">
            <h4>1. License</h4>
            <p>
              AI Gateway is an Enterprise add-on. Standard EE licenses don&apos;t
              include it &mdash; if your license doesn&apos;t enable AI Gateway,
              the endpoint will reject the request at boot. Reach out to your
              account contact at KrakenD to enable it on your license.
            </p>
          </section>

          <section className="ai-notice__section">
            <h4>2. Provider credentials</h4>
            <p>
              Add your <code>GEMINI_API_KEY</code>, <code>OPENAI_API_KEY</code>{" "}
              and <code>ANTHROPIC_API_KEY</code> to{" "}
              <code>config/krakend/.env.local</code>, then start the playground
              with:
            </p>
            <pre className="ai-notice__cmd"><code>make start-with-ai-gateway</code></pre>
            <p>
              Without keys the endpoint still responds, but the upstream LLM
              call will return an error.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AIGatewayNotice;
