# franz.theavenir.dev

Personal portfolio built with vanilla JavaScript and Vite.

## Where things live

```text
api/                    Vercel serverless endpoints
public/images/          Images served directly by the site
src/
  app/                  Application startup and feature wiring
  assets/               Source assets imported by application code
  components/
    layout/             Header, footer, and page shell
    ui/                 Small reusable UI components
  content/              Text, links, projects, and guestbook notes
  features/
    contact/            Email copy behavior
    github/             Contribution calendar UI and data loading
    guestbook/          Guestbook markup and swan physics
    projects/           Project cards and carousel behavior
  pages/                Full page templates
  styles/               Styles split by page or feature
```

Start with `src/content/` when changing site copy or links. For a visual or
behavioral change, open the matching folder under `src/features/` and the
same-named file under `src/styles/`.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide a GitHub token if you want the
contribution calendar to load through the Vercel API.

## Checks

```bash
npm run format
npm run check
```
