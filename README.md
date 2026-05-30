# Saturno Enneagram Experience

A modern Enneagram personality test built with Next.js, Tailwind CSS, and Vercel deployment automation.

## Local development

```bash
cd saturno
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What’s included

- Interactive Enneagram personality quiz experience
- Responsive Tailwind CSS brand system
- Clean landing page with quiz CTA and product storytelling
- Automated build, lint, typecheck, and test workflows
- Production-ready Vercel configuration

## Production automation

This project is ready for automated production deployments with Vercel and GitHub Actions.

### Available commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
```

### GitHub Actions CI

A workflow is configured to run on push and pull request events. It installs dependencies, lints the code, type-checks, builds the app, and runs unit tests.

## Deployment

The Vercel project should deploy from the `saturno/` folder.

### Custom domain

1. Add `saturnodesouza.com` to the Vercel project.
2. Configure DNS records per Vercel’s instructions.
3. Verify the site loads at `https://saturnodesouza.com`.

## Next product work

- Add type-specific growth stories and sharing actions
- Add analytics for quiz completion and conversion tracking
- Improve quiz UX with animations and onboarding guidance
- Add branding visuals, hero illustration, and social proof
