# Welcome to React Router

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 💾 PostgreSQL + DrizzleORM
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

These are the environment variables the project uses:

```js
NODE_ENV = 'development'
DB_URL = 'postgres://rendres@localhost:5432/wedding'
DB_PASS = 's3cr3t'

LOGTO_ENDPOINT = 'http://localhost:3001'
LOGTO_APP_ID = 'ew8dqhsw5s6r274i8g73y'
LOGTO_APP_SECRET = 'some_logto_secret'
LOGTO_BASE_URL = 'http://localhost:3000'

SPOTIFY_CLIENT_ID = '3433502d2fb94c7d9829be06efceda4b'
SPOTIFY_CLIENT_SECRET = 'some_spotify_secret'

STORAGE_S3_ACCESS = 'OPNH2C30YYOZ03VWQ8X6'
STORAGE_S3_BUCKET = 'losgordissecasan'
STORAGE_S3_SECRET = 'some_s3_secret'
```

Run an initial database migration:

```bash
npm run db:migrate
```

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

To build and run using Docker:

```bash
# For npm
docker build -t my-app .

# For pnpm
docker build -f Dockerfile.pnpm -t my-app .

# For bun
docker build -f Dockerfile.bun -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── server.js
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
