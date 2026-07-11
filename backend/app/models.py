from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, default="learner")
    active_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    stats = relationship("UserStats", back_populates="user", uselist=False)
    skill_progress = relationship("UserSkillProgress", back_populates="user")
    attempts = relationship("UserLessonAttempt", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    enrolled_courses = relationship("UserCourse", back_populates="user")


class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    xp_total = Column(Integer, default=0)
    streak_count = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_active_date = Column(Date, nullable=True)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    daily_goal_xp = Column(Integer, default=50)
    daily_xp_today = Column(Integer, default=0)
    user = relationship("User", back_populates="stats")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    language_name = Column(String)
    flag_emoji = Column(String)
    units = relationship("Unit", back_populates="course", order_by="Unit.order_index")


class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_index = Column(Integer)
    title = Column(String)
    color_theme = Column(String, default="#58CC02")
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    order_index = Column(Integer)
    title = Column(String)
    icon_key = Column(String)
    total_levels = Column(Integer, default=5)
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index")
    progress = relationship("UserSkillProgress", back_populates="skill")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    crowns = Column(Integer, default=0)
    last_practiced_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="progress")


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order_index = Column(Integer)
    xp_reward = Column(Integer, default=10)
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index")


class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    order_index = Column(Integer)
    type = Column(String)
    prompt = Column(Text)
    correct_answer = Column(Text)
    options_json = Column(Text, default="[]")
    metadata_json = Column(Text, default="{}")
    lesson = relationship("Lesson", back_populates="exercises")


class UserLessonAttempt(Base):
    __tablename__ = "user_lesson_attempts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    xp_earned = Column(Integer, default=0)
    hearts_lost = Column(Integer, default=0)
    mistakes_json = Column(Text, default="[]")
    status = Column(String, default="in_progress")
    current_exercise_index = Column(Integer, default=0)
    user = relationship("User", back_populates="attempts")
    lesson = relationship("Lesson")


class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True)
    title = Column(String)
    description = Column(String)
    icon_key = Column(String)
    criteria_json = Column(Text, default="{}")
    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)
    achievement = relationship("Achievement", back_populates="user_achievements")
    user = relationship("User", back_populates="achievements")


class UserCourse(Base):
    __tablename__ = "user_courses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    xp_in_course = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="enrolled_courses")
    course = relationship("Course")


class LeaderboardSeedUser(Base):
    __tablename__ = "leaderboard_seed_users"
    id = Column(Integer, primary_key=True)
    display_name = Column(String)
    xp_total = Column(Integer)
    avatar_key = Column(String)
