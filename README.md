# Content Intelligence Review Dashboard

An internal AI-assisted content review interface built as part of the W&W × QIQ AI content intelligence ecosystem.

The application provides a human-review layer between automated content generation and downstream publishing workflows.
Overview

The system follows a human-in-the-loop content workflow:

Newsletter / Source → Content Ingestion → AI Content Atom Generation → Human Review → Approval / Rejection → Publishing Pipeline

This repository contains only the frontend review interface.

The backend infrastructure, automation workflows, database credentials, and publishing systems are maintained separately in private company infrastructure.
Core Features

    Review AI-generated content atoms
    Approve or reject generated content
    Edit content before approval
    Inspect the originating newsletter/source
    View content version history
    Filter content by review status and content angle
    Track generated, edited, approved, and rejected states
    Responsive internal operations dashboard

# Content Lifecycle

Each generated content atom begins with:

pending_review

A reviewer can then:

pending_review → approved

or

pending_review → rejected

Content may also be edited before approval.

Every meaningful content edit can create a new version while preserving the original AI-generated version for future analysis.
Architecture

                     Public Frontend
                           │
                           ▼
                    Review Dashboard
                           │
                           ▼
                     REST API Layer
                           │
                     Private Backend
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
          Supabase                    n8n
       Database/Auth             Automation Layer
              │                         │
              └────────────┬────────────┘
                           ▼
                    Publishing Pipeline

# License / Usage

This repository is publicly available for portfolio and demonstration purposes. The source code remains proprietary to its respective authors and project stakeholders. No permission is granted for commercial reuse, redistribution, or derivative works without written consent.
