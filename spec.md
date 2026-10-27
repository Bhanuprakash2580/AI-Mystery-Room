# AI Mystery Room — Product & Technical Specification

**Document:** `SPEC.md`  
**Project:** AI Mystery Room  
**Specification Version:** 1.0  
**Status:** Ready for implementation  
**Purpose:** Single source of truth for Codex and all future development  
**Primary Stack:** MongoDB, Express.js, React.js, Node.js  
**AI Provider:** Google Gemini  
**Target Platform:** Responsive web application

---

# 1. Project Overview

## 1.1 Product Vision

AI Mystery Room is an AI-powered interactive detective game where users become investigators and solve fictional mysteries generated from their own story ideas.

The user provides a short scenario, setting, or story premise. The AI transforms it into a complete investigation containing fictional suspects, a culprit, motives, timelines, alibis, clues, contradictions, and supporting evidence.

Players examine evidence such as WhatsApp-style conversations, photographs, documents, witness statements, and audio recordings. They connect clues, question inconsistencies, and identify the culprit.

The experience should feel like investigating a real case file while making it clear that all characters, events, conversations, and evidence are fictional and AI-generated.

## 1.2 Core Product Loop

1. The user enters a mystery premise.
2. The backend generates a complete investigation.
3. The system creates suspects, a timeline, a culprit, and a consistent solution.
4. The system generates evidence supporting the investigation.
5. The user explores the case room and examines evidence.
6. The user forms a theory and selects a culprit.
7. The system evaluates the answer and reveals the solution.
8. The user reviews the explanation, decisive clues, and missed contradictions.

## 1.3 Product Goals

- Turn user-provided story ideas into playable detective mysteries.
- Generate interconnected, internally consistent fictional investigations.
- Make evidence exploration engaging and intuitive.
- Require reasoning rather than random guessing.
- Provide a satisfying, evidence-based solution reveal.
- Support multiple mysteries and investigation sessions.
- Deliver a polished, responsive, accessible user interface.
- Keep the AI provider and media-generation services replaceable.

## 1.4 Non-Goals for Version 1

The initial release will not include:

- Real police investigations or real criminal case processing.
- Real-world surveillance, identity verification, or evidence collection.
- Live messaging between players.
- Multiplayer or collaborative investigations.
- A public marketplace for mysteries.
- User-generated executable content.
- A custom-trained AI model.
- Paid subscriptions, in-game purchases, or advertising.
- Real WhatsApp account integration or real message sending.
- Guaranteed generation of fully realistic audio or images when the configured provider does not support those capabilities.

These features may be considered in later versions but must not delay the core experience.

# 2. Target Users and Use Cases

## 2.1 Target Users

- Casual gamers who enjoy detective and puzzle games.
- Mystery and crime-fiction enthusiasts.
- Users who want to turn their own story ideas into interactive challenges.
- Content creators who want fictional investigation scenarios.
- Students or groups using fictional mysteries for reasoning exercises.

## 2.2 Primary User Story

As a player, I want to enter a short mystery scenario, inspect AI-generated evidence, identify contradictions, and accuse a suspect so that I can experience an interactive detective investigation.

## 2.3 Secondary User Stories

- As a player, I want to inspect evidence individually so that I can understand its details.
- As a player, I want to see suspects, motives, relationships, and alibis in one place.
- As a player, I want to mark important clues so that I can revisit them.
- As a player, I want to submit my accusation and receive a clear explanation of the correct answer.
- As a player, I want to save my progress and return to an unfinished case.
- As a player, I want to restart a mystery when I want another attempt.
- As a player, I want the game to tell me when a generated case is unavailable or failed, rather than showing incomplete evidence.

# 3. Functional Scope and Priorities

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | Create a mystery from a user-provided premise | P0 |
| FR-002 | Generate suspects, culprit, motive, timeline, and solution | P0 |
| FR-003 | Generate and validate interconnected evidence | P0 |
| FR-004 | Display an interactive investigation room | P0 |
| FR-005 | Display suspect profiles and alibis | P0 |
| FR-006 | Allow players to inspect and bookmark evidence | P0 |
| FR-007 | Allow players to submit a culprit accusation | P0 |
| FR-008 | Reveal the correct solution and reasoning | P0 |
| FR-009 | Persist cases and player progress | P0 |
| FR-010 | Support responsive desktop and mobile layouts | P0 |
| FR-011 | Show generation progress and handle failures | P0 |
| FR-012 | Provide optional hints | P1 |
| FR-013 | Support configurable mystery difficulty | P1 |
| FR-014 | Support optional generated image and audio evidence | P1 |
| FR-015 | Allow case deletion and replay | P1 |
| FR-016 | Provide user authentication | P1 |
| FR-017 | Add mystery history and completion statistics | P2 |
| FR-018 | Add sharing and multiplayer features | P2 |

**Priority definitions:** P0 = required for the initial playable release; P1 = valuable enhancement; P2 = future extension.

The application must remain usable if optional image or audio generation is unavailable.

# 4. Technology Stack

## 4.1 Frontend

- React.js
- Vite
- JavaScript or TypeScript, with TypeScript preferred for a new project
- React Router
- Tailwind CSS
- A reusable component system such as shadcn/ui, if compatible with the project
- Lucide React icons
- Fetch API or Axios for HTTP requests

The frontend must communicate with the backend through documented API endpoints. It must not call Gemini directly.

## 4.2 Backend

- Node.js
- Express.js
- TypeScript, preferred for shared type safety
- Google Gemini API through the official supported SDK
- Mongoose for MongoDB data models
- Zod or an equivalent validation library
- Multer or equivalent only when file uploads are needed
- Structured logging and centralized error handling

## 4.3 Database

