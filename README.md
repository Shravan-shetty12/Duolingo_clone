# Duolingo Clone

A full-stack Duolingo clone built with Next.js (TypeScript) + FastAPI + SQLite.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zustand
- **Backend**: Python 3.13, FastAPI, SQLAlchemy 2, SQLite
- **DB**: SQLite (file: `backend/duolingo.db`)

## Architecture

```
Browser (Next.js)
    │  fetch /api/v1/*
    ▼
FastAPI (uvicorn :8000)
    │  SQLAlchemy ORM
    ▼
SQLite (duolingo.db)
```

## Database Schema

```
users               → id, username
user_stats          → user_id FK, xp_total, streak_count, longest_streak,
                      last_active_date, hearts, max_hearts, gems,
                      daily_goal_xp, daily_xp_today
courses             → id, language_name, flag_emoji
units               → id, course_id FK, order_index, title, color_theme
skills              → id, unit_id FK, order_index, title, icon_key, total_levels
user_skill_progress → id, user_id FK, skill_id FK, crowns, last_practiced_at
lessons             → id, skill_id FK, order_index, xp_reward
exercises           → id, lesson_id FK, order_index, type, prompt,
                      correct_answer, options_json, metadata_json
user_lesson_attempts→ id, user_id FK, lesson_id FK, started_at, completed_at,
                      xp_earned, hearts_lost, mistakes_json, status,
                      current_exercise_index
achievements        → id, key, title, description, icon_key, criteria_json
user_achievements   → id, user_id FK, achievement_id FK, earned_at
leaderboard_seed_users → id, display_name, xp_total, avatar_key
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/course/path` | Units + skills with lock/unlock state |
| GET | `/api/v1/lessons/{skill_id}/next` | Next lesson for a skill |
| GET | `/api/v1/lesson/{lesson_id}` | Lesson with all exercises |
| POST | `/api/v1/attempts?lesson_id=` | Start a lesson attempt |
| POST | `/api/v1/attempts/{id}/answer` | Submit an exercise answer |
| POST | `/api/v1/attempts/{id}/complete` | Complete attempt, award XP |
| GET | `/api/v1/me/stats` | Hearts, XP, streak, gems |
| GET | `/api/v1/me/profile` | Full profile + achievements |
| GET | `/api/v1/leaderboard` | Ranked leaderboard |
| POST | `/api/v1/me/hearts/refill` | Refill hearts (mock) |

## Setup

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\pip install -r requirements.txt
venv\Scripts\uvicorn main:app --reload
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

DB is seeded automatically on first run. Swagger UI at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Assumptions

- Single mocked learner (user_id = 1) — no real auth
- Gems are mocked (static value, not spent)
- Audio is placeholder (not implemented)
- Lock/unlock is computed at read time from `user_skill_progress.crowns`, not stored
- Streak increments when a lesson is completed on a new calendar day
- Hearts refill via the "Practice" mock button (no timed regeneration)
