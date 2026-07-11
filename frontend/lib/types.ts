export type SkillStatus = "locked" | "available" | "completed";

export interface Skill {
  id: number;
  title: string;
  icon_key: string;
  order_index: number;
  total_levels: number;
  crowns: number;
  status: SkillStatus;
}

export interface Unit {
  id: number;
  title: string;
  color_theme: string;
  order_index: number;
  skills: Skill[];
}

export interface PathData {
  course_id: number;
  units: Unit[];
}

export interface Exercise {
  id: number;
  order_index: number;
  type: "mcq" | "translate" | "match" | "fill_blank" | "type_answer";
  prompt: string;
  options_json: string;
}

export interface Lesson {
  id: number;
  skill_id: number;
  xp_reward: number;
  exercises: Exercise[];
}

export interface Attempt {
  id: number;
  lesson_id: number;
  status: "in_progress" | "completed" | "failed";
  current_exercise_index: number;
  xp_earned: number;
}

export interface AnswerResult {
  correct: boolean;
  correct_answer: string;
  hearts_remaining: number;
  xp_earned: number;
  attempt_status: string;
}

export interface Stats {
  xp_total: number;
  streak_count: number;
  longest_streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  daily_goal_xp: number;
  daily_xp_today: number;
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon_key: string;
  earned: boolean;
}

export interface Profile {
  username: string;
  stats: Stats;
  achievements: Achievement[];
  active_course_id: number | null;
}

export interface Course {
  id: number;
  language_name: string;
  flag_emoji: string;
  enrolled: boolean;
  xp_in_course: number;
}

export interface LeaderboardEntry {
  rank: number;
  display_name: string;
  xp_total: number;
  avatar_key: string;
  is_current_user: boolean;
}
