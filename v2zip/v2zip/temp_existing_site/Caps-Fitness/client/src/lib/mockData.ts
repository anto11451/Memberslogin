import { Exercise, WorkoutPlan, Recipe, UserProfile, StreakData, AdminData, DailyLog } from "./types";

export const exercises: Exercise[] = [
  // Chest
  {
    id: "c1",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    cues: ["Keep feet planted", "Arch back slightly", "Lower bar to mid-chest", "Drive up explosively"],
    instructions: "Lie on the bench with your eyes under the bar. Grip the bar slightly wider than shoulder-width. Unrack and lower the bar to your mid-chest. Press back up to the starting position.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },
  {
    id: "c2",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    cues: ["Set bench to 30-45 degrees", "Keep elbows at 45 degrees", "Full stretch at bottom"],
    instructions: "Sit on an incline bench with a dumbbell in each hand. Press the weights up until your arms are extended. Lower them back down with control.",
    secondaryMuscles: ["Front Delts", "Triceps"]
  },
  {
    id: "c3",
    name: "Cable Flyes",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=Iwe6AmxVf7o",
    cues: ["Slight bend in elbows", "Squeeze chest at peak", "Control the negative"],
    instructions: "Stand in the middle of a cable machine. Pull the handles together in front of your chest, squeezing the pecs. Return slowly.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c4",
    name: "Push Ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    cues: ["Core tight", "Elbows tucked", "Chest to floor"],
    instructions: "Start in a high plank position. Lower your body until your chest nearly touches the floor. Push back up.",
    secondaryMuscles: ["Triceps", "Core"]
  },
  {
    id: "c5",
    name: "Dips",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Dip Station",
    videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
    cues: ["Lean forward for chest", "Go to 90 degrees", "Don't flare elbows"],
    instructions: "Support yourself on parallel bars. Lower your body by bending your arms while leaning forward. Push back up.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },

  // Back
  {
    id: "b1",
    name: "Pull Up",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    cues: ["Engage lats", "Chest to bar", "Control the descent"],
    instructions: "Grab the bar with an overhand grip. Pull yourself up until your chin is over the bar. Lower back down fully.",
    secondaryMuscles: ["Biceps", "Forearms"]
  },
  {
    id: "b2",
    name: "Barbell Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=9efgcGunQ1o",
    cues: ["Hinge at hips", "Keep back straight", "Pull to lower chest"],
    instructions: "Bend over at the hips, keeping your back flat. Pull the barbell towards your lower chest/upper stomach. Lower it back down.",
    secondaryMuscles: ["Biceps", "Rear Delts"]
  },
  {
    id: "b3",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    cues: ["Lean back slightly", "Pull elbows down", "Squeeze lats"],
    instructions: "Sit at the lat pulldown machine. Grab the bar wide. Pull the bar down to your upper chest. Return slowly.",
    secondaryMuscles: ["Biceps"]
  },
  {
    id: "b4",
    name: "Single Arm Dumbbell Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Dumbbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=dFzUj75WD9k",
    cues: ["Keep back flat", "Pull towards hip", "Don't rotate torso"],
    instructions: "Place one knee and hand on a bench. Row the dumbbell up towards your hip with the free hand.",
    secondaryMuscles: ["Biceps", "Forearms"]
  },
  {
    id: "b5",
    name: "Face Pulls",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    cues: ["Pull to forehead", "External rotation", "Squeeze rear delts"],
    instructions: "Set a cable pulley to face height. Pull the rope towards your face, separating your hands.",
    secondaryMuscles: ["Rear Delts", "Rotator Cuff"]
  },

  // Legs
  {
    id: "l1",
    name: "Barbell Squat",
    muscleGroup: "Legs",
    difficulty: "Intermediate",
    equipment: "Barbell, Rack",
    videoUrl: "https://www.youtube.com/watch?v=ultWZbGWL54",
    cues: ["Chest up", "Knees out", "Hit parallel depth"],
    instructions: "Place bar on upper back. Squat down by sitting back and bending knees. Stand back up.",
    secondaryMuscles: ["Glutes", "Core"]
  },
  {
    id: "l2",
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM",
    cues: ["Hinge at hips", "Slight knee bend", "Feel hamstring stretch"],
    instructions: "Hold bar at hip level. Hinge hips back, lowering bar along legs. Return to standing by driving hips forward.",
    secondaryMuscles: ["Hamstrings", "Glutes", "Lower Back"]
  },
  {
    id: "l3",
    name: "Leg Press",
    muscleGroup: "Legs",
    difficulty: "Beginner",
    equipment: "Leg Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    cues: ["Feet shoulder width", "Don't lock knees", "Lower deep"],
    instructions: "Sit in the machine. Push the platform away. Lower it back down until your knees are near your chest.",
    secondaryMuscles: ["Quads", "Glutes"]
  },
  {
    id: "l4",
    name: "Bulgarian Split Squat",
    muscleGroup: "Legs",
    difficulty: "Advanced",
    equipment: "Dumbbells, Bench",
    videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    cues: ["Keep torso upright", "Knee tracks over toe", "Drive through front heel"],
    instructions: "Place one foot on a bench behind you. Squat down with the front leg. Push back up.",
    secondaryMuscles: ["Quads", "Glutes"]
  },
  {
    id: "l5",
    name: "Calf Raises",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Machine or Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=-M4-G8p8fmc",
    cues: ["Full stretch at bottom", "Squeeze at top", "Control tempo"],
    instructions: "Stand on the edge of a step. Lower heels down, then raise up onto toes.",
    secondaryMuscles: []
  },

  // Shoulders
  {
    id: "s1",
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=QAQ64hK4Xxs",
    cues: ["Core tight", "Head through window", "Don't arch back"],
    instructions: "Press the barbell from your shoulders to overhead. Lock out at the top.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "s2",
    name: "Lateral Raises",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
    cues: ["Lead with elbows", "Pinkies up", "Don't swing"],
    instructions: "Raise dumbbells to the side until arms are parallel to floor. Lower slowly.",
    secondaryMuscles: ["Traps"]
  },

  // Arms
  {
    id: "a1",
    name: "Barbell Curl",
    muscleGroup: "Arms",
    difficulty: "Beginner",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    cues: ["Elbows tucked", "No swinging", "Squeeze at top"],
    instructions: "Curl the barbell up towards your chest. Lower slowly.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "a2",
    name: "Tricep Pushdown",
    muscleGroup: "Arms",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
    cues: ["Elbows fixed", "Full extension", "Squeeze triceps"],
    instructions: "Push the cable attachment down until arms are straight. Return to 90 degrees.",
    secondaryMuscles: []
  },
];

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    title: "Beginner Full Body",
    daysPerWeek: 3,
    level: "Beginner",
    description: "Perfect for starting your journey. Hits every muscle group 3x a week.",
    duration: "45-60 min",
    schedule: [
      { day: "Monday", focus: "Full Body A", exercises: ["Squat", "Bench Press", "Row"] },
      { day: "Wednesday", focus: "Full Body B", exercises: ["Deadlift", "Overhead Press", "Pull Up"] },
      { day: "Friday", focus: "Full Body A", exercises: ["Squat", "Bench Press", "Row"] },
    ]
  },
  {
    id: "2",
    title: "Upper/Lower Split",
    daysPerWeek: 4,
    level: "Intermediate",
    description: "Focus on upper body one day, lower body the next.",
    duration: "60-75 min",
    schedule: [
      { day: "Monday", focus: "Upper Power", exercises: ["Bench Press", "Row", "OHP"] },
      { day: "Tuesday", focus: "Lower Power", exercises: ["Squat", "RDL", "Calves"] },
      { day: "Thursday", focus: "Upper Hypertrophy", exercises: ["Incline Press", "Pulldown", "Arms"] },
      { day: "Friday", focus: "Lower Hypertrophy", exercises: ["Leg Press", "Lunges", "Abs"] },
    ]
  },
  {
    id: "3",
    title: "Push Pull Legs",
    daysPerWeek: 6,
    level: "Advanced",
    description: "High volume split for maximum hypertrophy.",
    duration: "75-90 min",
    schedule: [
      { day: "Monday", focus: "Push", exercises: ["Bench", "OHP", "Triceps"] },
      { day: "Tuesday", focus: "Pull", exercises: ["Pullups", "Rows", "Biceps"] },
      { day: "Wednesday", focus: "Legs", exercises: ["Squat", "Lunges", "Calves"] },
      { day: "Thursday", focus: "Push", exercises: ["Incline", "Dips", "Lateral Raises"] },
      { day: "Friday", focus: "Pull", exercises: ["Pulldowns", "Face Pulls", "Hammer Curls"] },
      { day: "Saturday", focus: "Legs", exercises: ["Deadlift", "Leg Press", "Abs"] },
    ]
  },
  {
    id: "4",
    title: "HIIT Shred",
    daysPerWeek: 4,
    level: "Intermediate",
    description: "High intensity interval training for fat loss.",
    duration: "30-45 min"
  },
  {
    id: "5",
    title: "Home Workout",
    daysPerWeek: 3,
    level: "Beginner",
    description: "No equipment needed. Bodyweight mastery.",
    duration: "30-45 min"
  }
];

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "High Protein Chicken Stir Fry",
    calories: 450,
    protein: 45,
    carbs: 35,
    fats: 12,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    ingredients: ["200g Chicken Breast", "1 Cup Veggies", "1 tbsp Soy Sauce"],
    instructions: ["Cut chicken into cubes", "Stir fry with veggies", "Add sauce"],
    tags: ["High-protein", "Fat-loss friendly", "Non-veg"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "2",
    name: "Paneer Bhurji",
    calories: 380,
    protein: 22,
    carbs: 10,
    fats: 25,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    ingredients: ["200g Paneer", "Onion", "Tomato", "Spices"],
    instructions: ["Crumble paneer", "Saute onion and tomato", "Mix spices and paneer"],
    tags: ["Vegetarian", "High-protein", "Indian cuisine"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "3",
    name: "Protein Oats",
    calories: 350,
    protein: 25,
    carbs: 45,
    fats: 10,
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Oats", "Whey Protein", "Almond Milk", "Chia Seeds"],
    instructions: ["Mix oats and milk", "Add whey", "Top with seeds"],
    tags: ["Vegetarian", "Meal prep friendly", "Breakfast"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "4",
    name: "Chicken Tikka",
    calories: 320,
    protein: 40,
    carbs: 5,
    fats: 15,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chicken breast", "Yogurt", "Tikka masala"],
    instructions: ["Marinate chicken", "Grill or bake", "Serve with lemon"],
    tags: ["High-protein", "Fat-loss friendly", "Non-veg", "Indian cuisine"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "5",
    name: "Sprouts Chaat",
    calories: 200,
    protein: 15,
    carbs: 30,
    fats: 2,
    image: "https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Moong sprouts", "Onion", "Tomato", "Chaat masala"],
    instructions: ["Steam sprouts", "Mix veggies", "Add spices"],
    tags: ["Vegetarian", "Fat-loss friendly", "Indian cuisine", "Snack"],
    videoUrl: "https://youtube.com"
  }
];

export const mockProfile: UserProfile = {
  name: "Alex Runner",
  age: 28,
  gender: "Male",
  weight: 78,
  height: 180,
  goal: "Muscle Gain",
  activityLevel: "Moderate",
  experience: "Intermediate"
};

export const mockStreak: StreakData = {
  currentStreak: 12,
  longestStreak: 45,
  lastLogDate: new Date().toISOString(),
  history: [
    { date: "2023-10-20", workoutDone: true, dietDone: true },
    { date: "2023-10-21", workoutDone: true, dietDone: false },
    { date: "2023-10-22", workoutDone: true, dietDone: true },
  ]
};

// Mock data representing what would come from the Admin/Google Sheets backend
export const adminData: AdminData = {
  dailyTargets: {
    calories: 2800,
    protein: 200,
    carbs: 300,
    fats: 80
  },
  currentPlanId: "3", // Push Pull Legs
  nextSessionDate: new Date(Date.now() + 86400000).toISOString(),
  programStartDate: "2023-10-01",
  programEndDate: "2023-12-31",
  todaysWorkout: {
    focus: "Push (Chest & Triceps)",
    duration: "60 mins",
    exercises: [
      { id: "c1", name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { id: "s1", name: "Overhead Press", sets: 3, reps: "8-12", rest: "90s" },
      { id: "c2", name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s" },
      { id: "c3", name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s" },
      { id: "a2", name: "Tricep Pushdown", sets: 4, reps: "12-15", rest: "60s" },
    ]
  }
};

export const mockDailyLog: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  caloriesConsumed: 1450,
  proteinConsumed: 110,
  carbsConsumed: 150,
  fatsConsumed: 45,
  workoutCompleted: false
};
