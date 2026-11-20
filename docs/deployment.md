# Container deployment

The Ask container uses `ghcr.io/eliware/centos10-node26:latest`. It runs as the unprivileged `node` user and listens on port `3000` for health checks. Docker Compose builds the local Dockerfile and keeps the health port private.

## Build and run from source

Install Docker Engine with Docker Compose. Create `.env` in the repository root and set the values listed in [configuration](configuration.md).

Run these commands from the repository root:

```sh
docker compose up -d --build
docker compose ps
docker compose logs -f ask
```

Check the `ask` container status in `docker compose ps`. Docker marks the container healthy after `/ready` returns `200`. The container remains unhealthy until Discord connects.

Run this command to stop and remove the container:

```sh
docker compose down
```

## Health checks

Ask serves `GET /health` and `GET /ready` on port `3000`. `/health` returns `200` while the health server replies. `/ready` returns `503` until the Discord client connects. Ask also clears readiness when Discord invalidates its session.

Docker Compose checks `/ready` from inside the container. It does not publish port `3000` to the host. For a Kubernetes HTTP check, set `HEALTH_HOST=0.0.0.0` so the check can access the server through the Pod IP.

## Run a published image

The image name is `ghcr.io/eliware/ask`. Package settings control access. Use an approved version tag or the immutable digest from the release workflow.

Replace `<version>` with an approved tag, then run:

```sh
docker pull ghcr.io/eliware/ask:<version>
docker run --rm --env-file .env -p 127.0.0.1:3000:3000 ghcr.io/eliware/ask:<version>
```

Set `HEALTH_HOST=0.0.0.0` in `.env` to check the container health routes from the host. Keep credentials in `.env` or a deployment secret store. Publication does not deploy Ask. For a deployment, follow the deployment owner's approval process and use the recorded SHA-256 digest when the platform supports digest references.

The publish workflow runs for tags that match `vMAJOR.MINOR.PATCH`. It checks the package version, publishes a version tag, verifies the image digest, and records the digest in the workflow summary.

## Stop a container

Run `docker compose down` or send a stop signal to the container. Ask closes its Discord client during shutdown.
