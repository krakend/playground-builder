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
   - `MdxLayout.tsx`: Layout for use-case pages with endpoint documentation
   - `IntegrationLayout.tsx`: Layout for integration documentation pages

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