- MongoDB Atlas or another compatible MongoDB deployment
- Collections for users, cases, and any necessary supporting records
- Indexed identifiers and ownership fields
- Versioned case data and explicit case status transitions

## 4.4 AI and Media

- Google Gemini for mystery planning, narrative generation, evidence drafting, and structured output.
- An optional image-generation provider for fictional photographs and visual evidence.
- An optional audio-generation provider for fictional recordings.
- A storage provider for generated media, if media is persisted.

**Important provider constraint:** Do not assume that every Gemini model supports image generation, audio generation, transcription, or every other modality. Select models according to their documented capabilities at implementation time. Isolate all provider-specific calls behind interfaces so alternative providers can be configured without redesigning the application.

## 4.5 Development and Deployment

- Git and GitHub
- `.env` for local secrets
- `.env.example` for required variable names
- Separate development and production configurations
- Frontend and backend deployment with environment-specific URLs
- HTTPS in production

# 5. Application Architecture

## 5.1 High-Level Architecture

```text
React Frontend
     |
     | HTTPS / REST API
     v
Express.js Backend
     |
     +---- Authentication and Authorization
     |
     +---- Mystery Generation Service
     |          |
     |          +---- Gemini Provider
     |          +---- Prompt Templates
     |          +---- Structured Output Validation
     |
     +---- Evidence Generation Service
     |          |
     |          +---- Text Evidence
     |          +---- Image Provider (optional)
     |          +---- Audio Provider (optional)
     |
     +---- Case Validation and Game Rules
     |
     +---- MongoDB / Mongoose
     |
     +---- Optional Media Storage
```

## 5.2 Architectural Rules

1. All AI requests must originate from the backend.
2. Gemini API keys must never be exposed to the browser.
3. Business rules must not depend on frontend-only validation.
4. The frontend must never receive hidden solution data before the accusation is submitted.
5. The original case solution must be persisted before the case becomes playable.
6. Evidence generation must use the same canonical case facts as the solution.
7. All provider integrations must be replaceable.
8. Every case must have a unique identifier and explicit lifecycle state.
9. The system must validate model output before saving it.
10. Partial or invalid generations must never be published as playable cases.

# 6. User Interface and Pages

## 6.1 Landing Page — `/`

**Purpose:** Explain the product and encourage the user to create a mystery.

Required elements:

- Product logo and navigation.
- Hero headline: “Every Mystery Has a Secret.”
- Supporting text describing AI-generated detective investigations.
- Primary CTA: “Create a Mystery.”
- Secondary CTA: “How It Works.”
- Three-step explanation:
  1. Create your story.
  2. Investigate the evidence.
  3. Unmask the culprit.
- Sample case preview cards.
- Feature section explaining suspects, clues, and evidence.
- Fictional-content disclaimer.
- Footer with privacy, terms, and contact links.

The primary CTA must navigate to the mystery creation page.

## 6.2 Mystery Creation — `/create`

**Purpose:** Collect the premise and preferences needed to create a case.

Fields:

- Mystery premise: required textarea.
- Case title: optional; may be generated automatically.
- Setting: optional.
- Mystery type: selectable category.
- Difficulty: Easy, Medium, Hard.
- Evidence preferences: messages, images, documents, audio.
- Number of suspects: configurable within supported limits.

Suggested mystery types:

- Theft
- Murder mystery
- Missing object
- Corporate espionage
- Blackmail
- Secret identity
- Historical mystery
- Custom

The application must treat every scenario as fiction and reject or safely transform requests that would create harmful real-world investigative instructions.

**Validation:**

- Premise length: 30–2,000 characters.
- Suspects: 3–6.
- At least two evidence categories must be selected, including text evidence.
- The form must prevent duplicate submissions while a generation request is being created.
- Invalid fields must display clear inline errors.

Provide an example-premise button and a reset option.

## 6.3 Generation Progress — `/cases/:caseId/generating`

**Purpose:** Show generation status while the backend constructs and validates the mystery.

Display stages such as:

- Interpreting your scenario.
- Creating suspects and motives.
- Establishing the timeline.
- Generating evidence.
- Checking clues and contradictions.
- Preparing your case room.

Implementation requirements:

- Show actual backend progress states where available.
- Do not fabricate a percentage that implies precise completion.
- Poll the case status endpoint or use Server-Sent Events if implemented.
- Handle refreshes without starting duplicate generation jobs.
- Provide a retry action for recoverable failures.
- Provide a way back to the dashboard.

## 6.4 Case Dashboard — `/dashboard`

**Purpose:** List the user's mysteries.

Each case card should show:

- Case title.
- Short premise.
- Difficulty.
- Creation date.
- Number of suspects.
- Investigation status.
- Progress or completion indicator.
- Continue Investigation button.
- Delete action with confirmation.

Include loading, empty, and error states.

For the initial unauthenticated MVP, cases may be associated with an anonymous session. Do not expose cases belonging to another session. Persistent anonymous sessions must use an appropriately protected session identifier.

## 6.5 Investigation Room — `/cases/:caseId`

**Purpose:** Main gameplay interface.

Recommended desktop layout:

- Left panel: case navigation, overview, and suspects.
- Center panel: selected evidence or investigation workspace.
- Right panel: evidence details and investigator notes.

On mobile, use responsive tabs or drawers instead of compressing all three panels into a narrow layout.

Required navigation sections:

1. Case Overview
2. Suspects
3. Evidence Locker
4. Timeline
5. My Notes
6. Make an Accusation

### Case Overview

Display:

- Case title and summary.
- Fictional incident details.
- Location and incident time.
- Investigator instructions.
- Current investigation status.
- Total evidence items and suspects.
- Primary investigation objective.

Do not show the culprit, solution explanation, hidden motives, or solution-only facts before accusation.

### Suspects Panel

Each suspect card must show:

