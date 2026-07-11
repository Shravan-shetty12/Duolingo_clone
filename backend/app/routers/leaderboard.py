from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserStats, LeaderboardSeedUser
from ..schemas import LeaderboardEntry

router = APIRouter()


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db), user_id: int = 1):
    real_stats = db.query(UserStats).filter_by(user_id=user_id).first()
    seed_users = db.query(LeaderboardSeedUser).all()

    entries = [{"display_name": u.display_name, "xp_total": u.xp_total,
                "avatar_key": u.avatar_key, "is_current_user": False}
               for u in seed_users]
    entries.append({"display_name": "You", "xp_total": real_stats.xp_total,
                    "avatar_key": "star", "is_current_user": True})

    entries.sort(key=lambda x: x["xp_total"], reverse=True)
    return [LeaderboardEntry(rank=i + 1, **e) for i, e in enumerate(entries)]
