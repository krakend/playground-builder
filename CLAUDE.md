# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for building the KrakenD Playground demonstration website. It generates static HTML/CSS/JS content that runs under the relative path `/demo`. The project has two license types:

- **Open Source** (CE): Community Edition
- **Enterprise** (EE): Enterprise Edition with additional features

## Repository Structure & Dependencies

This project is part of a multi-repository setup and requires sibling repositories to function:

### Required Sibling Repositories

- `../playground-enterprise/` - Enterprise edition source and deployment target
- `../playground-community/` - Community edition source and deployment target

These repositories MUST:
- Exist at exactly these relative paths from this repository
- Contain `config/krakend/krakend.json` with endpoint definitions (both)
- Contain `config/krakend/extended/templates/` with endpoint templates (enterprise)
- Be up-to-date (the build copies data FROM them)

### What This Repository Does

- **Generates**: Static HTML/CSS/JS site from source data
- **Reads FROM**: `../playground-{enterprise|community}/config/krakend/krakend.json` (source of truth)
- **Writes TO**: `../playground-{enterprise|community}/config/krakend/demo/` (generated output)
- **Does NOT**: Store source endpoint configurations (only copies during build)

⚠️ **If sibling repos are missing or outdated**, the build will fail or generate stale content.

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

## Environment Configuration

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
   - `MdxLayout.tsx`: Layout for use-case pages with endpoint documentation
   - `IntegrationLayout.tsx`: Layout for integration documentation pages

2. **Content Types**:
   - **Use Cases**: MDX files in `pages/use-cases/` showcasing KrakenD endpoints
   - **Integrations**: MDX files in `pages/integrations/` for enterprise and open-source integrations

3. **Data Sources**:
   - `public/demo/data/krakend.json`: Contains API endpoint configurations
   - `public/demo/data/integrations.json`: Integration documentation metadata

### Build Process

The build process follows this workflow:

1. **Data Import**: Copies `krakend.json` from the source of truth in sibling repository:
   - CE: `../playground-community/config/krakend/krakend.json`
   - EE: `../playground-enterprise/config/krakend/krakend.json`

   ⚠️ **IMPORTANT**:
   - The local file `public/demo/data/krakend.json` is a build artifact (copy from source)
   - Never edit it directly - changes will be overwritten on next build
   - This file IS committed to track the last build state
   - Always edit source files in sibling repositories:
     - Main config: `config/krakend/krakend.json`
     - Templates: `config/krakend/extended/templates/*.json`
     - YAML configs: `config/krakend/extended/settings/**/*.yml`

2. **Static Generation**: Next.js generates static files with:
   - MDX rendering for content pages
   - Tailwind CSS with SCSS for styling
   - SVG imports via SVGR (SVGs become React components)
   - Base path configured to `/demo` with trailing slashes enabled
   - Syntax highlighting via Prism.js for code blocks
   - Images unoptimized for static export compatibility

3. **Output Distribution**: Build artifacts from `out/` are copied back to sibling repositories:
   - CE: `../playground-community/config/krakend/demo`
   - EE: `../playground-enterprise/config/krakend/demo`

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

⚠️ **CRITICAL: Where to Make Changes**

This repository generates static content from source data in sibling repositories.

**Edit these (source of truth)**:
- `../playground-{enterprise|community}/config/krakend/krakend.json`
- `../playground-{enterprise|community}/config/krakend/extended/templates/*.json`

**Do not edit directly (build artifacts - but committed for tracking)**:
- `public/demo/data/krakend.json` (copy from source, overwritten on each build)

After editing source files, rebuild this project to regenerate the static site. The updated
`krakend.json` copy should be committed to track the last successful build state.

### Adding Use Cases

1. **Add endpoint configuration** to the source krakend.json in the sibling repository:
   - Location: `../playground-{community|enterprise}/config/krakend/krakend.json`
   - Add to the `endpoints` array
   - Include `@comment` field (format: `"Tag: Name"`)
   - Add OpenAPI metadata in `extra_config["documentation/openapi"]`
   - Add Postman metadata in `extra_config["documentation/postman"]`
   - If using templates, also update files in `extended/templates/`

2. **Create MDX file** in `src/pages/use-cases/` with a filename matching the endpoint slug:

```mdx
import MdxLayout from '@/components/MdxLayout';

## Endpoint
```
/your-endpoint
```

## About this demo
- Feature point one
- Feature point two
- Feature point three

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>
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

```mdx
import IntegrationLayout from '@/components/IntegrationLayout';

## About this demo
Integration details and usage instructions...

export default function MDXPage({ children }) {
  return <IntegrationLayout>{children}</IntegrationLayout>
}
```

3. **Add icon** (if needed) to `public/demo/images/icons/` directory

### Validating Content

After adding new endpoints, validate that all endpoints have corresponding MDX files:

**Quick validation script**:

```javascript
const fs = require('fs');
const krakend = JSON.parse(fs.readFileSync('public/demo/data/krakend.json', 'utf8'));

const createSlug = (endpoint) => endpoint.toLowerCase()
  .replace(/ /g, "-").replace(/_/g, "-")
  .replace(/[^a-z0-9/-]/g, "").replace(/(?!^)\//g, "-")
  .replace(/--+/g, "-").replace(/-$/g, "").replace("/", "");

const missingFiles = krakend.endpoints
  .map(ep => createSlug(ep.endpoint))
  .filter(slug => !fs.existsSync(`src/pages/use-cases/${slug}.mdx`));

if (missingFiles.length > 0) {
  console.log("Missing MDX files:", missingFiles);
}
```

This helps catch missing documentation before deployment.