- Name.
- Fictional portrait, when available.
- Role in the story.
- Relationship to the incident or victim.
- Publicly known motive or relevant background.
- Stated alibi.
- Evidence associated with that suspect.

Do not reveal secret culprit labels or a suspect's hidden guilt state.

### Evidence Locker

Display evidence as individual, selectable cards with:

- Evidence title.
- Evidence type.
- Short preview.
- In-world timestamp, if applicable.
- Related suspect or location.
- Viewed/unviewed status.
- Bookmarked status.

Filtering options:

- All evidence
- Messages
- Images
- Audio
- Documents
- Statements
- Timeline clues

Provide search by title and relevant text.

### Evidence Detail View

Selecting an evidence item opens a detail panel or modal.

Required content:

- Evidence title and full contents.
- Source or fictional origin.
- In-world timestamp.
- Relevant metadata.
- Related suspects or locations.
- Bookmark toggle.
- Mark as important toggle.
- Previous/next evidence navigation.

For WhatsApp-style evidence, display a clearly fictional chat interface with sender names, timestamps, and message order. Never connect it to real WhatsApp.

For image evidence, show the image and its fictional provenance.

For audio evidence, provide a playback control only when a real audio asset exists. If audio generation is unavailable, display a text transcript labelled as a transcript, not as playable audio.

## 6.6 Accusation Page or Modal

**Purpose:** Allow the player to submit a final theory.

Required fields:

- Suspect selection.
- Optional explanation of the theory.
- Optional selection of decisive evidence.
- Confirmation before submission.

Rules:

- Only existing suspects can be selected.
- A final accusation must be evaluated by backend game logic.
- The frontend must not decide correctness.
- A submitted accusation should be recorded.
- The solution should be revealed only after a successful submission.
- Repeated requests must not corrupt or duplicate the case state.

## 6.7 Results Page — `/cases/:caseId/results`

Display:

- Correct culprit.
- Player's selected suspect.
- Correct/incorrect result.
- Explanation of the culprit's motive.
- Reconstructed timeline.
- Decisive evidence.
- Explanation of misleading clues.
- Contradictions that exposed the culprit.
- Player's submitted theory, if provided.
- Replay or return-to-dashboard actions.

The explanation must cite actual evidence IDs and facts from the generated case. Do not invent new evidence during the reveal.

# 7. Core Mystery Generation Engine

This is the most important backend subsystem.

## 7.1 Required Generation Strategy

Do not ask the model to independently invent suspects, evidence, motives, and a culprit in unrelated calls.

Instead, create one canonical case plan and derive all other content from it.

Recommended pipeline:

1. Validate and normalize the user's premise.
2. Generate a structured mystery blueprint.
3. Validate the blueprint and its solution.
4. Generate evidence items against the blueprint.
5. Validate evidence against the canonical facts.
6. Run consistency and solvability checks.
7. Generate optional media from approved evidence descriptions.
8. Persist the complete case.
9. Mark the case playable only after validation succeeds.

The canonical blueprint is the source of truth for all generated content within a case.

## 7.2 Canonical Case Blueprint

The internal blueprint must include:

- Case ID.
- Case title.
- Original premise.
- Normalized premise.
- Setting and incident.
- Fictional characters.
- Suspect list.
- Culprit ID.
- Culprit's motive.
- Actual event sequence.
- Complete incident timeline.
- Suspect knowledge and actions.
- Truthful underlying facts.
- Suspect statements and alibis.
- Planned evidence items.
- Expected deductions.
- Misleading but fair clues.
- Final explanation.
- Difficulty configuration.

The blueprint is server-side data. Hidden solution fields must not be included in ordinary case API responses.

## 7.3 Suspect Requirements

Every case must contain 3–6 suspects.

Every suspect must have:

- A unique ID.
- A distinct name.
- A fictional role.
- A relationship to the incident.
- A plausible reason to be investigated.
- An alibi or account of relevant events.
- A consistent timeline.
- At least one evidence relationship.

The culprit must have a coherent motive and a plausible opportunity. Innocent suspects should have believable reasons for appearing suspicious without requiring impossible coincidences.

Names and IDs must be unique within the case.

## 7.4 Evidence Requirements

A playable mystery must contain enough evidence to support a reasoned accusation.

Recommended initial target:

- 8–15 evidence items per case.
- At least 3 evidence items that materially support the solution.
- At least 2 clues that independently challenge the culprit's account.
- At least 2 plausible red herrings.
- At least 3 evidence categories when media generation is available.
- A clear, reconstructable timeline.

These are initial product targets, not universal guarantees. If a generated case cannot meet the requirements, regenerate it or mark generation as failed.

Each evidence item must have:

- A unique evidence ID.
- A title.
- An evidence type.
- A body or asset reference.
- A fictional source.
- An in-world timestamp, when relevant.
- Related suspect IDs.
- Related location IDs, if applicable.
- The facts it supports.
- The facts it contradicts.
- Its narrative purpose.
- Whether it is a misleading clue.
- A player-facing description.
- A hidden validation annotation.

Hidden annotations must never be returned to the player before the reveal.

## 7.5 Evidence Types

### A. Chat Messages

Fictional messaging evidence should contain:

- Conversation ID.
- Participant names.
- Message list.
- Sender ID.
- Message text.
- In-world timestamp.
- Optional attachment reference.

Requirements:

- Messages must follow chronological order.
- Participants must exist in the case.
- Message times must be consistent with the canonical timeline.
- Messages must not accidentally reveal the solution through labels or debug metadata.
- All chats must be clearly identified as fictional.

### B. Images

Examples:

- Fictional CCTV stills.
- Photographs of a scene.
- Objects found at a location.
- A fictional receipt or note.
- A photograph containing a relevant visual clue.

Requirements:

