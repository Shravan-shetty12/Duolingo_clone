from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Course, User, UserCourse
from ..schemas import CourseOut

router = APIRouter()


@router.get("/courses", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db), user_id: int = 1):
    user = db.query(User).filter_by(id=user_id).first()
    enrolled_map = {uc.course_id: uc for uc in (user.enrolled_courses if user else [])}
    courses = db.query(Course).all()
    return [
        CourseOut(
            id=c.id, language_name=c.language_name, flag_emoji=c.flag_emoji,
            enrolled=c.id in enrolled_map,
            xp_in_course=enrolled_map[c.id].xp_in_course if c.id in enrolled_map else 0,
        )
        for c in courses
    ]


@router.post("/me/course")
def set_active_course(course_id: int, db: Session = Depends(get_db), user_id: int = 1):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    course = db.query(Course).filter_by(id=course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")

    # Enroll if not already
    existing = db.query(UserCourse).filter_by(user_id=user_id, course_id=course_id).first()
    if not existing:
        db.add(UserCourse(user_id=user_id, course_id=course_id))

    user.active_course_id = course_id
    db.commit()
    return {"active_course_id": course_id, "language": course.language_name, "flag": course.flag_emoji}
