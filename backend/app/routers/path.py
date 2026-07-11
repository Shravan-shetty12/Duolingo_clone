from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Unit, UserSkillProgress, User, Course, UserCourse
from ..schemas import PathOut, UnitOut, SkillOut

router = APIRouter()


@router.get("/course/path", response_model=PathOut)
def get_path(db: Session = Depends(get_db), user_id: int = 1):
    user = db.query(User).filter_by(id=user_id).first()
    if not user or not user.active_course_id:
        raise HTTPException(400, "No active course selected")

    units = (db.query(Unit)
             .filter_by(course_id=user.active_course_id)
             .order_by(Unit.order_index).all())
    if not units:
        raise HTTPException(404, "No units found for this course")

    all_skills = [s for u in units for s in sorted(u.skills, key=lambda s: s.order_index)]
    progress_map = {p.skill_id: p for p in db.query(UserSkillProgress).filter_by(user_id=user_id)}

    skill_status: dict[int, tuple[str, int]] = {}
    prev_completed = True
    for skill in all_skills:
        prog = progress_map.get(skill.id)
        crowns = prog.crowns if prog else 0
        if crowns >= skill.total_levels:
            status = "completed"
        elif prev_completed:
            status = "available"
        else:
            status = "locked"
        skill_status[skill.id] = (status, crowns)
        prev_completed = (status == "completed")

    result_units = []
    for unit in units:
        skills_out = [
            SkillOut(id=s.id, title=s.title, icon_key=s.icon_key, order_index=s.order_index,
                     total_levels=s.total_levels, crowns=skill_status[s.id][1],
                     status=skill_status[s.id][0])
            for s in sorted(unit.skills, key=lambda s: s.order_index)
        ]
        result_units.append(UnitOut(id=unit.id, title=unit.title, color_theme=unit.color_theme,
                                    order_index=unit.order_index, skills=skills_out))

    return PathOut(course_id=user.active_course_id, units=result_units)