- An image description must be approved before generation.
- The visual must be consistent with the characters, location, and timeline.
- The image must not introduce facts that contradict the blueprint.
- Store generated assets separately from the narrative JSON.
- Provide a fallback illustration or text-based evidence when image generation fails.

### C. Audio Recordings

Examples:

- Fictional voicemail.
- Recorded conversation.
- Witness statement.
- Ambient recording containing a relevant clue.

Requirements:

- Store a transcript separately from the audio asset.
- The transcript must match the intended content of the recording.
- Audio metadata must include duration and language when known.
- Do not display a playback control when no valid audio asset exists.
- Use text-based evidence as a fallback.

### D. Documents

Examples:

- Fictional invoices.
- Letters.
- Reports.
- Schedules.
- Access logs.
- Receipts.

Document facts must match the timeline and the underlying solution.

### E. Witness Statements

Each statement must include:

- Fictional witness ID.
- Statement text.
- Time recorded.
- Events claimed to have been observed.
- Any conflicts with other evidence.

A witness statement should be suspicious only when there is a reason for that suspicion.

## 7.6 Solvability and Fairness

A mystery is considered playable only if the system can demonstrate a consistent solution.

Validation requirements:

1. The culprit must be one of the declared suspects.
2. The actual event sequence must be logically possible.
3. All evidence timestamps must fit the timeline.
4. Every referenced character and location must exist.
5. The intended solution must be supported by player-visible evidence.
6. The culprit must be distinguishable from innocent suspects through meaningful deductions.
7. At least two independent clues should help identify the culprit.
8. Red herrings must not make the intended solution impossible or equally unsupported.
9. The final explanation must reference existing evidence.
10. The case must not rely on undisclosed facts that are necessary to identify the culprit.

For complex cases, implement a rule-based consistency checker rather than relying only on an AI model's self-assessment.

If validation fails, retry generation a limited number of times. If the case still fails, mark it as failed and provide a retry action.

## 7.7 Difficulty Levels

**Easy**

- 3 suspects by default.
- More direct clues.
- Shorter timeline.
- Fewer misleading clues.
- Optional progressive hints.

**Medium**

- 4–5 suspects.
- Multiple evidence sources.
- Contradictory alibis.
- Moderate red herrings.
- Requires connecting several clues.

**Hard**

- 5–6 suspects.
- More complex relationships.
- Interdependent clues.
- Multiple plausible initial theories.
- Requires cross-referencing timelines and evidence.

Difficulty must change actual case complexity, not merely its label.

# 8. Gemini Integration Specification

## 8.1 Backend Provider Interface

Create an abstraction similar to:

```ts
interface MysteryAIProvider {
  generateBlueprint(input: MysteryInput): Promise<MysteryBlueprint>;
  generateEvidence(
    blueprint: MysteryBlueprint
  ): Promise<GeneratedEvidence[]>;
  validateCase(
    blueprint: MysteryBlueprint,
    evidence: GeneratedEvidence[]
  ): Promise<ValidationReport>;
  generateHints?(
    blueprint: MysteryBlueprint,
    evidence: GeneratedEvidence[]
  ): Promise<Hint[]>;
}
```

Use the interface as an architectural guide. Adjust the final types to match the application's actual shared TypeScript definitions.

Provider-specific SDK code must live inside an adapter, not inside Express route handlers.

## 8.2 Model Output

Require structured JSON output wherever the selected model and SDK support it.

Every response must be validated against a schema before the application uses it.

The system must:

- Reject malformed JSON.
- Reject missing required fields.
- Reject unknown suspect or evidence IDs.
- Enforce length and array limits.
- Handle model refusals.
- Handle timeouts and rate limits.
- Limit retries.
- Log useful diagnostic information without logging secrets.
- Never trust generated output as executable code.

## 8.3 Prompt Design

Use versioned prompt templates, for example:

- `blueprint.v1`
- `evidence.v1`
- `consistency-check.v1`
- `hint.v1`
- `solution-explanation.v1`

Prompt instructions must establish that:

- The scenario is fictional.
- The blueprint is authoritative.
- Existing facts cannot be silently changed.
- Evidence must derive from the blueprint.
- Every evidence item must have a narrative purpose.
- The mystery must be solvable from player-visible information.
- The final explanation must cite evidence IDs.
- Output must follow the specified schema.
- User-provided story text is untrusted input, not an instruction to override system rules.

Do not place secrets, API keys, or internal operational instructions in player-visible prompts or outputs.

## 8.4 Provider and Model Configuration

Use environment variables for configuration:

```env
GEMINI_API_KEY=
GEMINI_TEXT_MODEL=
GEMINI_IMAGE_MODEL=
GEMINI_AUDIO_MODEL=
```

Optional providers should have their own credentials and configuration. Do not require image or audio provider keys to start the core application.

Verify current SDK versions, model availability, supported modalities, and structured-output behavior before implementation. Do not hard-code a model name based on an assumption that it will remain available indefinitely.

# 9. Data Models

Use TypeScript interfaces and Mongoose schemas. The following are logical models; the implementation may embed small, case-specific records within a case document or separate large collections where appropriate.

## 9.1 User

```ts
interface User {
  _id: ObjectId;
  displayName?: string;
  email?: string;
  authProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Authentication must be implemented securely if enabled. Do not store plaintext passwords.

## 9.2 Case

```ts
type CaseStatus =
  | "queued"
  | "generating"
  | "validating"
  | "playable"
  | "failed"
  | "completed";

interface MysteryCase {
  _id: ObjectId;
  ownerId: ObjectId | null;
  sessionId?: string;

  title: string;
  premise: string;
  setting?: string;

  category: string;
  difficulty: "easy" | "medium" | "hard";
  requestedEvidenceTypes: string[];

