
# Krakend Playground Demo Builder

This repository contains the codebase for generating the Krakend Playground demo website using Next.js.

## Getting Started

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of your project with the following content:

```bash
NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise
```

The `NEXT_PUBLIC_KRAKEND_LICENSE_TYPE` environment variable can be set to either `"enterprise"` or `"open-source"` depending on which playground you want to generate.

### Running the Development Server

To start the development server, you can use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

### Adding or Updating Use-Case Demo Pages

You can add or edit use-case demo pages by modifying the `.mdx` files located in the `pages/use-cases` directory.

#### Sample File for a New Use-Case

To create a new use-case page, you can use the following structure in a `.mdx` file:

```mdx
import MdxLayout from '@/components/MdxLayout';

## About this demo
- One
- Two
- Three

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>
}
```
