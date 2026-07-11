from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserStats, Achievement, UserAchievement
from ..schemas import StatsOut, ProfileOut, AchievementOut

router = APIRouter()


@router.get("/me/stats", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db), user_id: int = 1):
    stats = db.query(UserStats).filter_by(user_id=user_id).first()
    return StatsOut(
        xp_total=stats.xp_total, streak_count=stats.streak_count,
        longest_streak=stats.longest_streak, hearts=stats.hearts,
        max_hearts=stats.max_hearts, gems=stats.gems,
        daily_goal_xp=stats.daily_goal_xp, daily_xp_today=stats.daily_xp_today,
    )


@router.get("/me/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db), user_id: int = 1):
    user = db.query(User).filter_by(id=user_id).first()
    stats = user.stats
    earned_ids = {ua.achievement_id for ua in user.achievements}
    all_achievements = db.query(Achievement).all()
    achievements_out = [
        AchievementOut(key=a.key, title=a.title, description=a.description,
                       icon_key=a.icon_key, earned=a.id in earned_ids)
        for a in all_achievements
    ]
    return ProfileOut(
        username=user.username,
        stats=StatsOut(
            xp_total=stats.xp_total, streak_count=stats.streak_count,
            longest_streak=stats.longest_streak, hearts=stats.hearts,
            max_hearts=stats.max_hearts, gems=stats.gems,
            daily_goal_xp=stats.daily_goal_xp, daily_xp_today=stats.daily_xp_today,
        ),
        achievements=achievements_out,
    )