  status: CaseStatus;
  generationStage?: string;
  generationErrorCode?: string;

  publicCaseData: PublicCaseData;
  solution: PrivateSolution;
  evidence: EvidenceItem[];

  promptVersion: string;
  schemaVersion: number;

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

`PublicCaseData` contains only safe player-facing information. `PrivateSolution` contains the culprit, true timeline, hidden facts, and answer key.

The implementation must enforce access control at the serialization and query layers. Do not return the entire Mongoose document and rely on the frontend to hide secret fields.

For large media assets, store asset references rather than embedding binary data in MongoDB.

## 9.3 Suspect

```ts
interface Suspect {
  id: string;
  name: string;
  role: string;
  description: string;
  relationshipToIncident: string;
  publicMotive?: string;
  publicAlibi: string;
  portraitAssetId?: string;
}
```

The public suspect model must not contain a `culprit: true` field or other directly revealing labels.

## 9.4 Evidence

```ts
type EvidenceType =
  | "chat"
  | "image"
  | "audio"
  | "document"
  | "statement"
  | "timeline";

interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  description: string;

  sourceLabel: string;
  occurredAt?: Date;

  relatedSuspectIds: string[];
  assetId?: string;

  content: Record<string, unknown>;

  validation?: {
    supportedFactIds: string[];
    contradictedFactIds: string[];
    narrativePurpose: string;
    isRedHerring: boolean;
  };
}
```

The `validation` object is private metadata. Split it into a private subdocument or strip it from every player-facing response.

The `content` object must be validated against a type-specific schema. Avoid unrestricted, unvalidated objects at API boundaries.

## 9.5 Player Progress

```ts
interface CaseProgress {
  _id: ObjectId;
  caseId: ObjectId;
  playerId?: ObjectId;
  sessionId?: string;

  viewedEvidenceIds: string[];
  bookmarkedEvidenceIds: string[];
  notes: string;

  selectedSuspectId?: string;
  submittedTheory?: string;

  status: "investigating" | "accused" | "completed";
  attempts: number;

  createdAt: Date;
  updatedAt: Date;
}
```

Add an appropriate unique index so one player's progress is not duplicated for the same case.

## 9.6 Accusation

```ts
interface Accusation {
  _id: ObjectId;
  caseId: ObjectId;
  progressId: ObjectId;

  selectedSuspectId: string;
  theory?: string;
  citedEvidenceIds: string[];

  isCorrect: boolean;
  submittedAt: Date;
}
```

Do not persist a player-provided correctness value. The backend must calculate `isCorrect` using the stored canonical solution.

## 9.7 Media Asset

```ts
interface MediaAsset {
  _id: ObjectId;
  caseId: ObjectId;

  kind: "image" | "audio";
  storageKey: string;

  mimeType: string;
  sizeBytes: number;

  generationProvider: string;
  generationModel?: string;

  status: "pending" | "ready" | "failed";
  createdAt: Date;
}
```

Validate file types and sizes. Serve private assets only to authorized case participants. Use signed URLs or authenticated asset endpoints when supported by the storage provider.

# 10. REST API Specification

Base path: `/api/v1`

All endpoints must validate input, enforce authorization, and return consistent JSON responses.

## 10.1 Standard Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "requestId": "request-id"
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check your input."
  },
  "requestId": "request-id"
}
```

Do not expose stack traces, provider credentials, internal prompts, or private solution fields.

## 10.2 Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Basic health check |
| POST | `/cases` | Validate input and create a generation job |
| GET | `/cases` | List the caller's cases |
| GET | `/cases/:id` | Get safe case overview |
| GET | `/cases/:id/status` | Get generation status |
| POST | `/cases/:id/retry` | Retry a failed generation |
| DELETE | `/cases/:id` | Delete an owned case |
| GET | `/cases/:id/suspects` | Get public suspect profiles |
| GET | `/cases/:id/evidence` | List safe evidence metadata |
| GET | `/cases/:id/evidence/:evidenceId` | Get one evidence item |
| GET | `/cases/:id/progress` | Retrieve player progress |
| PATCH | `/cases/:id/progress` | Update bookmarks, notes, and viewed items |
| POST | `/cases/:id/hints` | Request an optional hint |
| POST | `/cases/:id/accusations` | Submit an accusation |
| GET | `/cases/:id/results` | Get results after a valid reveal |
| POST | `/cases/:id/replay` | Reset progress or create a replay session |

Authentication routes may be added under `/api/v1/auth` if account support is enabled.

### Case Creation Request

```json
{
  "premise": "A rare painting disappears from a locked gallery during a private event.",
  "setting": "A historic art gallery",
  "category": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "evidenceTypes": [
    "chat",
    "image",
    "document",
    "statement"
  ]
}
```

The server must validate all fields and apply defaults when optional fields are omitted.

### Case Creation Response

```json
{
  "success": true,
  "data": {
    "caseId": "generated-case-id",
    "status": "queued",
    "statusUrl": "/api/v1/cases/generated-case-id/status"
  }
}
```

Use the real generated ID at runtime.

### Accusation Request

```json
{
  "selectedSuspectId": "suspect-03",
  "theory": "The access log contradicts the suspect's alibi.",
  "citedEvidenceIds": [
    "evidence-02",
    "evidence-07"
  ]
}
```

### Accusation Response

```json
{
  "success": true,
  "data": {
    "accusationId": "generated-accusation-id",
    "isCorrect": false,
    "resultUrl": "/cases/generated-case-id/results"
  }
}
```

The response must not reveal the culprit or hidden solution before the accusation has been accepted.

The results endpoint must enforce the reveal state on the server. An invalid or unauthorized request must not bypass this rule.

## 10.3 HTTP Status Codes

- `200`: Successful read or update.
- `201`: Resource successfully created.
- `202`: Generation job accepted.
- `400`: Invalid request.
- `401`: Authentication required.
- `403`: Access denied.
- `404`: Resource not found.
- `409`: Invalid lifecycle transition or conflicting operation.
- `422`: Semantically invalid input.
- `429`: Rate limit exceeded.
- `502`: Upstream AI provider failure.
- `503`: Service temporarily unavailable.
- `500`: Unexpected internal error.

Return `404` or another deliberate safe response for resources the caller is not allowed to discover, according to the security policy.

# 11. Case Lifecycle and Background Processing

Mystery generation can take longer than a normal API request. Do not depend on one long-running HTTP request for the entire generation process.

Recommended lifecycle:

```text
queued
  |
  v
