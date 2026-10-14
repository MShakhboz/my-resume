# Shaxboz Mirzomurotov: Resume Website

The personal resume site of Shaxboz Mirzomurotov, Senior Frontend Developer (React, Next.js, TypeScript).

Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4. Tested with Vitest, React Testing Library, Playwright and axe-core. CI runs on GitHub Actions.

## Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test           # unit and component tests
pnpm build
pnpm test:e2e       # end-to-end and accessibility tests (needs a build; first run: pnpm exec playwright install chromium)
```

## Content

Resume content lives in `src/entities/*/model.ts`, and the PDF downloads are in `public/resume/`. Both come from the PDF build scripts in the parent folder.
