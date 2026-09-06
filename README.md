# Docker CI/CD

A small Express API packaged with Docker and deployed through GitHub Actions. The
service exposes a greeting endpoint and a health check, while the workflow builds
and publishes the image to GitHub Container Registry (GHCR) and updates a Docker
Compose deployment on a remote server.

## Endpoints

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/` | JSON greeting: `{"message":"Hello from CI/CD!"}` |
| `GET` | `/health` | `OK` |

The application listens on port `3000`.

## Prerequisites

- Node.js 22 or later
- npm
- Docker and Docker Compose (for containerized development)

## Run locally with Node.js

Install dependencies and start the API:

```bash
npm ci
npm start
```

The API is available at <http://localhost:3000>.

## Run locally with Docker Compose

The development Compose file mounts the repository into a Node.js container:

```bash
docker compose -f compose.yml up
```

Open <http://localhost:3000> or check the service with:

```bash
curl http://localhost:3000/health
```

Stop the service with:

```bash
docker compose -f compose.yml down
```

## Build and run the production image

Build the image from the included `Dockerfile`:

```bash
docker build -t docker-ci-cd .
```

Run it on port `3000`:

```bash
docker run --rm -p 3000:3000 docker-ci-cd
```

## CI/CD deployment

The workflow in `.github/workflows/deploy.yml` runs when changes are pushed to
`main`. It:

1. Builds the Docker image.
2. Pushes `latest` and the commit-specific image tag to
   `ghcr.io/mcavdar/docker-ci-cd`.
3. Connects to the configured home server over SSH.
4. Runs `docker compose pull` and `docker compose up -d` in
   `/opt/apps/hello-api`.

Configure these repository secrets before enabling deployment:

- `SERVER_HOST`: remote server hostname or IP address
- `SERVER_USER`: SSH user
- `SERVER_SSH_KEY`: private SSH key used by the deployment action

The remote Compose configuration should reference the image published to GHCR
and have permission to pull private packages if the container image is not
public.

## Project structure

```text
.
├── .github/workflows/deploy.yml  # Build, publish, and deploy workflow
├── compose.yml                   # Local development Compose configuration
├── Dockerfile                    # Production image definition
├── package.json                  # Node.js scripts and dependencies
└── src/index.js                  # Express application
```

