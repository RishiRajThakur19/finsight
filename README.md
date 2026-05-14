# FinSight

Financial Risk & Intelligence Dashboard for consulting analysts.

## Tech Stack
- Frontend: React.js + Tailwind CSS + Recharts + Framer Motion
- Backend: Python FastAPI + Pandas + Scikit-learn + SQLAlchemy
- Database: SQLite
- AI: Groq API
- Auth: JWT tokens
- PDF: FPDF2

## Setup Instructions

1. Copy `.env.example` to `.env` and fill in your Groq API key.
2. Ensure you have Docker installed.
3. Run `docker-compose up --build` to start both frontend and backend.

### Running locally without Docker

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo Logins
- analyst@finsight.com / analyst123
- manager@finsight.com / manager123
- risk@finsight.com / risk123
