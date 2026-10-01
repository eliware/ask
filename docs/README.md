# Ask documentation

Purpose: explain how to configure, use, and troubleshoot the Ask Discord application.

Scope: this directory contains end-user documentation for `@eliware/ask`; it does not define deployment ownership, release approval, or production procedures.

## Setup

Install dependencies with `npm ci`. Copy `.env.example` to an untracked `.env` and set the required Discord application ID, Discord bot token, and OpenAI API key before running the app.

## Validation

Run `npm test` from the repository root. It runs the application tests and applicable Eliware validation stages.

## Support

Use the community support link in the root README.

## Contents

- [Usage](docs/usage.md)
- [Troubleshooting](docs/troubleshooting.md)
