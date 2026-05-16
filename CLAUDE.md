# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for building the KrakenD Playground demonstration website. It generates static HTML/CSS/JS content that runs under the relative path `/demo`. The project has two license types:

- **Open Source** (CE): Community Edition
- **Enterprise** (EE): Enterprise Edition with additional features

## Repository Structure & Dependencies

This project is part of a multi-repository setup:

- `../playground-enterprise/` - Enterprise edition source and deployment target
- `../playground-community/` - Community edition source and deployment target

This repo **reads** `krakend.json` from sibling repos (source of truth) and **writes** generated static files back to them. The local file `public/demo/data/krakend.json` is a build artifact — never edit it directly.

⚠️ **If sibling repos are missing or outdated**, the build will fail or generate stale content.

## Development Workflow

### Pre-requisites

Before building, ensure:
- Sibling repositories exist at the paths above
- They are on the correct branch and up-to-date (`git pull`)
- Source `krakend.json` in sibling repos reflects the desired state

### End-to-End Flow

1. **Make changes in the sibling repo** (source of truth):
   - Edit `config/krakend/krakend.json` (and/or `extended/templates/` for EE)
   - Source files in sibling repos also include `extended/settings/**/*.yml`

2. **Create or update MDX files** in this repo if endpoints changed:
   - New endpoint → new MDX file in `src/pages/use-cases/`
   - Removed endpoint → remove corresponding MDX file
   - Changed endpoint config → review inline snippets in MDX (see Snippet Alignment below)

3. **Build** with `make build_ce` or `make build_ee`
   - This copies `krakend.json` from sibling repo, builds the static site, and copies output back

4. **Verify** the generated site:
   - `make serve_static` and check at `http://localhost:8080/demo`
   - Run the validation script (see "Validating Content") to catch missing MDX files

5. **Ask the user** how to proceed with commits — the changes may span multiple repos and be part of a larger workflow

### Snippet Alignment

MDX files may contain **inline code snippets** that reference specific configuration blocks (e.g., `auth/api-keys` settings). These snippets are hardcoded in the MDX and are NOT auto-generated from `krakend.json`.

When modifying endpoint configurations in the sibling repos, **always review the corresponding MDX file** for inline snippets that may need updating to stay aligned with the actual configuration.

### Credentials Redaction

Source `krakend.json` in the sibling repos contains real LLM provider keys (Gemini / OpenAI / Anthropic) when compiled with `make start-with-ai-gateway`. The build pipeline strips those out before bundling into the static site:

- `make build_ce` / `make build_ee` copy the sibling `krakend.json` and then call the `redact_credentials` target
- `redact_credentials` runs a sed pass that replaces every `AIzaSy*` / `sk-proj-*` / `sk-ant-*` value with `<REDACTED_*_API_KEY>` placeholders

Pre-commit invariant for `public/demo/data/krakend.json`: zero real credentials, only `<REDACTED_*_API_KEY>` placeholders.

## Build Commands

### Development

```bash
# Install dependencies
npm install

# Start development server (CE edition)
npm run dev
# OR using Docker
make start_ce

# Start development server (EE edition)
NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise npm run dev
# OR using Docker
make start_ee
```

### Production

```bash
# Build the project (Enterprise Edition)
make build_ee

# Build the project (Community Edition)
make build_ce

# Serve static files locally (after build)
make serve_static
# OR
docker run -it -v "$PWD/out:/usr/share/nginx/html/demo" -p "8080:80" nginx
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Environment Configuration

Create a `.env` file in the root with:

```
NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise
# OR
NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source
```

## Project Architecture

### Key Components

1. **Layouts**:
   - `Layout.tsx`: Base layout with header and footer
   - `MdxLayout.tsx`: Layout for use-case pages with endpoint documentation. Reads `resources` exported by each MDX and feeds it to `DemoResources` (rail above the prose) + `AIGatewayNotice` (top-right chip when `aiFeature: true`). Renders the METHOD + path chip inside the code panel header.
   - `IntegrationLayout.tsx`: Layout for integration documentation pages. Same `resources` contract as MdxLayout.

2. **Shared documentation components** (`src/components/`):
   - `DemoResources.tsx`: standardised rail at the top of every detail page — Try it row (variants: `tryUrl` → URLInputBox, `interactive` → external link card) + Read the docs row.
   - `URLInputBox.tsx`: address-bar-style component with an editable param + gradient Open button. Used as the `tryUrl` flavour of DemoResources.
   - `AIGatewayNotice.tsx`: single morphing container that goes from a top-right chip ("Heads up: This is an AI Gateway feature") to an expanded modal explaining the license + provider-credentials prerequisites. Rendered when `resources.aiFeature === true`.
   - `mdx-components.tsx`: provides a custom `<Pre>` that wraps every prose `<pre>` with a copy button matching the dedicated code panel's behaviour, and registers `DemoResources` as a globally-available MDX component.

2. **Content Types**:
   - **Use Cases**: MDX files in `pages/use-cases/` showcasing KrakenD endpoints
   - **Integrations**: MDX files in `pages/integrations/` for enterprise and open-source integrations

3. **Data Sources**:
   - `public/demo/data/krakend.json`: API endpoint configurations (build artifact, copied from sibling repo)
   - `public/demo/data/integrations.json`: Integration documentation metadata

4. **Static Generation**: Next.js generates static files with:
   - MDX rendering for content pages
   - Tailwind CSS with SCSS for styling
   - SVG imports via SVGR (SVGs become React components)
   - Base path configured to `/demo` with trailing slashes enabled
   - Syntax highlighting via Prism.js for code blocks
   - Images unoptimized for static export compatibility

### Routing and URL Generation

The application uses a slug-based routing system that connects MDX files to data sources:

**Use Cases:**
- MDX file names in `pages/use-cases/` must match slugs generated from endpoints in `krakend.json`
- Slugs are created by the `createSlug()` function in `MdxLayout.tsx`:
  - Convert to lowercase
  - Replace spaces and underscores with hyphens
  - Remove special characters
  - Collapse multiple hyphens
  - Strip leading/trailing slashes and hyphens
- Example: Endpoint `/api-key` → slug `api-key` → file `pages/use-cases/api-key.mdx`

**Integrations:**
- MDX file names in `pages/integrations/{enterprise|open-source}/` must match the `slug` field in `integrations.json`
- Integration layout reads metadata (name, title, description, iconUrl) from the JSON file

**Data Extraction:**
- Use case pages extract metadata from the `@comment` field in endpoint configurations
- Format: `"@comment": "Tag: Name"` (e.g., `"Feature: API Key Authentication"`)
- The tag and name are displayed in the page header

### Homepage Organization

Categories on the homepage are displayed in **alphabetical order**. This is controlled by:

- **Component**: `src/components/Home/UseCases/index.tsx`
- **Sorting**: `.filter(key => key !== "others").sort()` before rendering
- **Categories**: Extracted from `tags[0]` in `extra_config.documentation/openapi.tags`

To change category order: modify the React component sorting logic, not the data files.

## Adding New Content

> See "Development Workflow" above for the full end-to-end process, including where to make changes (sibling repos are the source of truth).

### Adding Use Cases

1. **Add endpoint configuration** to the source krakend.json in the sibling repository:
   - Location: `../playground-{community|enterprise}/config/krakend/krakend.json`
   - Add to the `endpoints` array
   - Include `@comment` field (format: `"Tag: Name"`)
   - Add OpenAPI metadata in `extra_config["documentation/openapi"]`
   - Add Postman metadata in `extra_config["documentation/postman"]`
   - If using templates, also update files in `extended/templates/`
   - Endpoints whose `@comment` starts with `Utility:` or `Internal:` are infrastructure (gateway-side plumbing, internal aggregators, static asset servers) — they don't surface as user-facing cards and don't need an MDX file; the validation script skips them too.

2. **Create MDX file** in `src/pages/use-cases/` with a filename matching the endpoint slug. The page MUST export a `resources` block that drives the standardised Try it + Read the docs rail rendered above the prose:

```mdx
import MdxLayout from '@/components/MdxLayout';

