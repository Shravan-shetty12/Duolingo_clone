import json
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserLessonAttempt, Exercise, UserStats, UserSkillProgress, Lesson
from ..schemas import AttemptOut, AnswerIn, AnswerOut

router = APIRouter()


@router.post("/attempts", response_model=AttemptOut)
def start_attempt(lesson_id: int, db: Session = Depends(get_db), user_id: int = 1):
    attempt = UserLessonAttempt(user_id=user_id, lesson_id=lesson_id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


@router.post("/attempts/{attempt_id}/answer", response_model=AnswerOut)
def submit_answer(attempt_id: int, body: AnswerIn, db: Session = Depends(get_db), user_id: int = 1):
    attempt = db.query(UserLessonAttempt).filter_by(id=attempt_id, user_id=user_id).first()
    if not attempt or attempt.status != "in_progress":
        raise HTTPException(400, "Invalid attempt")

    exercise = db.query(Exercise).filter_by(id=body.exercise_id).first()
    if not exercise:
        raise HTTPException(404, "Exercise not found")

    stats = db.query(UserStats).filter_by(user_id=user_id).first()
    correct = body.answer.strip().lower() == exercise.correct_answer.strip().lower()

    if not correct:
        mistakes = json.loads(attempt.mistakes_json)
        mistakes.append({"exercise_id": body.exercise_id, "given": body.answer})
        attempt.mistakes_json = json.dumps(mistakes)
        attempt.hearts_lost += 1
        if stats.hearts > 0:
            stats.hearts -= 1
        if stats.hearts == 0:
            attempt.status = "failed"
            attempt.completed_at = datetime.utcnow()

    attempt.current_exercise_index += 1
    db.commit()

    return AnswerOut(correct=correct, correct_answer=exercise.correct_answer,
                     hearts_remaining=stats.hearts, xp_earned=0,
                     attempt_status=attempt.status)


@router.post("/attempts/{attempt_id}/complete", response_model=AttemptOut)
def complete_attempt(attempt_id: int, db: Session = Depends(get_db), user_id: int = 1):
    attempt = db.query(UserLessonAttempt).filter_by(id=attempt_id, user_id=user_id).first()
    if not attempt:
        raise HTTPException(404, "Attempt not found")
    if attempt.status == "failed":
        return attempt

    lesson = db.query(Lesson).filter_by(id=attempt.lesson_id).first()
    stats = db.query(UserStats).filter_by(user_id=user_id).first()

    attempt.status = "completed"
    attempt.completed_at = datetime.utcnow()
    attempt.xp_earned = lesson.xp_reward

    stats.xp_total += lesson.xp_reward
    today = date.today()
    if stats.last_active_date != today:
        if stats.last_active_date == today - timedelta(days=1):
            stats.streak_count += 1
        else:
            stats.streak_count = 1
        stats.last_active_date = today
        stats.daily_xp_today = lesson.xp_reward
    else:
        stats.daily_xp_today += lesson.xp_reward

    if stats.streak_count > stats.longest_streak:
        stats.longest_streak = stats.streak_count

    skill_id = lesson.skill_id
    prog = db.query(UserSkillProgress).filter_by(user_id=user_id, skill_id=skill_id).first()
    if not prog:
        prog = UserSkillProgress(user_id=user_id, skill_id=skill_id, crowns=0)
        db.add(prog)
        db.flush()
    if prog.crowns < lesson.skill.total_levels:
        prog.crowns += 1
    prog.last_practiced_at = datetime.utcnow()

    db.commit()
    db.refresh(attempt)
    return attempt


@router.post("/me/hearts/refill")
def refill_hearts(db: Session = Depends(get_db), user_id: int = 1):
    stats = db.query(UserStats).filter_by(user_id=user_id).first()
    stats.hearts = stats.max_hearts
    db.commit()
    return {"hearts": stats.hearts}
