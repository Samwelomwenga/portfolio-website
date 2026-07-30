# Terminal Portfolio

This is a terminal-inspired portfolio. The site presents profile details, skills, experience, projects, draft blog topics, social links, theme controls, and a contact form.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  -
  - [Useful resources](#useful-resources)
- [Getting started](#getting-started)
  - [Environment variables](#environment-variables)
  - [Available scripts](#available-scripts)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Navigate the portfolio through accessible terminal-style tabs and hash routes.
- View responsive sections for home, about, skills, experience, projects, blogs, and contact.
- Filter project and blog archive views.
- Switch between theme palettes and color modes with persisted preferences.
- Use assistant prompt chips to generate short portfolio summaries.
- Submit a contact form through Formspree with optional Google reCAPTCHA support.

### Screenshot

Add a current desktop or mobile screenshot at `./screenshot.png` before publishing the solution.

### Links

- Repository URL: Add repository URL
- Live Site URL: Add deployed site URL

## My process

### Built with

- Semantic HTML landmarks and labeled regions
- Accessible tabs, dialogs, live regions, and form labels
- React 19
- TypeScript
- Vite
- Tailwind CSS v4 custom utilities
- Motion for interface animation
- Radix UI primitives
- Formspree contact handling
- Google reCAPTCHA v3
- Playwright end-to-end tests
- ESLint with React effect guidance

### Useful resources

- [React documentation: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) - Useful for keeping state and effects simpler.
- [Tailwind CSS documentation](https://tailwindcss.com/docs) - Used for utility-first styling patterns and custom utilities.

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

### Environment variables

Create a local `.env` file when contact form submissions are needed:

```bash
VITE_FORMSPREE_FORM_ID=your_formspree_form_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

`VITE_RECAPTCHA_SITE_KEY` is optional for local UI work. `VITE_FORMSPREE_FORM_ID` is required for live contact form submissions.

### Available scripts

```bash
pnpm lint
pnpm lint:fix
pnpm build
pnpm test:e2e
```

## Author

- GitHub - [@samwelomwenga](https://github.com/samwelomwenga)
- LinkedIn - [Samwel Omwenga](https://www.linkedin.com/in/samwelomwenga)
- X - [@Samwel_codes](https://x.com/Samwel_codes)