generating
  |
  v
validating
  |
  +---- valid ----> playable
  |
  +---- invalid --> retry
                       |
                       +---- valid --> playable
                       |
                       +---- exhausted --> failed
```

Completed cases may transition to `completed` when the player finishes the investigation.

Requirements:

- Return the case ID immediately after a valid creation request.
- Run generation through a background job or another reliable asynchronous mechanism.
- Persist job status in MongoDB.
- Make retries idempotent where practical.
- Limit concurrent AI jobs per user or session.
- Apply timeouts to every external request.
- Avoid unbounded retry loops.
- Recover or mark interrupted jobs after server restarts.
- Keep failed generation details private.
- Do not expose incomplete cases as playable.

For a small MVP, a MongoDB-backed job mechanism may be sufficient. If using an in-memory queue initially, explicitly document its limitations and do not claim durable processing across restarts.

# 12. Security and Privacy Requirements

## 12.1 API and Secrets

- Store API keys in environment variables or a secrets manager.
- Never include secrets in frontend bundles.
- Never commit `.env` files.
- Provide `.env.example` with placeholder values only.
- Apply request size limits.
- Apply rate limits to case creation and AI-powered endpoints.
- Validate and sanitize all incoming data.
- Use centralized error handling.

## 12.2 Authorization

Every case and progress operation must verify ownership or valid session access.

The backend must not trust:

- A case ID supplied by the client.
- A suspect ID without checking membership in the case.
- An evidence ID without checking membership in the case.
- A client-supplied correctness flag.
- A client-supplied reveal status.
- A user-provided owner ID.

If anonymous play is supported, bind each case to a secure session. Do not use a predictable session identifier or accept another player's session token from ordinary request data.

## 12.3 AI Safety

- Treat user premises and generated content as untrusted.
- Protect against prompt injection in user-provided stories and evidence.
- Keep model-generated HTML and scripts out of the page.
- Render generated text as escaped text by default.
- Do not execute generated code.
- Avoid using real people's private data in fictional cases.
- Do not create evidence intended to impersonate real people or deceive real-world recipients.
- Clearly label the experience and evidence as fictional.
- Do not imply that generated content is authentic forensic evidence.
- Avoid detailed operational instructions for real-world wrongdoing.
- Moderate user input and generated output as appropriate.

## 12.4 Solution Confidentiality

Before the reveal, the following must remain private:

- Culprit ID.
- Hidden timeline.
- Secret motives.
- Private validation annotations.
- Correct-answer flags.
- Solution explanation.
- Any fields that directly identify the culprit.

Use explicit response DTOs and tests that confirm hidden fields never appear in public API responses.

# 13. UI/UX and Visual Design

## 13.1 Design Direction

The interface should feel like a premium digital detective workstation rather than a generic AI dashboard.

Visual direction:

- Dark, cinematic theme.
- Charcoal and deep navy surfaces.
- Muted amber highlights.
- Subtle red accents for warnings.
- High-contrast readable text.
- Fine borders and restrained shadows.
- Evidence cards resembling organized case files.
- Consistent iconography.
- Minimal, purposeful animation.

Avoid excessive neon effects, constant animations, or decorative elements that interfere with reading evidence.

## 13.2 Typography and Layout

- Use a highly readable sans-serif font for the interface.
- Use a monospaced font selectively for timestamps, IDs, and logs.
- Maintain a consistent spacing scale.
- Ensure long evidence text wraps properly.
- Avoid horizontal scrolling at common mobile widths.
- Use consistent button styles and focus states.

## 13.3 Accessibility

- Keyboard navigation for all major actions.
- Visible focus indicators.
- Accessible names for icon-only buttons.
- Sufficient color contrast.
- Captions or transcripts for generated audio.
- Useful alt text for relevant images.
- No reliance on color alone to communicate correctness or status.
- Respect reduced-motion preferences.

## 13.4 UI States

Every data-driven page must include appropriate:

- Loading state.
- Empty state.
- Error state.
- Retry state.
- Success feedback.
- Disabled state.
- Confirmation for destructive actions.

Never display fake evidence, placeholder suspects, or hardcoded success messages as though they were generated case data.

# 14. Frontend Component Structure

Recommended component hierarchy:

```text
src/
  app/
    App.tsx
    router.tsx

  components/
    layout/
      AppShell.tsx
      Navbar.tsx
      Footer.tsx

    ui/
      Button.tsx
      Input.tsx
      Modal.tsx
      Skeleton.tsx
      EmptyState.tsx
      ErrorState.tsx

    cases/
      CaseCard.tsx
      CaseStatusBadge.tsx
      GenerationProgress.tsx

    investigation/
      CaseOverview.tsx
      SuspectCard.tsx
      SuspectPanel.tsx
      EvidenceCard.tsx
      EvidenceLocker.tsx
      EvidenceDetail.tsx
      ChatEvidence.tsx
      ImageEvidence.tsx
      AudioEvidence.tsx
      DocumentEvidence.tsx
      TimelineView.tsx
      InvestigatorNotes.tsx
      AccusationForm.tsx
      SolutionReveal.tsx

  pages/
    LandingPage.tsx
    CreateMysteryPage.tsx
    DashboardPage.tsx
    GeneratingPage.tsx
    InvestigationPage.tsx
    ResultsPage.tsx
    NotFoundPage.tsx

  services/
    apiClient.ts
    caseService.ts
    progressService.ts

  hooks/
    useCase.ts
    useCaseStatus.ts
    useEvidence.ts

  types/
    case.ts
    suspect.ts
    evidence.ts
    api.ts

  utils/
    formatDate.ts
    validation.ts
