# AI Mystery Room

An interactive, fictional detective game built with React, Express, MongoDB, and Google Gemini. Mysteries are generated from a server-side canonical blueprint; private solution fields are only returned after an accusation.

## Requirements

- Node.js 20+
- MongoDB 7+ (local or Atlas)
- A Google Gemini API key for case generation

## Setup

1. Copy `server/.env.example` to `server/.env` and configure MongoDB, a long random session secret, and `GEMINI_API_KEY` / `GEMINI_TEXT_MODEL`.
2. Copy `client/.env.example` to `client/.env` if the API is not at `http://localhost:5000/api/v1`.
3. Run `npm install` from the repository root.
4. Run `npm run dev`. The client is at `http://localhost:5173`; the API health endpoint is `http://localhost:5000/api/v1/health`.

If your network's DNS resolver refuses MongoDB Atlas SRV lookups, you can optionally set `DNS_SERVERS=8.8.8.8,8.8.4.4` in `server/.env` to use alternate DNS servers for the server process.

Without Gemini credentials the service reports generation as failed; it never presents fabricated content as an AI-generated case. Image and audio generation are optional and currently fall back to text evidence.

## Architecture

- `client/`: responsive React/TypeScript application using Vite.
- `server/`: Express API, Mongoose persistence, validation, secure anonymous sessions, and asynchronous generation worker.
- `spec.md`: authoritative product requirements.

Case generation uses a blueprint, evidence generation, deterministic structural checks, and bounded retries. Anonymous cases are scoped to a signed, HTTP-only session cookie. Configure `CLIENT_ORIGIN` explicitly for deployment and serve production over HTTPS.
