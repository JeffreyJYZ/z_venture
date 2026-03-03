# Z Venture

<p style="font-weight: bold; font-size: 20px; font-style: italic; color: crimson;">IN EARLY STAGES OF DEVELOPMENT</p>

**Early Access**: [z-venture.vercel.app](https://z-venture.vercel.app)

**For curious users, this project is not usable yet.**
This repository is for **viewing purposes only**.

### 🚫 Prohibited Use Policy

Under the [CC BY-NC-ND 4.0](LICENSE) license, you are strictly forbidden from:

- Using this code/content for your own projects.
- Modifying, adapting, or creating derivative works.
- Using this material for any commercial purpose, including professional, business, or monetary gain.

**Violations will result in a DMCA takedown request to GitHub.**

## Package manager

This project uses `pnpm`.

### Setup

[Install pnpm](https://pnpm.io/installation) first.

```bash
pnpm install
```

add a postgressql database url for [prisma](https://www.prisma.io/docs) in .env

```bash
npx prisma db push
npx prisma generate
pnpm dev
```

### Common commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
```