```

Codex may adjust the structure if the repository already has an established architecture. Avoid duplicate components and unnecessary abstractions.

# 15. Backend Project Structure

Recommended layout:

```text
server/
  src/
    app.ts
    server.ts

    config/
      env.ts
      database.ts
      ai.ts

    routes/
      health.routes.ts
      cases.routes.ts
      evidence.routes.ts
      progress.routes.ts
      accusations.routes.ts

    controllers/
      case.controller.ts
      evidence.controller.ts
      progress.controller.ts
      accusation.controller.ts

    services/
      case.service.ts
      mystery-generation.service.ts
      evidence-generation.service.ts
      case-validation.service.ts
      progress.service.ts
      accusation.service.ts

    ai/
      providers/
        gemini.provider.ts
      prompts/
        blueprint.v1.ts
        evidence.v1.ts
        consistency-check.v1.ts
        hint.v1.ts
      schemas/
        blueprint.schema.ts
        evidence.schema.ts

    models/
      Case.model.ts
      User.model.ts
      CaseProgress.model.ts
      Accusation.model.ts
      MediaAsset.model.ts

    middleware/
      error-handler.ts
      auth.ts
      rate-limit.ts
      request-id.ts

    validators/
      case.validator.ts
      accusation.validator.ts

    jobs/
      generation.worker.ts

    utils/
      logger.ts
      errors.ts

    tests/
```

This is the recommended organization, not a requirement to create empty files for every item. Only implement modules that have a clear purpose.

# 16. Environment Configuration

Create separate frontend and backend environment files.

Backend `.env.example`:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room

GEMINI_API_KEY=
GEMINI_TEXT_MODEL=

CLIENT_ORIGIN=http://localhost:5173

SESSION_SECRET=
```

