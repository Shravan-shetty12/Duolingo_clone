from typing import Literal, Optional
from pydantic import BaseModel
from datetime import datetime


class SkillOut(BaseModel):
    id: int
    title: str
    icon_key: str
    order_index: int
    total_levels: int
    crowns: int
    status: Literal["locked", "available", "completed"]
    model_config = {"from_attributes": True}


class UnitOut(BaseModel):
    id: int
    title: str
    color_theme: str
    order_index: int
    skills: list[SkillOut]


class PathOut(BaseModel):
    course_id: int
    units: list[UnitOut]


class ExerciseOut(BaseModel):
    id: int
    order_index: int
    type: str
    prompt: str
    options_json: str
    model_config = {"from_attributes": True}


class LessonOut(BaseModel):
    id: int
    skill_id: int
    xp_reward: int
    exercises: list[ExerciseOut]
    model_config = {"from_attributes": True}


class AttemptOut(BaseModel):
    id: int
    lesson_id: int
    status: str
    current_exercise_index: int
    xp_earned: int
    model_config = {"from_attributes": True}


class AnswerIn(BaseModel):
    exercise_id: int
    answer: str


class AnswerOut(BaseModel):
    correct: bool
    correct_answer: str
    hearts_remaining: int
    xp_earned: int
    attempt_status: str


class StatsOut(BaseModel):
    xp_total: int
    streak_count: int
    longest_streak: int
    hearts: int
    max_hearts: int
    gems: int
    daily_goal_xp: int
    daily_xp_today: int


class AchievementOut(BaseModel):
    key: str
    title: str
    description: str
    icon_key: str
    earned: bool


class ProfileOut(BaseModel):
    username: str
    stats: StatsOut
    achievements: list[AchievementOut]


class LeaderboardEntry(BaseModel):
    rank: int
    display_name: str
    xp_total: int
    avatar_key: str
    is_current_user: bool


class CourseOut(BaseModel):
    id: int
    language_name: str
    flag_emoji: str
    enrolled: bool
    xp_in_course: int
    model_config = {"from_attributes": True}


class ProfileOut(BaseModel):
    username: str
    stats: StatsOut
    achievements: list[AchievementOut]
    active_course_id: Optional[int] = None