export const resources = {
  // Optional. Renders an inline URL preview with an Open button. Use this
  // when the endpoint can be hit directly via GET (no body, no required
  // header). isStatic: true skips the editable param input.
  tryUrl: {
    endpoint: "http://localhost:8080/your-endpoint/",
    placeholder: "param hint shown in the input",
  },
  // Optional. External link card — pick this when the meaningful test is
  // a richer flow in the Interactive Demos SPA. Mutually exclusive with
  // tryUrl (tryUrl wins if both are set).
  interactive: {
    url: "http://localhost:8080/interactive-demo/#your-tab",
    label: "Your interactive demo label",
  },
  // Optional. Curated doc links shown in the Read the docs row.
  docs: [
    { url: "https://www.krakend.io/docs/...", label: "Topic name" },
  ],
  // Optional. AI Gateway demos set this to surface a top-right notice
  // chip that morphs into a modal explaining the license + provider-key
  // prerequisites (Gemini / OpenAI / Anthropic + `make start-with-ai-gateway`).
  aiFeature: true,
};

## Page title heading

Body prose. Do NOT add a `## Endpoint /path` heading — the METHOD + path
chip is rendered automatically inside the code panel header by the layout
based on `krakend.json`.

export default function MDXPage({ children }) {
  return <MdxLayout resources={resources}>{children}</MdxLayout>
}
```

3. **Rebuild** the project with `make build_ce` or `make build_ee` to see changes

### Adding Integrations

1. **Add integration metadata** to `public/demo/data/integrations.json`:

```json
{
  "name": "Tool Name",
  "title": "Integration Display Title",
  "description": ["Description paragraph for the integration"],
  "iconUrl": "/demo/demo/images/icons/tool.svg",
  "slug": "integration-slug",
  "license": ["enterprise", "open-source"]
}
```

2. **Create MDX file** in the appropriate directory based on license type:
   - Enterprise: `src/pages/integrations/enterprise/{slug}.mdx`
   - Open Source: `src/pages/integrations/open-source/{slug}.mdx`
   - Filename must match the `slug` field from JSON
   - Same `resources` export pattern as use cases (see above); `interactive` is the natural fit when the integration opens a separate dashboard (Kibana / Grafana / Jaeger)

```mdx
import IntegrationLayout from '@/components/IntegrationLayout';

export const resources = {
  interactive: {
    url: "http://localhost:16686/search",
    label: "Open Jaeger",
  },
  docs: [
    { url: "https://www.krakend.io/docs/telemetry/jaeger/", label: "Jaeger telemetry" },
  ],
};

## About this demo
Integration details and usage instructions...

export default function MDXPage({ children }) {
  return <IntegrationLayout resources={resources}>{children}</IntegrationLayout>
}
```

3. **Add icon** (if needed) to `public/demo/images/icons/` directory

### Validating Content

After adding or removing endpoints, run the validation script to catch MDX drift in either direction (missing files for new endpoints, orphan files for removed ones):

```bash
node scripts/validate-mdx.js
```

It reads the compiled `public/demo/data/krakend.json`, filters out `Utility:` / `Internal:` endpoints (same filter the homepage applies), and confirms a 1-to-1 mapping with `src/pages/use-cases/*.mdx`. Exits 1 on any drift, intended for CI / pre-build sanity checks.
