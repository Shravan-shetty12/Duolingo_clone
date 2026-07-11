from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Skill, Lesson
from ..schemas import LessonOut

router = APIRouter()


@router.get("/lessons/{skill_id}/next", response_model=LessonOut)
def get_next_lesson(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter_by(id=skill_id).first()
    if not skill:
        raise HTTPException(404, "Skill not found")
    lesson = db.query(Lesson).filter_by(skill_id=skill_id).order_by(Lesson.order_index).first()
    if not lesson:
        raise HTTPException(404, "No lessons for this skill")
    return lesson


@router.get("/lesson/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter_by(id=lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return lesson
