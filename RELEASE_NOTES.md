# Release Notes

## 15.1.0 — 2026-11-01

### Changed

- Updated the Discord, OpenAI, common, and test packages to version 15.
- Expanded setup, command, configuration, deployment, and troubleshooting guides.
- Clarified which recent Discord messages Ask can send with a question.
- Changed responses to use `gpt-6-luna` with low reasoning.
- Added the Discord guild locale as a fallback when an interaction has no user locale.
- Updated shutdown to use the Discord client method to remove library handlers and locale state.
