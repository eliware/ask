# Container deployment

The GHCR image runs the Ask Discord assistant as the unprivileged `node` user. The repository maintainers own the image build inputs. The publish workflow runs on `ubuntu-latest` and leaves the build platform unset, so Docker uses the runner default. It pushes a version tag and records an image digest. Publication does not deploy the bot.

## Build and run from source

1. Set the required values in an untracked `.env` file.
2. Run `docker compose up -d --build` from the repository root.
3. Run `docker compose logs -f ask` to view container logs.
4. Run `docker compose down` to stop and remove the container.

The Compose entry builds the local Dockerfile and starts again unless stopped. Docker checks `/ready` inside the container. Compose keeps the health port private. Direct runs use `127.0.0.1` by default.

Set `HEALTH_HOST=0.0.0.0` for a Kubernetes deployment that uses HTTP probes. Kubernetes probes connect to the Pod IP, so the health server must listen on an address that accepts connections from outside the container loopback interface. Keep `HEALTH_HOST` unset for local runs.

Use `GET /health` to check that the process responds. Use `GET /ready` to check the Discord client status. The endpoint returns `503` until the client emits `clientReady`, then returns `200`. Both endpoints listen on port `3000` inside the container.

## Run a published image

The image is published to `ghcr.io/eliware/ask`. Package settings determine who can pull it. Use a version tag for an approved release, or use the immutable digest recorded by the publish workflow.

1. Set the required values in an untracked `.env` file or deployment secret store.
2. Pull the selected version with `docker pull ghcr.io/eliware/ask:v15.1.1`.
3. Run the selected image with `docker run --env-file .env ghcr.io/eliware/ask:v15.1.1`.

For a deployment, replace the example version with an approved release tag. Record the SHA-256 digest and deploy by digest when the platform supports it. Publication does not grant deployment approval.

The GHCR workflow starts on version tags that match `vMAJOR.MINOR.PATCH`. It checks the package version, publishes the image, verifies its digest, and records the digest in the workflow summary.

## Stop a container

Send a stop signal to the container or run `docker compose down`. Ask closes its Discord client during shutdown.
