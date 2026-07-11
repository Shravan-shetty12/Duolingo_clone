import json
from datetime import date, datetime
from .database import engine, SessionLocal, Base
from .models import (User, UserStats, Course, Unit, Skill, UserSkillProgress,
                     Lesson, Exercise, Achievement, UserAchievement,
                     LeaderboardSeedUser, UserCourse)


COURSES = {
    "English": {
        "flag": "🇬🇧",
        "units": [
            ("Basics", "#58CC02", [
                ("Greetings", "👋", [[
                    ("mcq", "Which word means a friendly greeting?", "Hello", ["Hello", "Goodbye", "Sorry", "Please"]),
                    ("type_answer", "What do you say when you meet someone in the morning?", "Good morning", []),
                    ("mcq", "Which phrase means farewell?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                    ("fill_blank", "_____ you (Thank)", "Thank", ["Thank", "Sorry", "Please", "Hello"]),
                    ("translate", "Tap: a polite request word", "Please", ["Please", "Sorry", "Hello", "Bye"]),
                    ("mcq", "How do you apologize?", "Sorry", ["Thanks", "Please", "Sorry", "Hello"]),
                    ("type_answer", "Reply to 'Thank you'", "You're welcome", []),
                ]]),
                ("Numbers", "🔢", [[
                    ("mcq", "How do you spell 1?", "one", ["one", "two", "three", "four"]),
                    ("mcq", "How do you spell 2?", "two", ["one", "two", "three", "four"]),
                    ("type_answer", "Spell the number 5", "five", []),
                    ("fill_blank", "_____ (3)", "three", ["three", "four", "two", "one"]),
                    ("translate", "Tap: the word for 10", "ten", ["ten", "nine", "eight", "seven"]),
                    ("mcq", "Which word means 10?", "ten", ["seven", "eight", "nine", "ten"]),
                    ("type_answer", "Spell the number 20", "twenty", []),
                ]]),
                ("Colors", "🎨", [[
                    ("mcq", "What color is the sky on a clear day?", "blue", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "What color is grass?", "green", []),
                    ("fill_blank", "The sun is _____ (color)", "yellow", ["yellow", "red", "blue", "green"]),
                    ("mcq", "What color is blood?", "red", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: the color of snow", "white", ["white", "black", "red", "blue"]),
                    ("type_answer", "What color is coal?", "black", []),
                    ("mcq", "What color is an orange fruit?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Grammar", "#CE82FF", [
                ("Pronouns", "🙋", [[
                    ("mcq", "Which pronoun refers to yourself?", "I", ["I", "you", "he", "she"]),
                    ("type_answer", "What pronoun do you use for a male person?", "he", []),
                    ("fill_blank", "_____ is my friend (female)", "She", ["She", "He", "They", "It"]),
                    ("mcq", "Which pronoun is used for a group of people?", "they", ["I", "you", "he", "they"]),
                    ("translate", "Tap: the pronoun for yourself and others", "we", ["we", "they", "I", "you"]),
                    ("type_answer", "What pronoun refers to a thing?", "it", []),
                    ("mcq", "Which pronoun is used when speaking to someone?", "you", ["I", "you", "he", "she"]),
                ]]),
                ("Verbs", "⚡", [[
                    ("mcq", "What is the verb in: 'She runs fast'?", "runs", ["runs", "fast", "she", "the"]),
                    ("type_answer", "Base form of 'running'", "run", []),
                    ("fill_blank", "He _____ to school (go)", "goes", ["goes", "go", "went", "gone"]),
                    ("mcq", "Past tense of 'eat'?", "ate", ["eated", "ate", "eat", "eaten"]),
                    ("translate", "Tap: past tense of 'see'", "saw", ["saw", "seen", "see", "sees"]),
                    ("type_answer", "Past tense of 'run'", "ran", []),
                    ("mcq", "Which is correct: 'She ___ happy'?", "is", ["are", "is", "am", "be"]),
                ]]),
                ("Articles", "📖", [[
                    ("mcq", "Which article is used before a vowel sound?", "an", ["a", "an", "the", "some"]),
                    ("type_answer", "Article for a specific noun", "the", []),
                    ("fill_blank", "I have _____ apple", "an", ["an", "a", "the", "some"]),
                    ("mcq", "'___ cat is on the mat' — which article?", "The", ["A", "An", "The", "Some"]),
                    ("translate", "Tap: article for a non-specific singular noun", "a", ["a", "an", "the", "some"]),
                    ("type_answer", "Complete: '___ umbrella'", "an", []),
                    ("mcq", "Which article makes a noun definite?", "the", ["a", "an", "the", "some"]),
                ]]),
            ]),
            ("Vocabulary", "#FF9600", [
                ("Animals", "🐾", [[
                    ("mcq", "What is a domestic animal that barks?", "dog", ["dog", "cat", "bird", "fish"]),
                    ("type_answer", "Name the animal that meows", "cat", []),
                    ("fill_blank", "A _____ can fly (bird)", "bird", ["bird", "fish", "dog", "cat"]),
                    ("mcq", "Which animal lives in water?", "fish", ["dog", "cat", "bird", "fish"]),
                    ("translate", "Tap: the largest land animal", "elephant", ["elephant", "lion", "tiger", "bear"]),
                    ("type_answer", "Name the animal known as king of the jungle", "lion", []),
                    ("mcq", "Which animal is known for its stripes?", "tiger", ["lion", "tiger", "bear", "wolf"]),
                ]]),
                ("Food", "🍎", [[
                    ("mcq", "Which is a fruit?", "apple", ["apple", "carrot", "potato", "onion"]),
                    ("type_answer", "Name a yellow curved fruit", "banana", []),
                    ("fill_blank", "I drink _____ in the morning (milk)", "milk", ["milk", "juice", "water", "tea"]),
                    ("mcq", "Which is a vegetable?", "carrot", ["apple", "banana", "carrot", "grape"]),
                    ("translate", "Tap: a common breakfast grain food", "bread", ["bread", "rice", "pasta", "soup"]),
                    ("type_answer", "Name a hot morning drink", "coffee", []),
                    ("mcq", "Which food comes from hens?", "egg", ["milk", "egg", "butter", "cheese"]),
                ]]),
                ("Places", "🗺️", [[
                    ("mcq", "Where do you go to buy things?", "market", ["market", "school", "hospital", "park"]),
                    ("type_answer", "Place where children study", "school", []),
                    ("fill_blank", "I go to the _____ when I am sick (hospital)", "hospital", ["hospital", "school", "park", "market"]),
                    ("mcq", "Where do you go to read books?", "library", ["market", "library", "hospital", "airport"]),
                    ("translate", "Tap: place where planes land", "airport", ["airport", "station", "port", "market"]),
                    ("type_answer", "Place where trains stop", "station", []),
                    ("mcq", "Where do people live together in units?", "apartment", ["house", "apartment", "hotel", "school"]),
                ]]),
            ]),
        ],
    },
    "Spanish": {
        "flag": "🇪🇸",
        "units": [
            ("Basics", "#58CC02", [
                ("Greetings", "👋", [[
                    ("mcq", "What does 'Hola' mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("type_answer", "Translate: 'Good morning'", "Buenos días", []),
                    ("mcq", "What does 'Adiós' mean?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                    ("fill_blank", "_____ días (Good morning)", "Buenos", ["Buenos", "Buenas", "Buen", "Bueno"]),
                    ("translate", "Tap the words: 'Thank you'", "Gracias", ["Gracias", "Por", "favor", "Hola", "Adiós"]),
                    ("mcq", "How do you say 'Please'?", "Por favor", ["Gracias", "Por favor", "De nada", "Perdón"]),
                    ("type_answer", "Translate: 'You're welcome'", "De nada", []),
                ]]),
                ("Numbers", "🔢", [[
                    ("mcq", "What is 'uno'?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'dos'?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'five'", "cinco", []),
                    ("fill_blank", "_____ (three)", "tres", ["tres", "cuatro", "dos", "uno"]),
                    ("translate", "Tap: 'ten'", "diez", ["diez", "nueve", "ocho", "siete"]),
                    ("mcq", "What is 'diez'?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'twenty'", "veinte", []),
                ]]),
                ("Colors", "🎨", [[
                    ("mcq", "What is 'rojo'?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "azul", []),
                    ("fill_blank", "_____ (green)", "verde", ["verde", "rojo", "azul", "amarillo"]),
                    ("mcq", "What is 'amarillo'?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "blanco", ["blanco", "negro", "rojo", "azul"]),
                    ("type_answer", "Translate: 'black'", "negro", []),
                    ("mcq", "What is 'naranja'?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Family", "#CE82FF", [
                ("Family Members", "👨‍👩‍👧", [[
                    ("mcq", "What is 'madre'?", "mother", ["mother", "father", "sister", "brother"]),
                    ("type_answer", "Translate: 'father'", "padre", []),
                    ("fill_blank", "_____ (sister)", "hermana", ["hermana", "hermano", "madre", "padre"]),
                    ("mcq", "What is 'abuelo'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                    ("translate", "Tap: 'son'", "hijo", ["hijo", "hija", "padre", "madre"]),
                    ("type_answer", "Translate: 'daughter'", "hija", []),
                    ("mcq", "What is 'tío'?", "uncle", ["uncle", "aunt", "cousin", "nephew"]),
                ]]),
                ("Descriptions", "📝", [[
                    ("mcq", "What is 'grande'?", "big", ["big", "small", "tall", "short"]),
                    ("type_answer", "Translate: 'small'", "pequeño", []),
                    ("fill_blank", "_____ (tall)", "alto", ["alto", "bajo", "grande", "pequeño"]),
                    ("mcq", "What is 'joven'?", "young", ["old", "young", "new", "old"]),
                    ("translate", "Tap: 'beautiful'", "hermoso", ["hermoso", "feo", "alto", "bajo"]),
                    ("type_answer", "Translate: 'happy'", "feliz", []),
                    ("mcq", "What is 'triste'?", "sad", ["happy", "sad", "angry", "tired"]),
                ]]),
                ("Possessives", "🏠", [[
                    ("mcq", "What is 'mi'?", "my", ["my", "your", "his", "her"]),
                    ("type_answer", "Translate: 'your' (informal)", "tu", []),
                    ("fill_blank", "_____ casa (my house)", "mi", ["mi", "tu", "su", "nuestro"]),
                    ("mcq", "What is 'nuestro'?", "our", ["my", "your", "his", "our"]),
                    ("translate", "Tap: 'their'", "su", ["su", "mi", "tu", "nuestro"]),
                    ("type_answer", "Translate: 'his/her'", "su", []),
                    ("mcq", "What is 'vuestro'?", "your (plural)", ["my", "our", "your (plural)", "their"]),
                ]]),
            ]),
            ("Travel", "#FF9600", [
                ("Places", "🗺️", [[
                    ("mcq", "What is 'aeropuerto'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                    ("type_answer", "Translate: 'hotel'", "hotel", []),
                    ("fill_blank", "_____ (restaurant)", "restaurante", ["restaurante", "hotel", "museo", "playa"]),
                    ("mcq", "What is 'playa'?", "beach", ["mountain", "beach", "forest", "city"]),
                    ("translate", "Tap: 'museum'", "museo", ["museo", "playa", "hotel", "aeropuerto"]),
                    ("type_answer", "Translate: 'train station'", "estación de tren", []),
                    ("mcq", "What is 'ciudad'?", "city", ["village", "city", "town", "country"]),
                ]]),
                ("Directions", "🧭", [[
                    ("mcq", "What is 'izquierda'?", "left", ["left", "right", "straight", "back"]),
                    ("type_answer", "Translate: 'right'", "derecha", []),
                    ("fill_blank", "Todo _____ (straight ahead)", "recto", ["recto", "izquierda", "derecha", "atrás"]),
                    ("mcq", "What is 'cerca'?", "near", ["far", "near", "here", "there"]),
                    ("translate", "Tap: 'far'", "lejos", ["lejos", "cerca", "aquí", "allí"]),
                    ("type_answer", "Translate: 'here'", "aquí", []),
                    ("mcq", "What is 'norte'?", "north", ["north", "south", "east", "west"]),
                ]]),
                ("Transport", "🚌", [[
                    ("mcq", "What is 'autobús'?", "bus", ["bus", "train", "plane", "car"]),
                    ("type_answer", "Translate: 'train'", "tren", []),
                    ("fill_blank", "_____ (taxi)", "taxi", ["taxi", "tren", "autobús", "avión"]),
                    ("mcq", "What is 'avión'?", "plane", ["bus", "train", "plane", "boat"]),
                    ("translate", "Tap: 'car'", "coche", ["coche", "tren", "avión", "barco"]),
                    ("type_answer", "Translate: 'bicycle'", "bicicleta", []),
                    ("mcq", "What is 'barco'?", "boat", ["bus", "train", "plane", "boat"]),
                ]]),
            ]),
        ],
    },
    "French": {
        "flag": "🇫🇷",
        "units": [
            ("Les Bases", "#58CC02", [
                ("Salutations", "👋", [[
                    ("mcq", "What does 'Bonjour' mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("type_answer", "Translate: 'Good evening'", "Bonsoir", []),
                    ("mcq", "What does 'Au revoir' mean?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                    ("fill_blank", "_____ (Thank you)", "Merci", ["Merci", "Bonjour", "Oui", "Non"]),
                    ("translate", "Tap: 'Please'", "S'il vous plaît", ["S'il", "vous", "plaît", "Merci", "Bonjour"]),
                    ("mcq", "How do you say 'Yes'?", "Oui", ["Oui", "Non", "Merci", "Bonjour"]),
                    ("type_answer", "Translate: 'No'", "Non", []),
                ]]),
                ("Nombres", "🔢", [[
                    ("mcq", "What is 'un'?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'deux'?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'five'", "cinq", []),
                    ("fill_blank", "_____ (three)", "trois", ["trois", "quatre", "deux", "un"]),
                    ("translate", "Tap: 'ten'", "dix", ["dix", "neuf", "huit", "sept"]),
                    ("mcq", "What is 'dix'?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'twenty'", "vingt", []),
                ]]),
                ("Couleurs", "🎨", [[
                    ("mcq", "What is 'rouge'?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "bleu", []),
                    ("fill_blank", "_____ (green)", "vert", ["vert", "rouge", "bleu", "jaune"]),
                    ("mcq", "What is 'jaune'?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "blanc", ["blanc", "noir", "rouge", "bleu"]),
                    ("type_answer", "Translate: 'black'", "noir", []),
                    ("mcq", "What is 'orange'?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Famille", "#CE82FF", [
                ("Membres", "👨‍👩‍👧", [[
                    ("mcq", "What is 'mère'?", "mother", ["mother", "father", "sister", "brother"]),
                    ("type_answer", "Translate: 'father'", "père", []),
                    ("fill_blank", "_____ (sister)", "sœur", ["sœur", "frère", "mère", "père"]),
                    ("mcq", "What is 'grand-père'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                    ("translate", "Tap: 'son'", "fils", ["fils", "fille", "père", "mère"]),
                    ("type_answer", "Translate: 'daughter'", "fille", []),
                    ("mcq", "What is 'oncle'?", "uncle", ["uncle", "aunt", "cousin", "nephew"]),
                ]]),
                ("Adjectifs", "📝", [[
                    ("mcq", "What is 'grand'?", "big", ["big", "small", "tall", "short"]),
                    ("type_answer", "Translate: 'small'", "petit", []),
                    ("fill_blank", "_____ (tall)", "grand", ["grand", "petit", "gros", "mince"]),
                    ("mcq", "What is 'jeune'?", "young", ["old", "young", "new", "old"]),
                    ("translate", "Tap: 'beautiful'", "beau", ["beau", "laid", "grand", "petit"]),
                    ("type_answer", "Translate: 'happy'", "heureux", []),
                    ("mcq", "What is 'triste'?", "sad", ["happy", "sad", "angry", "tired"]),
                ]]),
            ]),
            ("Voyage", "#FF9600", [
                ("Lieux", "🗺️", [[
                    ("mcq", "What is 'aéroport'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                    ("type_answer", "Translate: 'hotel'", "hôtel", []),
                    ("fill_blank", "_____ (restaurant)", "restaurant", ["restaurant", "hôtel", "musée", "plage"]),
                    ("mcq", "What is 'plage'?", "beach", ["mountain", "beach", "forest", "city"]),
                    ("translate", "Tap: 'museum'", "musée", ["musée", "plage", "hôtel", "aéroport"]),
                    ("type_answer", "Translate: 'train station'", "gare", []),
                    ("mcq", "What is 'ville'?", "city", ["village", "city", "town", "country"]),
                ]]),
                ("Transport", "🚌", [[
                    ("mcq", "What is 'bus'?", "bus", ["bus", "train", "plane", "car"]),
                    ("type_answer", "Translate: 'train'", "train", []),
                    ("fill_blank", "_____ (taxi)", "taxi", ["taxi", "train", "bus", "avion"]),
                    ("mcq", "What is 'avion'?", "plane", ["bus", "train", "plane", "boat"]),
                    ("translate", "Tap: 'car'", "voiture", ["voiture", "train", "avion", "bateau"]),
                    ("type_answer", "Translate: 'bicycle'", "vélo", []),
                    ("mcq", "What is 'bateau'?", "boat", ["bus", "train", "plane", "boat"]),
                ]]),
            ]),
        ],
    },
    "Japanese": {
        "flag": "🇯🇵",
        "units": [
            ("Basics", "#58CC02", [
                ("Greetings", "👋", [[
                    ("mcq", "What does 'こんにちは' (Konnichiwa) mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Good night"]),
                    ("type_answer", "Translate: 'Good morning'", "おはよう", []),
                    ("mcq", "What does 'さようなら' mean?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                    ("fill_blank", "_____ (Thank you)", "ありがとう", ["ありがとう", "こんにちは", "はい", "いいえ"]),
                    ("mcq", "How do you say 'Yes'?", "はい", ["はい", "いいえ", "ありがとう", "こんにちは"]),
                    ("type_answer", "Translate: 'Good night'", "おやすみ", []),
                    ("mcq", "What does 'すみません' mean?", "Excuse me", ["Excuse me", "Thank you", "Hello", "Goodbye"]),
                ]]),
                ("Numbers", "🔢", [[
                    ("mcq", "What is 'いち' (ichi)?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'に' (ni)?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'five'", "ご", []),
                    ("fill_blank", "_____ (three)", "さん", ["さん", "し", "に", "いち"]),
                    ("translate", "Tap: 'ten'", "じゅう", ["じゅう", "く", "はち", "なな"]),
                    ("mcq", "What is 'じゅう'?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'hundred'", "ひゃく", []),
                ]]),
                ("Colors", "🎨", [[
                    ("mcq", "What is '赤' (aka)?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "青", []),
                    ("fill_blank", "_____ (green)", "緑", ["緑", "赤", "青", "黄"]),
                    ("mcq", "What is '黄' (ki)?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "白", ["白", "黒", "赤", "青"]),
                    ("type_answer", "Translate: 'black'", "黒", []),
                    ("mcq", "What is '紫' (murasaki)?", "purple", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Daily Life", "#CE82FF", [
                ("Food", "🍜", [[
                    ("mcq", "What is '水' (mizu)?", "water", ["water", "food", "rice", "tea"]),
                    ("type_answer", "Translate: 'rice'", "ご飯", []),
                    ("fill_blank", "_____ (tea)", "お茶", ["お茶", "水", "ご飯", "パン"]),
                    ("mcq", "What is 'パン' (pan)?", "bread", ["rice", "bread", "meat", "fish"]),
                    ("translate", "Tap: 'fish'", "魚", ["魚", "肉", "パン", "水"]),
                    ("type_answer", "Translate: 'delicious'", "おいしい", []),
                    ("mcq", "What is '肉' (niku)?", "meat", ["fish", "meat", "bread", "rice"]),
                ]]),
                ("Time", "⏰", [[
                    ("mcq", "What is '今日' (kyou)?", "today", ["today", "tomorrow", "yesterday", "now"]),
                    ("type_answer", "Translate: 'tomorrow'", "明日", []),
                    ("fill_blank", "_____ (yesterday)", "昨日", ["昨日", "今日", "明日", "今"]),
                    ("mcq", "What is '朝' (asa)?", "morning", ["morning", "afternoon", "evening", "night"]),
                    ("translate", "Tap: 'night'", "夜", ["夜", "朝", "昼", "今"]),
                    ("type_answer", "Translate: 'now'", "今", []),
                    ("mcq", "What is '週末' (shuumatsu)?", "weekend", ["weekday", "weekend", "holiday", "morning"]),
                ]]),
            ]),
        ],
    },
    "Kannada": {
        "flag": "🇮🇳",
        "units": [
            ("ಮೂಲಗಳು", "#58CC02", [
                ("ಶುಭಾಶಯಗಳು", "👋", [[
                    ("mcq", "What does 'ನಮಸ್ಕಾರ' (Namaskara) mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("type_answer", "Translate: 'Good morning'", "ಶುಭೋದಯ", []),
                    ("mcq", "What does 'ಧನ್ಯವಾದ' mean?", "Thank you", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("fill_blank", "_____ (Yes in Kannada)", "ಹೌದು", ["ಹೌದು", "ಇಲ್ಲ", "ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದ"]),
                    ("translate", "Tap: 'No' in Kannada", "ಇಲ್ಲ", ["ಇಲ್ಲ", "ಹೌದು", "ನಮಸ್ಕಾರ", "ಬನ್ನಿ"]),
                    ("mcq", "How do you say 'Come' in Kannada?", "ಬನ್ನಿ", ["ಹೋಗಿ", "ಬನ್ನಿ", "ಕುಳಿತುಕೊಳ್ಳಿ", "ನಿಲ್ಲಿ"]),
                    ("type_answer", "Translate: 'Goodbye'", "ಹೋಗಿ ಬನ್ನಿ", []),
                ]]),
                ("ಸಂಖ್ಯೆಗಳು", "🔢", [[
                    ("mcq", "What is 'ಒಂದು' (ondu)?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'ಎರಡು' (eradu)?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'three'", "ಮೂರು", []),
                    ("fill_blank", "_____ (four)", "ನಾಲ್ಕು", ["ನಾಲ್ಕು", "ಐದು", "ಆರು", "ಏಳು"]),
                    ("translate", "Tap: 'five'", "ಐದು", ["ಐದು", "ಆರು", "ಏಳು", "ಎಂಟು"]),
                    ("mcq", "What is 'ಹತ್ತು'?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'hundred'", "ನೂರು", []),
                ]]),
                ("ಬಣ್ಣಗಳು", "🎨", [[
                    ("mcq", "What is 'ಕೆಂಪು' (kempu)?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "ನೀಲಿ", []),
                    ("fill_blank", "_____ (green)", "ಹಸಿರು", ["ಹಸಿರು", "ಕೆಂಪು", "ನೀಲಿ", "ಹಳದಿ"]),
                    ("mcq", "What is 'ಹಳದಿ'?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "ಬಿಳಿ", ["ಬಿಳಿ", "ಕಪ್ಪು", "ಕೆಂಪು", "ನೀಲಿ"]),
                    ("type_answer", "Translate: 'black'", "ಕಪ್ಪು", []),
                    ("mcq", "What is 'ಕಿತ್ತಳೆ'?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("ಕುಟುಂಬ", "#CE82FF", [
                ("ಕುಟುಂಬ ಸದಸ್ಯರು", "👨👩👧", [[
                    ("mcq", "What is 'ಅಮ್ಮ' (amma)?", "mother", ["mother", "father", "sister", "brother"]),
                    ("type_answer", "Translate: 'father'", "ಅಪ್ಪ", []),
                    ("fill_blank", "_____ (sister)", "ಅಕ್ಕ", ["ಅಕ್ಕ", "ಅಣ್ಣ", "ಅಮ್ಮ", "ಅಪ್ಪ"]),
                    ("mcq", "What is 'ತಾತ'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                    ("translate", "Tap: 'brother'", "ಅಣ್ಣ", ["ಅಣ್ಣ", "ಅಕ್ಕ", "ಅಪ್ಪ", "ಅಮ್ಮ"]),
                    ("type_answer", "Translate: 'grandmother'", "ಅಜ್ಜಿ", []),
                    ("mcq", "What is 'ಚಿಕ್ಕಪ್ಪ'?", "uncle", ["uncle", "aunt", "cousin", "nephew"]),
                ]]),
            ]),
            ("ಪ್ರಯಾಣ", "#FF9600", [
                ("ಸ್ಥಳಗಳು", "🗺️", [[
                    ("mcq", "What is 'ವಿಮಾನ ನಿಲ್ದಾಣ'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                    ("type_answer", "Translate: 'school'", "ಶಾಲೆ", []),
                    ("fill_blank", "_____ (hospital)", "ಆಸ್ಪತ್ರೆ", ["ಆಸ್ಪತ್ರೆ", "ಶಾಲೆ", "ಅಂಗಡಿ", "ದೇವಸ್ಥಾನ"]),
                    ("mcq", "What is 'ಮಾರುಕಟ್ಟೆ'?", "market", ["market", "school", "hospital", "temple"]),
                    ("translate", "Tap: 'temple'", "ದೇವಸ್ಥಾನ", ["ದೇವಸ್ಥಾನ", "ಶಾಲೆ", "ಆಸ್ಪತ್ರೆ", "ಅಂಗಡಿ"]),
                    ("type_answer", "Translate: 'shop'", "ಅಂಗಡಿ", []),
                    ("mcq", "What is 'ನದಿ'?", "river", ["river", "mountain", "forest", "city"]),
                ]]),
            ]),
        ],
    },
    "Hindi": {
        "flag": "🇮🇳",
        "units": [
            ("Basics", "#58CC02", [
                ("Greetings", "👋", [[
                    ("mcq", "What does 'नमस्ते' (Namaste) mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("type_answer", "Translate: 'Good morning'", "सुप्रभात", []),
                    ("mcq", "What does 'धन्यवाद' mean?", "Thank you", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("fill_blank", "_____ (Yes in Hindi)", "हाँ", ["हाँ", "नहीं", "नमस्ते", "धन्यवाद"]),
                    ("translate", "Tap: 'No' in Hindi", "नहीं", ["नहीं", "हाँ", "नमस्ते", "ठीक है"]),
                    ("mcq", "How do you say 'Please' in Hindi?", "कृपया", ["धन्यवाद", "कृपया", "माफ़ करें", "नमस्ते"]),
                    ("type_answer", "Translate: 'Goodbye'", "अलविदा", []),
                ]]),
                ("Numbers", "🔢", [[
                    ("mcq", "What is 'एक' (ek)?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'दो' (do)?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'three'", "तीन", []),
                    ("fill_blank", "_____ (four)", "चार", ["चार", "पाँच", "छह", "सात"]),
                    ("translate", "Tap: 'five'", "पाँच", ["पाँच", "छह", "सात", "आठ"]),
                    ("mcq", "What is 'दस' (das)?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'hundred'", "सौ", []),
                ]]),
                ("Colors", "🎨", [[
                    ("mcq", "What is 'लाल' (laal)?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "नीला", []),
                    ("fill_blank", "_____ (green)", "हरा", ["हरा", "लाल", "नीला", "पीला"]),
                    ("mcq", "What is 'पीला' (peela)?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "सफ़ेद", ["सफ़ेद", "काला", "लाल", "नीला"]),
                    ("type_answer", "Translate: 'black'", "काला", []),
                    ("mcq", "What is 'नारंगी'?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Family", "#CE82FF", [
                ("Family Members", "👨‍👩‍👧", [[
                    ("mcq", "What is 'माँ' (maa)?", "mother", ["mother", "father", "sister", "brother"]),
                    ("type_answer", "Translate: 'father'", "पिता", []),
                    ("fill_blank", "_____ (sister)", "बहन", ["बहन", "भाई", "माँ", "पिता"]),
                    ("mcq", "What is 'दादा'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                    ("translate", "Tap: 'brother'", "भाई", ["भाई", "बहन", "पिता", "माँ"]),
                    ("type_answer", "Translate: 'grandmother'", "दादी", []),
                    ("mcq", "What is 'चाचा'?", "uncle", ["uncle", "aunt", "cousin", "nephew"]),
                ]]),
            ]),
            ("Travel", "#FF9600", [
                ("Places", "🗺️", [[
                    ("mcq", "What is 'हवाई अड्डा'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                    ("type_answer", "Translate: 'school'", "विद्यालय", []),
                    ("fill_blank", "_____ (hospital)", "अस्पताल", ["अस्पताल", "विद्यालय", "दुकान", "मंदिर"]),
                    ("mcq", "What is 'बाज़ार'?", "market", ["market", "school", "hospital", "temple"]),
                    ("translate", "Tap: 'temple'", "मंदिर", ["मंदिर", "विद्यालय", "अस्पताल", "दुकान"]),
                    ("type_answer", "Translate: 'shop'", "दुकान", []),
                    ("mcq", "What is 'नदी'?", "river", ["river", "mountain", "forest", "city"]),
                ]]),
            ]),
        ],
    },
    "German": {
        "flag": "🇩🇪",
        "units": [
            ("Grundlagen", "#58CC02", [
                ("Begrüßungen", "👋", [[
                    ("mcq", "What does 'Hallo' mean?", "Hello", ["Hello", "Goodbye", "Thank you", "Please"]),
                    ("type_answer", "Translate: 'Good morning'", "Guten Morgen", []),
                    ("mcq", "What does 'Auf Wiedersehen' mean?", "Goodbye", ["Hello", "Goodbye", "Yes", "No"]),
                    ("fill_blank", "_____ (Thank you)", "Danke", ["Danke", "Hallo", "Ja", "Nein"]),
                    ("translate", "Tap: 'Please'", "Bitte", ["Bitte", "Danke", "Hallo", "Tschüss"]),
                    ("mcq", "How do you say 'Yes'?", "Ja", ["Ja", "Nein", "Danke", "Hallo"]),
                    ("type_answer", "Translate: 'No'", "Nein", []),
                ]]),
                ("Zahlen", "🔢", [[
                    ("mcq", "What is 'eins'?", "1", ["1", "2", "3", "4"]),
                    ("mcq", "What is 'zwei'?", "2", ["1", "2", "3", "4"]),
                    ("type_answer", "Translate: 'five'", "fünf", []),
                    ("fill_blank", "_____ (three)", "drei", ["drei", "vier", "zwei", "eins"]),
                    ("translate", "Tap: 'ten'", "zehn", ["zehn", "neun", "acht", "sieben"]),
                    ("mcq", "What is 'zehn'?", "10", ["7", "8", "9", "10"]),
                    ("type_answer", "Translate: 'twenty'", "zwanzig", []),
                ]]),
                ("Farben", "🎨", [[
                    ("mcq", "What is 'rot'?", "red", ["red", "blue", "green", "yellow"]),
                    ("type_answer", "Translate: 'blue'", "blau", []),
                    ("fill_blank", "_____ (green)", "grün", ["grün", "rot", "blau", "gelb"]),
                    ("mcq", "What is 'gelb'?", "yellow", ["red", "blue", "green", "yellow"]),
                    ("translate", "Tap: 'white'", "weiß", ["weiß", "schwarz", "rot", "blau"]),
                    ("type_answer", "Translate: 'black'", "schwarz", []),
                    ("mcq", "What is 'orange'?", "orange", ["purple", "orange", "pink", "brown"]),
                ]]),
            ]),
            ("Familie", "#CE82FF", [
                ("Familienmitglieder", "👨‍👩‍👧", [[
                    ("mcq", "What is 'Mutter'?", "mother", ["mother", "father", "sister", "brother"]),
                    ("type_answer", "Translate: 'father'", "Vater", []),
                    ("fill_blank", "_____ (sister)", "Schwester", ["Schwester", "Bruder", "Mutter", "Vater"]),
                    ("mcq", "What is 'Großvater'?", "grandfather", ["grandmother", "grandfather", "uncle", "aunt"]),
                    ("translate", "Tap: 'son'", "Sohn", ["Sohn", "Tochter", "Vater", "Mutter"]),
                    ("type_answer", "Translate: 'daughter'", "Tochter", []),
                    ("mcq", "What is 'Onkel'?", "uncle", ["uncle", "aunt", "cousin", "nephew"]),
                ]]),
                ("Adjektive", "📝", [[
                    ("mcq", "What is 'groß'?", "big", ["big", "small", "tall", "short"]),
                    ("type_answer", "Translate: 'small'", "klein", []),
                    ("fill_blank", "_____ (tall)", "groß", ["groß", "klein", "dick", "dünn"]),
                    ("mcq", "What is 'jung'?", "young", ["old", "young", "new", "old"]),
                    ("translate", "Tap: 'beautiful'", "schön", ["schön", "hässlich", "groß", "klein"]),
                    ("type_answer", "Translate: 'happy'", "glücklich", []),
                    ("mcq", "What is 'traurig'?", "sad", ["happy", "sad", "angry", "tired"]),
                ]]),
            ]),
            ("Reisen", "#FF9600", [
                ("Orte", "🗺️", [[
                    ("mcq", "What is 'Flughafen'?", "airport", ["airport", "hotel", "restaurant", "museum"]),
                    ("type_answer", "Translate: 'hotel'", "Hotel", []),
                    ("fill_blank", "_____ (restaurant)", "Restaurant", ["Restaurant", "Hotel", "Museum", "Strand"]),
                    ("mcq", "What is 'Strand'?", "beach", ["mountain", "beach", "forest", "city"]),
                    ("translate", "Tap: 'museum'", "Museum", ["Museum", "Strand", "Hotel", "Flughafen"]),
                    ("type_answer", "Translate: 'train station'", "Bahnhof", []),
                    ("mcq", "What is 'Stadt'?", "city", ["village", "city", "town", "country"]),
                ]]),
                ("Transport", "🚌", [[
                    ("mcq", "What is 'Bus'?", "bus", ["bus", "train", "plane", "car"]),
                    ("type_answer", "Translate: 'train'", "Zug", []),
                    ("fill_blank", "_____ (taxi)", "Taxi", ["Taxi", "Zug", "Bus", "Flugzeug"]),
                    ("mcq", "What is 'Flugzeug'?", "plane", ["bus", "train", "plane", "boat"]),
                    ("translate", "Tap: 'car'", "Auto", ["Auto", "Zug", "Flugzeug", "Schiff"]),
                    ("type_answer", "Translate: 'bicycle'", "Fahrrad", []),
                    ("mcq", "What is 'Schiff'?", "boat", ["bus", "train", "plane", "boat"]),
                ]]),
            ]),
        ],
    },
}


def seed_course(db, lang_name, data):
    course = Course(language_name=lang_name, flag_emoji=data["flag"])
    db.add(course)
    db.flush()
    for u_idx, (u_title, u_color, skills_data) in enumerate(data["units"]):
        unit = Unit(course_id=course.id, order_index=u_idx, title=u_title, color_theme=u_color)
        db.add(unit)
        db.flush()
        for s_idx, (s_title, s_icon, lessons_data) in enumerate(skills_data):
            skill = Skill(unit_id=unit.id, order_index=s_idx, title=s_title,
                          icon_key=s_icon, total_levels=5)
            db.add(skill)
            db.flush()
            for l_idx, exercises_data in enumerate(lessons_data):
                lesson = Lesson(skill_id=skill.id, order_index=l_idx, xp_reward=10)
                db.add(lesson)
                db.flush()
                for e_idx, (e_type, prompt, correct, options) in enumerate(exercises_data):
                    db.add(Exercise(lesson_id=lesson.id, order_index=e_idx, type=e_type,
                                    prompt=prompt, correct_answer=correct,
                                    options_json=json.dumps(options)))
    return course


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(User).first():
        db.close()
        print("Already seeded.")
        return

    # Seed all courses
    courses = {}
    for lang, data in COURSES.items():
        courses[lang] = seed_course(db, lang, data)
    db.flush()

    # User — starts with NO active course (forces language selection)
    user = User(username="learner", active_course_id=None)
    db.add(user)
    db.flush()

    db.add(UserStats(user_id=user.id, xp_total=0, streak_count=0, longest_streak=0,
                     last_active_date=None, hearts=5, gems=500,
                     daily_goal_xp=50, daily_xp_today=0))

    # Achievements
    achievements = [
        ("first_lesson", "First Steps", "Complete your first lesson", "🎯"),
        ("streak_3", "On Fire!", "Maintain a 3-day streak", "🔥"),
        ("streak_7", "Week Warrior", "Maintain a 7-day streak", "🏆"),
        ("xp_100", "Century", "Earn 100 XP", "⭐"),
        ("xp_500", "XP Master", "Earn 500 XP", "💫"),
        ("perfect_lesson", "Flawless", "Complete a lesson without mistakes", "💎"),
        ("polyglot", "Polyglot", "Enroll in 2 or more languages", "🌍"),
    ]
    for key, title, desc, icon in achievements:
        db.add(Achievement(key=key, title=title, description=desc, icon_key=icon))

    # Leaderboard seed users
    for name, xp, avatar in [("Carlos", 850, "owl"), ("Maria", 720, "bear"),
                               ("Alex", 650, "fox"), ("Sofia", 580, "cat"),
                               ("James", 430, "dog"), ("Priya", 310, "owl")]:
        db.add(LeaderboardSeedUser(display_name=name, xp_total=xp, avatar_key=avatar))

    db.commit()
    db.close()
    print("Seeded successfully")


if __name__ == "__main__":
    seed()
