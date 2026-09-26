# Content Weaver

Build a clean internal AI Content Review Dashboard for a company content intelligence system.

IMPORTANT ARCHITECTURE

This project is FRONTEND ONLY.

Do NOT connect directly to Supabase.
Do NOT implement database mutations directly from the browser.

The frontend will communicate with a separate FastAPI backend through REST APIs.

Create the frontend architecture so the API base URL comes from:

VITE_API_BASE_URL

Create a reusable API/service layer instead of putting fetch requests directly inside UI components.

PRODUCT PURPOSE

An n8n pipeline ingests newsletters and generates AI content atoms.

Every generated content atom initially has:

status = "pending_review"

Human reviewers use this dashboard to inspect, edit, approve, or reject the generated content.

The approved content will later enter a separate publishing automation pipeline.

DESIGN DIRECTION

Create a premium, minimal internal operations dashboard.

It should feel like an editorial review workspace rather than a generic SaaS dashboard.

Use:
- generous whitespace
- clean typography
- strong information hierarchy
- subtle borders
- compact status badges
- responsive desktop-first layout
- professional neutral visual language

Do not overuse gradients, illustrations or decorative effects.

MAIN PAGE

Create a dashboard called:

Content Review

Default view:

Pending Review

Display content atoms as clean review cards.

Each card should show:

1. Title
2. Hook
3. Brief
4. Content angle
5. Status badge
6. Generated model if available
7. Created date
8. Current version number

Include three primary actions:

Edit
Approve
Reject

APPROVE FLOW

When Approve is clicked:

Call:

PATCH /content-atoms/{id}/approve

Show a confirmation loading state.

After success:
- change status visually to approved
- remove the atom from the Pending Review list
- show a success toast

REJECT FLOW

When Reject is clicked:

Call:

PATCH /content-atoms/{id}/reject

After success:
- change status to rejected
- remove it from Pending Review
- show confirmation

EDIT FLOW

When Edit is clicked:

Open an editing mode or modal.

Allow editing:

title
hook
brief
angle

Save should call:

PATCH /content-atoms/{id}

Payload example:

{
  "title": "...",
  "hook": "...",
  "brief": "...",
  "angle": "industry_signal"
}

Editing does NOT approve the content.

After editing:
status remains pending_review.

Show the new current version after save.

SOURCE NEWSLETTER

Each content atom originates from a newsletter.

Add a collapsible section or side drawer called:

View Source Newsletter

The UI should display:

newsletter subject
sender name
sender email
received date
newsletter body

The frontend should fetch this through:

GET /content-atoms/{id}/source

The source body should be easy to read but visually secondary to the generated content.

VERSION HISTORY

Add a collapsible:

Version History

Fetch:

GET /content-atoms/{id}/versions

Display versions vertically:

Version 1
AI Generated
timestamp

Version 2
Human Edit
timestamp
editor if available

Version 3
Human Edit
timestamp

The newest version should be visually identifiable.

Do not implement diff comparison yet.

FILTERING

Provide tabs:

Pending Review
Approved
Rejected

Default:
Pending Review

API examples:

GET /content-atoms?status=pending_review

GET /content-atoms?status=approved

GET /content-atoms?status=rejected

Add:

Angle filter

Options:

industry_signal
educational
trend
insight
strategic_observation

Add sort:

Newest First
Oldest First

EMPTY STATES

Create proper empty states.

Example:

"No content atoms are waiting for review."

LOADING / ERROR STATES

Implement:

skeleton loading cards

error banner with Retry button

button-level loading state for Approve / Reject / Save

API SERVICE ARCHITECTURE

Create a dedicated API service layer.

Suggested structure:

src/
  components/
  pages/
  services/
    api.ts
    contentAtoms.ts
  types/
    contentAtom.ts
  hooks/

Do not scatter API calls throughout components.

CREATE TYPES

ContentAtom:

id
newsletter_id
title
hook
brief
angle
status
current_version
generated_by_model
created_at
updated_at
approved_at
approved_by

ContentAtomVersion:

id
content_atom_id
version_number
title
hook
brief
angle
edit_type
edited_by
created_at

NewsletterSource:

id
sender_name
sender_email
subject
received_at
body

AUTHENTICATION

Prepare the UI architecture for future authentication but do not build full authentication yet.

Create a simple placeholder protected dashboard structure so authentication can later be added through the FastAPI backend / Supabase Auth.

DEVELOPMENT MODE

Because the FastAPI backend may not exist yet:

Create mock content atom data so the UI is fully usable immediately.

Keep mock data isolated from production API logic.

Make it easy to switch from:

mock data

to:

real API calls

once VITE_API_BASE_URL is available.

FINAL GOAL

Generate a polished frontend foundation that I can export from Lovable, run locally, connect to my future FastAPI backend, and deploy to Vercel.

Do not implement direct Supabase access.
Do not expose Supabase service keys.
Keep frontend and backend responsibilities clearly separated.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b043fb0-dd39-448e-9fe8-1494da809e05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
