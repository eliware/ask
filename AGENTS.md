# AGENTS.md

## Project

This repository is `eliware/ask`. It provides a Discord assistant for short answers.

## Scope and boundaries

Use README.md for repository purpose, scope, and ownership. Keep requirements in their authoritative specifications.

## Layout

Use README.md and specs/README.md to find repository files.

## Development

Keep each source and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and npm 12 or later.

Use native ESM for maintained JavaScript modules.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep credentials, secret values, private data, and runtime state out of Git.

## Changes

Keep changes in this repository. Get approval from Eliware Operations before external changes.

## Application

Run focused tests first during development.
Pass one or more test paths to `npm test` for focused testing.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## Discord

Document commands, events, permissions, intents, and supported locales in README.md.

## GHCR publication

Image: ghcr.io/eliware/ask

Pull command: docker pull ghcr.io/eliware/ask:v15.1.0

Supported tags: vMAJOR.MINOR.PATCH

Deployment boundary: Publication does not deploy. Use an immutable version tag and record its SHA-256 digest.
