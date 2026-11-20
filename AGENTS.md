# AGENTS.md

## Project

This repository contains the Ask Discord assistant.

## Scope and boundaries

Keep canonical requirements in their specifications.

## Layout

Use README.md and specs/README.md to navigate the repository.

## Development

Keep each source module and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep credentials, private data, and runtime state out of Git.

## Changes

Change files in this repository.

## Application

Run focused tests first during development.
Pass one or more test paths to `npm test` for focused testing.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## Discord

Keep Discord guidance aligned with application behavior.

## GHCR publication

Image: ghcr.io/eliware/ask

Pull command: docker pull ghcr.io/eliware/ask:v15.2.0

Supported tags: vMAJOR.MINOR.PATCH

Deployment boundary: Publication does not deploy. Use an immutable version tag and record its SHA-256 digest.
