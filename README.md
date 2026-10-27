# AI Mystery Room

> **Every Mystery Has a Secret.**

AI Mystery Room is an AI-powered detective game. You write a short story premise, and the app turns it into a complete fictional investigation with suspects, motives, a timeline, alibis, clues, red herrings, and a hidden culprit. You then examine the evidence, connect the contradictions, and accuse a suspect. The backend judges your answer and reveals the solution with an explanation that cites the evidence in your case.

All characters, events, conversations, and evidence are **fictional and AI-generated**. Nothing in this app is real forensic evidence, and nothing connects to real WhatsApp or any real messaging account.

> **AI creates the story. The backend preserves the truth. Evidence lets the player discover it.**

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How It Works](#how-it-works)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Project Structure](#project-structure)
8. [API Overview](#api-overview)
9. [Security and Privacy](#security-and-privacy)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Current Status and Known Limitations](#current-status-and-known-limitations)
13. [Roadmap](#roadmap)
14. [Specification](#specification)

---

## Features

**Implemented in this release**

- **Mystery creation** from a free-text premise, with optional title, setting, category, difficulty, number of suspects, and evidence preferences.
- **Canonical-plan generation.** Gemini produces one structured case blueprint; suspects, evidence, and the solution are all derived from it so they stay consistent.
- **Validation before play.** Suspects, evidence, timelines, and clues are checked, and a case becomes playable only after it passes.
- **Asynchronous generation** with a status page, bounded retries, and a retry action for failed cases.
- **Investigation room** with a case overview, suspect profiles and alibis, an evidence locker with filters and search, and an evidence detail view.
- **Fictional chat-style evidence** (clearly labelled as fictional), documents, and witness statements.
- **Progress tracking:** viewed evidence, bookmarks, and investigator notes persist so you can resume a case.
- **Accusation and reveal.** Correctness is calculated on the backend. The results page explains the motive, timeline, decisive evidence, red herrings, and contradictions.
- **Replay and delete** for existing cases.
- **Anonymous, session-scoped access.** Cases belong to a protected session, and one session cannot see another's cases.
- **Responsive layout** for desktop and mobile.

**Optional media**

- Image and audio evidence requests fall back to **text-based evidence** (descriptions and labelled transcripts). The app never pretends media was generated, and it works fully without any image or audio provider.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini via the official Google Gen AI SDK (`@google/genai`) |
| Validation | Schema validation (e.g. Zod) for requests and model output |

The Gemini SDK is updated frequently. Check the [js-genai releases](https://github.com/googleapis/js-genai/releases) for current versions and changes.

---

## How It Works

```text
React client ──HTTPS/REST──> Express API ──> MongoDB
                                 │
                                 └──> Gemini (server-side only)
```

1. You submit a premise on the **Create** page.
2. The API validates the request, stores a case in the `queued` state, and returns a case ID immediately.
3. A background generation flow produces a **blueprint** (culprit, motive, true timeline, suspects, planned evidence).
4. Evidence is generated **from the blueprint**, not independently.
5. The server runs validation and solvability checks. On failure it retries a limited number of times, then marks the case `failed`.
6. On success the case becomes `playable`. The client only ever receives the **public** representation.
7. You investigate, then submit an accusation. The backend evaluates it against the stored solution and unlocks the results.

**Case lifecycle:** `queued → generating → validating → playable → completed` (or `failed`).

---

## Prerequisites

- **Node.js** 18 or newer (LTS recommended) and **npm**
- **MongoDB**, either a local instance or a MongoDB Atlas cluster
- A **Google Gemini API key** and a Gemini text model name available to your key (see [Google AI Studio](https://aistudio.google.com/))

---

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Configure environment files

Copy the example files and fill in the values:

```bash
# macOS / Linux
cp server/.env.example server/.env
cp client/.env.example client/.env
```

```powershell
# Windows (PowerShell)
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

See [Environment Variables](#environment-variables) for what each value means. **Never commit `.env` files.**

### 3. Start MongoDB

Make sure the database in `MONGODB_URI` is reachable. For a local install, start `mongod`; for Atlas, allow your IP address in the cluster's network access settings.

### 4. Run the app

```bash
npm run dev
```

This starts the client and the API together. By default:

- Client: <http://localhost:5173>
- API: <http://localhost:5000>
- Health check: <http://localhost:5000/api/v1/health>

### 5. Play

1. Open the client and click **Create a Mystery**.
2. Enter a premise (30–2,000 characters), for example:
   *"A rare painting disappears from a locked gallery during a private event."*
3. Wait for generation to finish. Time varies with the model and your rate limits.
4. Investigate the suspects and evidence, then make your accusation.

---

## Environment Variables

### Server: `server/.env`

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | API port (default `5000`) |
| `MONGODB_URI` | Yes | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/ai-mystery-room` |
| `GEMINI_API_KEY` | Yes | Gemini API key. **Server only; never expose to the browser.** |
| `GEMINI_TEXT_MODEL` | Yes | Gemini text model used for generation. Pick a model currently available to your key; don't assume a name stays available. |
| `CLIENT_ORIGIN` | Yes | Trusted frontend origin for CORS, e.g. `http://localhost:5173` |
| `SESSION_SECRET` | Yes | Long random string used to protect anonymous session identifiers |

Optional: `GEMINI_IMAGE_MODEL` and `GEMINI_AUDIO_MODEL` are reserved for future media generation and are not needed to run the app.

Generate a strong session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The server validates required variables on startup and fails fast with a clear message if any are missing. It never prints secret values.

### Client: `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | API base URL, e.g. `http://localhost:5000/api/v1` |

Anything prefixed with `VITE_` is bundled into the browser build. **Never put secrets in client variables.**

---

## Project Structure

```text
.
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB API, Gemini integration
├── SPEC.md          # Product & technical specification (source of truth)
├── README.md
└── package.json     # Root scripts (e.g. `npm run dev`)
```

Inside `server/`, the code follows the layering described in the spec: routes and controllers handle HTTP, services hold game and generation logic, the Gemini SDK is isolated behind a provider adapter, versioned prompt templates and output schemas live under the AI module, and explicit DTOs separate public case data from the private solution.

---

## API Overview

Base path: `/api/v1`. Every response uses a consistent envelope:

```json
{ "success": true, "data": {}, "requestId": "..." }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." }, "requestId": "..." }
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/cases` | Validate input and create a generation job |
| GET | `/cases` | List the current session's cases |
| GET | `/cases/:id` | Safe case overview |
| GET | `/cases/:id/status` | Generation status |
| POST | `/cases/:id/retry` | Retry a failed generation |
| DELETE | `/cases/:id` | Delete a case |
| GET | `/cases/:id/suspects` | Public suspect profiles |
| GET | `/cases/:id/evidence` | List evidence (player-safe) |
| GET | `/cases/:id/evidence/:evidenceId` | One evidence item |
| GET / PATCH | `/cases/:id/progress` | Read or update bookmarks, notes, viewed items |
| POST | `/cases/:id/accusations` | Submit an accusation |
| GET | `/cases/:id/results` | Results, available only after a valid accusation |
| POST | `/cases/:id/replay` | Reset progress for another attempt |

`POST /cases/:id/hints` is part of the spec but is **not implemented** in this release.

Example case creation request:

```json
{
  "premise": "A rare painting disappears from a locked gallery during a private event.",
  "setting": "A historic art gallery",
  "category": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "evidenceTypes": ["chat", "image", "document", "statement"]
}
```

Validation rules: premise 30–2,000 characters; 3–6 suspects; at least two evidence categories including text evidence.

---

## Security and Privacy

- **Gemini calls happen only on the server.** API keys never reach the browser.
- **The solution stays private.** Culprit, hidden timeline, secret motives, and evidence annotations are excluded from every response until an accusation is accepted. Public and private data use separate representations.
- **Backend-evaluated answers.** The client never decides correctness or reveal state.
- **Session-scoped ownership.** Anonymous sessions use protected identifiers; case, evidence, and suspect IDs are always checked against the caller's access.
- **Validated model output.** Responses from Gemini are checked against schemas before use; malformed output is rejected and retries are bounded.
- **Untrusted text.** User premises and generated content are treated as untrusted and rendered as escaped text, never as HTML or code.
- **Operational hygiene:** CORS limited to `CLIENT_ORIGIN`, request size limits, rate limiting on generation endpoints, and centralized error handling that doesn't leak stack traces or internal prompts.
- **Fiction only.** The app is not intended for real investigations, and requests that would produce real-world harmful instructions should be rejected or safely transformed.

Before deploying publicly, use HTTPS, secure cookies, a strong `SESSION_SECRET`, and a restricted MongoDB user.

---

## Testing

> **Status:** No automated tests have been run yet, and the app has not been compiled end to end in the build environment because `npm install` stalled there. Treat the first local run as the initial verification.

Suggested first checks after installing:

1. `GET /api/v1/health` returns a success response and the server connects to MongoDB.
2. Create a case and watch it move through generation to `playable`.
3. Confirm the case endpoints do **not** include the culprit or solution fields before an accusation.
4. Submit an accusation and confirm the results page works and cites existing evidence.
5. Reload the page and confirm notes and bookmarks persist.
6. Open the app in a second browser profile and confirm it cannot see the first session's cases.

If test or build scripts are defined in the `package.json` files (for example `npm run build` or `npm test`), run them from the root or the relevant workspace. The specification calls for unit, integration, and end-to-end coverage using a **mocked Gemini provider** so CI doesn't depend on live API calls.

---

## Troubleshooting

| Problem | What to check |
|---|---|
| `npm install` hangs or fails | Check your network/proxy and registry access, try `npm cache verify`, and retry. Use a supported Node.js LTS version. |
| Server exits on startup | A required variable is probably missing or empty. Read the error message and compare `server/.env` with `server/.env.example`. |
| MongoDB connection error | Verify `MONGODB_URI`, that MongoDB is running, and (for Atlas) that your IP is allowed and credentials are correct. |
| Browser shows CORS errors | `CLIENT_ORIGIN` must exactly match the client's origin, including port. |
| Client can't reach the API | Confirm `VITE_API_BASE_URL` and that the API is running. Restart Vite after editing `client/.env`. |
| Case stays `failed` | Check the server logs for the generation stage and error category. Common causes are an invalid API key, an unavailable model name, rate limits, or output that failed validation. Use **Retry**. |
| Gemini model errors | Confirm `GEMINI_TEXT_MODEL` is a model your key can use and that it supports structured output. |
| Cases disappear | Cases are tied to an anonymous session; clearing cookies or switching browsers starts a new session. |

---

## Current Status and Known Limitations

- **Unverified build.** The project was written but not installed, compiled, or tested in the authoring environment.
- **No authentication yet.** Access is anonymous and session-scoped.
- **No hints.** The hint endpoint and UI are not implemented.
- **No generated image or audio assets.** Those evidence requests degrade to text descriptions and transcripts.
- **No sharing or multiplayer.**
- **AI output varies.** Validation reduces inconsistent cases but cannot guarantee every generation succeeds; failed cases can be retried.

---

## Roadmap

Planned in priority order, following the specification:

1. **P1:** optional hints, user accounts, deeper difficulty tuning, generated image and audio evidence with secure asset storage.
2. **P2:** mystery history and completion statistics, sharing, and multiplayer features.

---

## Specification

The full product and technical requirements live in [`SPEC.md`](./SPEC.md). If an implementation decision changes the scope or behavior described there, update the spec and this README together.