Frontend `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Add optional provider variables only when those providers are implemented.

Requirements:

- Validate required environment variables on startup.
- Fail fast with a clear configuration error.
- Never print secret values in logs.
- Ensure `VITE_` variables contain no private credentials.
- Configure CORS for explicit trusted origins.
- Use secure cookies and appropriate session settings in production.

# 17. Error Handling and Observability

Use consistent error codes, request IDs, and structured logs.

Expected errors include:

- Invalid premise.
- Unsupported evidence type.
- AI timeout.
- AI rate limit.
- Malformed model output.
- Case validation failure.
- MongoDB connection failure.
- Unauthorized case access.
- Missing evidence.
- Duplicate accusation.
- Missing media asset.
- Failed media generation.

The frontend should display a helpful, nontechnical message and a recovery action when possible.

The backend should record useful diagnostic context, including request ID, case ID, generation stage, and provider error category. Do not log API keys, session tokens, or unnecessary private user content.

# 18. Testing Strategy

## 18.1 Unit Tests

Test:

- Input validation.
- Suspect ID uniqueness.
- Evidence schema validation.
- Timeline consistency rules.
- Culprit membership in the suspect list.
- Solution-to-evidence references.
- Accusation correctness calculation.
- Lifecycle transition rules.
- DTO filtering of hidden solution fields.

## 18.2 Integration Tests

Test:

- Case creation.
- Generation status updates.
- Saving and retrieving playable cases.
- Ownership enforcement.
- Evidence retrieval.
- Bookmark and note persistence.
- Accusation submission.
- Solution reveal authorization.
- Failure and retry handling.
- Database behavior when the AI provider fails.

Mock Gemini for deterministic automated tests. Live provider calls should be reserved for explicit integration testing rather than every CI run.

## 18.3 Frontend Tests

Test:

- Form validation.
- Loading and failure states.
- Suspect selection.
- Evidence filtering.
- Bookmark toggling.
- Mobile navigation.
- Accusation confirmation.
- Results rendering.
- Accessibility of key controls.

## 18.4 End-to-End Test

A full end-to-end test must verify the following:

1. Open the application.
2. Create a mystery using a sample premise.
3. Wait for the generation job to complete.
4. Open the case room.
5. Inspect suspects and evidence.
6. Bookmark a clue.
7. Submit an accusation.
8. Confirm the result and solution explanation.
9. Reload the page and verify persisted state.

Use a deterministic test fixture or mocked AI provider for reliable CI execution.

# 19. Acceptance Criteria

The project is ready for its initial release only when all P0 requirements are satisfied.

### AC-01: Mystery Creation

- The user can enter a valid premise.
- The server validates the request.
- A case ID is returned.
- Generation proceeds asynchronously.
- Duplicate submissions are controlled.

### AC-02: Consistent Mystery

- Every playable case contains 3–6 suspects.
- Exactly one canonical culprit is selected for the initial game rules.
- The culprit exists in the suspect list.
- The evidence and timeline pass validation.
- The intended solution can be derived from player-visible evidence.
- Invalid cases cannot enter the playable state.

### AC-03: Evidence Room

- All required evidence is visible in the evidence locker.
- Each item opens a detail view.
- Evidence can be filtered by type.
- Evidence can be bookmarked.
- Missing media does not break the page.

### AC-04: Investigation Progress

- Player notes and bookmarks persist.
- Viewed evidence can be tracked.
- The player can resume an unfinished case.
- One player's progress cannot overwrite another player's progress.

### AC-05: Accusation and Reveal

- The player can select a valid suspect.
- Correctness is determined by the backend.
- The result references existing evidence.
- The hidden solution cannot be retrieved before reveal.
- Repeated requests cannot bypass reveal rules.

### AC-06: Reliability

- AI errors produce a clear failure state.
- Retry limits are enforced.
- No secrets are exposed in frontend code.
- The app starts with documented configuration.
- Core tests pass.
- Production build completes successfully.

### AC-07: Responsive Design

- The primary flow works on desktop and mobile.
- No essential control is inaccessible on small screens.
- Keyboard navigation and focus indicators work.
- Loading, empty, and error states are implemented.

# 20. Implementation Roadmap for Codex

Implement the application in the following sequence. Do not build all pages with mock data and declare the project complete.

## Phase 1 — Repository Inspection and Foundation

- Inspect the existing repository.
- Identify installed dependencies and current architecture.
- Preserve working code unless there is a clear reason to change it.
- Establish TypeScript, linting, formatting, and environment configuration.
- Set up React, Express, and MongoDB connectivity.
- Add health checks and centralized error handling.
- Document the setup instructions.

**Exit condition:** Frontend and backend run locally, and the backend can connect to MongoDB.

## Phase 2 — Domain Models and API Contracts

- Implement the case, suspect, evidence, progress, and accusation schemas.
- Implement request and response validation.
- Define public and private data transfer objects.
- Add ownership and session-access checks.
- Add unit tests for core domain rules.

**Exit condition:** Case data can be stored and retrieved securely using deterministic test fixtures.

## Phase 3 — Mystery Generation Engine

- Integrate the Gemini provider.
- Create versioned prompt templates.
- Implement blueprint generation.
- Implement evidence generation.
- Implement consistency validation.
- Add asynchronous generation status tracking.
- Add bounded retries and failure handling.

**Exit condition:** A valid user premise can produce a complete, validated, playable case.

## Phase 4 — Core Frontend

- Build the landing page.
- Build the creation form.
- Build generation progress.
- Build the dashboard.
- Build the investigation room.
- Build suspect and evidence views.
- Connect all screens to actual API endpoints.

**Exit condition:** A user can create and investigate a real generated case.

## Phase 5 — Gameplay and Reveal

- Implement notes and bookmarks.
- Implement accusation submission.
- Implement backend correctness evaluation.
- Implement controlled solution reveal.
- Display evidence-based explanations.
- Add replay and case deletion.

**Exit condition:** A player can complete the full gameplay loop without manually modifying database state.

## Phase 6 — Media Enhancements

- Add optional image generation.
- Add optional audio generation.
- Store media assets securely.
- Add transcripts and metadata.
- Implement fallbacks for failed or unsupported media generation.

**Exit condition:** Available media renders correctly, and unsupported media never breaks the case.

## Phase 7 — QA and Deployment

- Run unit, integration, and end-to-end tests.
- Verify authorization boundaries.
- Verify hidden-solution confidentiality.
- Test responsive layouts and accessibility.
- Configure production environment variables.
- Deploy frontend, backend, database, and optional storage.
- Document deployment and troubleshooting.

**Exit condition:** The application is deployed, the complete mystery flow works, and all release-blocking tests pass.

# 21. Instructions for Codex

Treat this document as the authoritative product specification.

1. Inspect the repository before changing files.
2. Identify existing code that can be reused.
3. Implement the product in the roadmap order.
4. Use real backend and database integration rather than hardcoded mock data.
5. Do not implement fake AI generation disguised as a successful Gemini integration.
6. Keep AI credentials on the server.
7. Use structured output validation and deterministic game rules.
8. Never expose the culprit or hidden solution before the permitted reveal.
9. Keep public and private case representations separate.
10. Build reusable, typed components and maintainable services.
11. Handle loading, error, empty, and success states.
12. Add tests alongside implementation.
13. Do not silently remove or weaken acceptance criteria.
14. Do not invent unsupported provider capabilities.
15. If a requirement depends on an unavailable external service, implement a documented abstraction and a safe fallback.
16. Do not leave core gameplay buttons disconnected or nonfunctional.
17. Do not claim a feature is complete unless its behavior has been implemented and verified.
18. Update project documentation whenever implementation decisions materially change.
19. Keep this specification synchronized with any approved scope changes.
20. At the end of each phase, report files changed, features completed, tests run, outstanding issues, and the next phase.

If an implementation decision is not specified, choose the simplest secure and maintainable solution consistent with this document. Do not ask for clarification on routine engineering choices.

# 22. Definition of Done

The AI Mystery Room project is complete for its initial release when:

- [ ] The React frontend is functional and responsive.
- [ ] The Express backend is operational.
- [ ] MongoDB persistence works.
- [ ] Gemini generates structured mystery blueprints.
- [ ] Evidence is generated from a canonical case plan.
- [ ] Playable cases pass consistency and solvability checks.
- [ ] The evidence locker supports all implemented evidence types.
- [ ] Player progress persists securely.
- [ ] Culprit selection works.
- [ ] Correctness is verified by the backend.
- [ ] The solution reveal is protected.
- [ ] Missing or failed media has a usable fallback.
- [ ] Error handling and generation retries work.
- [ ] Automated tests cover core functionality and security rules.
- [ ] Environment configuration and setup instructions are documented.
- [ ] Production build and deployment have been verified.
- [ ] No critical acceptance criteria remain incomplete.

---

## Final Product Principle

**AI creates the story. The backend preserves the truth. Evidence lets the player discover it.**

The mystery must be generated as one coherent investigation, not as a collection of unrelated AI-generated artifacts. The player should win by reasoning from the available clues, and the final explanation should prove why the selected culprit is correct.
