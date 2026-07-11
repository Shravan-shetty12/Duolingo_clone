import json
from datetime import date, datetime
from .database import engine, SessionLocal, Base
from .models import (User, UserStats, Course, Unit, Skill, UserSkillProgress,
                     Lesson, Exercise, Achievement, UserAchievement, LeaderboardSeedUser)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(User).first():
        db.close()
        print("Already seeded.")
        return

    user = User(username="learner")
    db.add(user)
    db.flush()

    db.add(UserStats(user_id=user.id, xp_total=120, streak_count=3, longest_streak=5,
                     last_active_date=date.today(), hearts=4, gems=500,
                     daily_goal_xp=50, daily_xp_today=20))

    course = Course(language_name="Spanish", flag_emoji="🇪🇸")
    db.add(course)
    db.flush()

    units_data = [
        ("Basics", "#58CC02", [
            ("Greetings", "👋", [
                [("mcq", "What does 'Hola' mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                 ("type_answer", "Translate: 'Good morning'", "Buenos días", []),
                 ("mcq", "What does 'Adiós' mean?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                 ("fill_blank", "_____ días (Good morning)", "Buenos", ["Buenos", "Buenas", "Buen", "Bueno"]),
                 ("translate", "Tap the words: 'Thank you'", "Gracias", ["Gracias", "Por", "favor", "Hola", "Adiós"]),
                 ("mcq", "How do you say 'Please'?", "Por favor", ["Gracias", "Por favor", "De nada", "Perdón"]),
                 ("type_answer", "Translate: 'You're welcome'", "De nada", [])],
            ]),
            ("Numbers", "🔢", [
                [("mcq", "What is 'uno'?", "1", ["1", "2", "3", "4"]),
                 ("mcq", "What is 'dos'?", "2", ["1", "2", "3", "4"]),
                 ("type_answer", "Translate: 'five'", "cinco", []),
                 ("fill_blank", "_____ (three)", "tres", ["tres", "cuatro", "dos", "uno"]),
                 ("translate", "Tap: 'ten'", "diez", ["diez", "nueve", "ocho", "siete"]),
                 ("mcq", "What is 'diez'?", "10", ["7", "8", "9", "10"]),
                 ("type_answer", "Translate: 'twenty'", "veinte", [])],
            ]),
            ("Colors", "🎨", [
                [("mcq", "What is 'rojo'?", "red", ["red", "blue", "green", "yellow"]),
                 ("type_answer", "Translate: 'blue'", "azul", []),
                 ("fill_blank", "_____ (green)", "verde", ["verde", "rojo", "azul", "amarillo"]),
                 ("mcq", "What is 'amarillo'?", "yellow", ["red", "blue", "green", "yellow"]),
                 ("translate", "Tap: 'white'", "blanco", ["blanco", "negro", "rojo", "azul"]),
                 ("type_answer", "Translate: 'black'", "negro", []),
                 ("mcq", "What is 'naranja'?", "orange", ["purple", "orange", "pink", "brown"])],
            ]),
        ]),
        ("Family", "#CE82FF", [
            ("Family Members", "👨‍👩‍👧", [
                [("mcq", "What is 'madre'?", "mother", ["mother", "father", "sister", "brother"]),
                 ("type_answer", "Translate: 'father'", "padre", []),
                 ("fill_blank", "_____ (sister)", "hermana", ["hermana", "hermano", "madre", "padre"]),
                 ("mcq", "What is 'abuelo'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                 ("translate", "Tap: 'son'", "hijo", ["hijo", "hija", "padre", "madre"]),
                 ("type_answer", "Translate: 'daughter'", "hija", []),
                 ("mcq", "What is 'tío'?", "uncle", ["uncle", "aunt", "cousin", "nephew"])],
            ]),
            ("Descriptions", "📝", [
                [("mcq", "What is 'grande'?", "big", ["big", "small", "tall", "short"]),
                 ("type_answer", "Translate: 'small'", "pequeño", []),
                 ("fill_blank", "_____ (tall)", "alto", ["alto", "bajo", "grande", "pequeño"]),
                 ("mcq", "What is 'joven'?", "young", ["old", "young", "new", "old"]),
                 ("translate", "Tap: 'beautiful'", "hermoso", ["hermoso", "feo", "alto", "bajo"]),
                 ("type_answer", "Translate: 'happy'", "feliz", []),
                 ("mcq", "What is 'triste'?", "sad", ["happy", "sad", "angry", "tired"])],
            ]),
            ("Possessives", "🏠", [
                [("mcq", "What is 'mi'?", "my", ["my", "your", "his", "her"]),
                 ("type_answer", "Translate: 'your' (informal)", "tu", []),
                 ("fill_blank", "_____ casa (my house)", "mi", ["mi", "tu", "su", "nuestro"]),
                 ("mcq", "What is 'nuestro'?", "our", ["my", "your", "his", "our"]),
                 ("translate", "Tap: 'their'", "su", ["su", "mi", "tu", "nuestro"]),
                 ("type_answer", "Translate: 'his/her'", "su", []),
                 ("mcq", "What is 'vuestro'?", "your (plural)", ["my", "our", "your (plural)", "their"])],
            ]),
        ]),
        ("Travel", "#FF9600", [
            ("Places", "🗺️", [
                [("mcq", "What is 'aeropuerto'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                 ("type_answer", "Translate: 'hotel'", "hotel", []),
                 ("fill_blank", "_____ (restaurant)", "restaurante", ["restaurante", "hotel", "museo", "playa"]),
                 ("mcq", "What is 'playa'?", "beach", ["mountain", "beach", "forest", "city"]),
                 ("translate", "Tap: 'museum'", "museo", ["museo", "playa", "hotel", "aeropuerto"]),
                 ("type_answer", "Translate: 'train station'", "estación de tren", []),
                 ("mcq", "What is 'ciudad'?", "city", ["village", "city", "town", "country"])],
            ]),
            ("Directions", "🧭", [
                [("mcq", "What is 'izquierda'?", "left", ["left", "right", "straight", "back"]),
                 ("type_answer", "Translate: 'right'", "derecha", []),
                 ("fill_blank", "Todo _____ (straight ahead)", "recto", ["recto", "izquierda", "derecha", "atrás"]),
                 ("mcq", "What is 'cerca'?", "near", ["far", "near", "here", "there"]),
                 ("translate", "Tap: 'far'", "lejos", ["lejos", "cerca", "aquí", "allí"]),
                 ("type_answer", "Translate: 'here'", "aquí", []),
                 ("mcq", "What is 'norte'?", "north", ["north", "south", "east", "west"])],
            ]),
            ("Transport", "🚌", [
                [("mcq", "What is 'autobús'?", "bus", ["bus", "train", "plane", "car"]),
                 ("type_answer", "Translate: 'train'", "tren", []),
                 ("fill_blank", "_____ (taxi)", "taxi", ["taxi", "tren", "autobús", "avión"]),
                 ("mcq", "What is 'avión'?", "plane", ["bus", "train", "plane", "boat"]),
                 ("translate", "Tap: 'car'", "coche", ["coche", "tren", "avión", "barco"]),
                 ("type_answer", "Translate: 'bicycle'", "bicicleta", []),
                 ("mcq", "What is 'barco'?", "boat", ["bus", "train", "plane", "boat"])],
            ]),
        ]),
    ]

    all_skills = []
    for u_idx, (u_title, u_color, skills_data) in enumerate(units_data):
        unit = Unit(course_id=course.id, order_index=u_idx, title=u_title, color_theme=u_color)
        db.add(unit)
        db.flush()
        for s_idx, (s_title, s_icon, lessons_data) in enumerate(skills_data):
            skill = Skill(unit_id=unit.id, order_index=s_idx, title=s_title,
                          icon_key=s_icon, total_levels=5)
            db.add(skill)
            db.flush()
            all_skills.append(skill)
            for l_idx, exercises_data in enumerate(lessons_data):
                lesson = Lesson(skill_id=skill.id, order_index=l_idx, xp_reward=10)
                db.add(lesson)
                db.flush()
                for e_idx, (e_type, prompt, correct, options) in enumerate(exercises_data):
                    db.add(Exercise(lesson_id=lesson.id, order_index=e_idx, type=e_type,
                                    prompt=prompt, correct_answer=correct,
                                    options_json=json.dumps(options)))

    for i, skill in enumerate(all_skills[:2]):
        db.add(UserSkillProgress(user_id=user.id, skill_id=skill.id,
                                 crowns=3 if i == 0 else 1,
                                 last_practiced_at=datetime.utcnow()))

    achievements = [
        ("first_lesson", "First Steps", "Complete your first lesson", "🎯"),
        ("streak_3", "On Fire!", "Maintain a 3-day streak", "🔥"),
        ("xp_100", "Century", "Earn 100 XP", "⭐"),
        ("perfect_lesson", "Flawless", "Complete a lesson without mistakes", "💎"),
        ("streak_7", "Week Warrior", "Maintain a 7-day streak", "🏆"),
    ]
    ach_objs = []
    for key, title, desc, icon in achievements:
        a = Achievement(key=key, title=title, description=desc, icon_key=icon)
        db.add(a)
        ach_objs.append(a)
    db.flush()

    db.add(UserAchievement(user_id=user.id, achievement_id=ach_objs[0].id))
    db.add(UserAchievement(user_id=user.id, achievement_id=ach_objs[1].id))
    db.add(UserAchievement(user_id=user.id, achievement_id=ach_objs[2].id))

    for name, xp, avatar in [("Carlos", 850, "owl"), ("Maria", 720, "bear"),
                               ("Alex", 650, "fox"), ("Sofia", 580, "cat"),
                               ("James", 430, "dog"), ("Priya", 310, "owl")]:
        db.add(LeaderboardSeedUser(display_name=name, xp_total=xp, avatar_key=avatar))

    db.commit()
    db.close()
    print("Seeded successfully")


if __name__ == "__main__":
    seed()
