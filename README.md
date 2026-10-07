

```markdown
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

- Mock login/session authentication
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
- Hosted Zone search
- DNS Record search
- DNS Record type filtering
- Pagination
- Form validation
- TTL validation
- Type-specific DNS record placeholders
- Success notifications
- Responsive layout
- Session persistence
- Logout
- Protected pages
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
│   ├── requirements.txt
│   └── route53.db
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── hosted-zones/
│   │   ├── traffic-policies/
│   │   ├── health-checks/
│   │   ├── resolver/
│   │   ├── profiles/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

## Environment Variable

The frontend uses the following environment variable to connect to the backend:

```text
NEXT_PUBLIC_API_URL
```

For local development:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For the deployed frontend:

```text
NEXT_PUBLIC_API_URL=https://route53-clone-mdtb.onrender.com
```

## Authentication

The project uses mock authentication.

No real authentication service is required.

Users can enter any non-empty email address and password.

Example:

```text
Email: admin@example.com
Password: admin123
```

The login session is stored in the browser using `localStorage`.

## Database

The application uses:

- SQLite
- SQLAlchemy

The local database file is:

```text
backend/route53.db
```

The database contains:

### Hosted Zones

- ID
- Name
- Type
- Description
- Created date

### DNS Records

- ID
- Hosted Zone ID
- Name
- Type
- Value
- TTL
- Created date

## Hosted Zone API

### Create Hosted Zone

```http
POST /hosted-zones
```

### Get Hosted Zones

```http
GET /hosted-zones
```

### Get Hosted Zone

```http
GET /hosted-zones/{zone_id}
```

### Update Hosted Zone

```http
PUT /hosted-zones/{zone_id}
```

### Delete Hosted Zone

```http
DELETE /hosted-zones/{zone_id}
```

## DNS Record API

### Create DNS Record

```http
POST /hosted-zones/{zone_id}/records
```

### Get DNS Records

```http
GET /hosted-zones/{zone_id}/records
```

### Get DNS Record

```http
GET /hosted-zones/{zone_id}/records/{record_id}
```

### Update DNS Record

```http
PUT /hosted-zones/{zone_id}/records/{record_id}
```

### Delete DNS Record

```http
DELETE /hosted-zones/{zone_id}/records/{record_id}
```

## Supported DNS Record Types

The application supports the following DNS record types:

```text
A
AAAA
CNAME
TXT
MX
NS
PTR
SRV
CAA
```

## Validation

The application performs validation for:

- Required fields
- DNS record type
- TTL value
- Hosted Zone existence
- DNS Record existence
- Hosted Zone and DNS Record relationships

TTL must be a whole number greater than zero.

## Search and Filtering

### Hosted Zones

Hosted Zones can be searched using:

- Domain name
- Hosted Zone type
- Description

### DNS Records

DNS Records can be searched using:

- Record name
- Record type
- Record value

DNS Records can also be filtered by record type.

## Pagination

Pagination is implemented for:

- Hosted Zones
- DNS Records

The application displays a limited number of records per page and provides:

- Previous
- Next
- Current page
- Total records

## Responsive Design

The application supports different screen sizes, including:

- Desktop
- Tablet
- Mobile

The interface includes responsive navigation, tables, forms, search fields, and modals.

## Mock Route 53 Sections

The application includes mock sections for Route 53 functionality that is outside the core CRUD implementation:

- Traffic Policies
- Health Checks
- Resolver
- Profiles

These sections provide Route 53-like navigation and interface structure.

## Deployment

The backend and frontend are deployed separately using Render.

### Backend

```text
https://route53-clone-mdtb.onrender.com
```

### Frontend

The frontend is deployed separately on Render and connects to the backend using:

```text
NEXT_PUBLIC_API_URL
```

## Backend Deployment Configuration

Build command:

```text
pip install -r requirements.txt
```

Start command:

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Root directory:

```text
backend
```

## Frontend Deployment Configuration

Build command:

```text
npm install && npm run build
```

Start command:

```text
npm run start
```

Root directory:

```text
frontend
```

## Testing

The following functionality has been tested:

- User login
- Session persistence
- Logout
- Protected pages
- Dashboard
- Hosted Zone creation
- Hosted Zone editing
- Hosted Zone deletion
- Hosted Zone search
- Hosted Zone pagination
- DNS Record creation
- DNS Record editing
- DNS Record deletion
- DNS Record search
- DNS Record type filtering
- DNS Record pagination
- DNS validation
- TTL validation
- Responsive layout
- Traffic Policies page
- Health Checks page
- Resolver page
- Profiles page

## Future Improvements

Possible future improvements include:

- Real AWS Route 53 integration
- Real user authentication
- JWT authentication
- PostgreSQL database
- Role-based access control
- Advanced DNS routing policies
- Real health checks
- Traffic policy management
- DNS import/export
- Audit logs
- Cloud deployment using AWS services

## License

This project is created for educational and demonstration purposes.
```
