# Route 53 Clone

A full-stack clone of AWS Route 53 built using Next.js, FastAPI, and SQLite.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite

## Features

- Mock login/session
- Dashboard
- Hosted Zone CRUD
- DNS Record CRUD
- DNS record types:
  - A
  - AAAA
  - CNAME
  - TXT
  - MX
  - NS
  - PTR
  - SRV
  - CAA
- Search
- Filtering
- Pagination
- Form validation
- Notifications
- Responsive layout
- Mock Route 53 sections:
  - Traffic Policies
  - Health Checks
  - Resolver
  - Profiles

## Project Structure

```text
route53-clone/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── route53.db
│
├── frontend/
│   ├── app/
│   ├── services/
│   └── package.json
│
└── README.md