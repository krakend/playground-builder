/**
 * Resolves a relative or absolute URL against a base URL.
 * If the base URL is relative, it returns the resolved path without a protocol.
 *
 * @param from The base URL or relative path.
 * @param to The target URL or relative path to resolve.
 * @returns The fully resolved URL as a string.
 */
export function resolveUrl(from: string, to: string) {
  const resolvedUrl = new URL(to, new URL(from, "resolve://"));

  if (resolvedUrl.protocol === "resolve:") {
    // `from` is a relative URL.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}
