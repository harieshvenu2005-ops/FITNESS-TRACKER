import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { get, post } from '@/utils/api';
import { useAuth } from './AuthContext';

export interface WorkoutSession {
  id: string;
  type: string;
  duration: number;
  calories: number;
  steps: number;
  date: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  date: string;
}

export interface HealthMetric {
  id: string;
  type: 'heart_rate' | 'blood_pressure' | 'weight' | 'sleep';
  value: number | string;
  date: string;
  time: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'video_call' | 'file';
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: string[];
}

export interface DailyStats {
  steps: number;
  caloriesBurned: number;
  caloriesIntake: number;
  activeMinutes: number;
  water: number;
  date: string;
}

interface HealthContextType {
  workouts: WorkoutSession[];
  meals: Meal[];
  healthMetrics: HealthMetric[];
  appointments: Appointment[];
  medications: Medication[];
  messages: Message[];
  recipes: Recipe[];
  dailyStats: DailyStats[];
  addWorkout: (workout: WorkoutSession) => void;
  addMeal: (meal: Meal) => void;
  addHealthMetric: (metric: HealthMetric) => void;
  addAppointment: (appointment: Appointment) => void;
  addMedication: (medication: Medication) => void;
  addRecipe: (recipe: Recipe) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateDailyStats: (stats: Partial<DailyStats>) => void;
  addSteps: (steps: number, date: string) => void;
  addWater: (water: number, date: string) => void;
  calculateCalories: (type: string, duration: number, steps: number) => number;
  getTodayStats: () => DailyStats;
  clearAllData: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WORKOUTS: 'healthtracker_workouts',
  MEALS: 'healthtracker_meals',
  HEALTH_METRICS: 'healthtracker_health_metrics',
  APPOINTMENTS: 'healthtracker_appointments',
  MEDICATIONS: 'healthtracker_medications',
  MESSAGES: 'healthtracker_messages',
  RECIPES: 'healthtracker_recipes',
  DAILY_STATS: 'healthtracker_daily_stats',
  INITIALIZED: 'healthtracker_initialized'
};

function prefixed(key: string, userId?: string) {
  return userId ? `${userId}_${key}` : key;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast with Broccoli',
    ingredients: ['Chicken breast', 'Broccoli', 'Olive oil', 'Garlic', 'Lemon', 'Sea salt', 'Pepper'],
    instructions: '1. Preheat grill to 375°F. 2. Season chicken with salt and pepper. 3. Grill chicken for 6-7 minutes per side. 4. Steam broccoli for 5 minutes. 5. Drizzle with garlic-infused olive oil.',
    calories: 350,
    protein: 45,
    carbs: 15,
    fats: 12,
    tags: ['high-protein', 'low-carb', 'quick', 'healthy']
  },
  {
    id: '2',
    name: 'Quinoa Buddha Bowl',
    ingredients: ['Quinoa', 'Chickpeas', 'Sweet potato', 'Kale', 'Tahini', 'Lemon juice', 'Olive oil'],
    instructions: '1. Cook quinoa according to package. 2. Roast sweet potato at 400°F for 20 minutes. 3. Sauté kale with olive oil. 4. Mix tahini with lemon juice. 5. Combine all in bowl and drizzle with dressing.',
    calories: 420,
    protein: 15,
    carbs: 52,
    fats: 18,
    tags: ['vegan', 'gluten-free', 'high-fiber', 'balanced']
  },
  {
    id: '3',
    name: 'Baked Salmon with Asparagus',
    ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Dill', 'Olive oil', 'Garlic'],
    instructions: '1. Preheat oven to 400°F. 2. Place salmon on baking sheet. 3. Arrange asparagus around salmon. 4. Drizzle with olive oil, add dill and garlic. 5. Bake for 15 minutes.',
    calories: 380,
    protein: 40,
    carbs: 12,
    fats: 20,
    tags: ['omega-3', 'high-protein', 'low-carb', 'heart-healthy']
  },
  {
    id: '4',
    name: 'Greek Salad with Feta',
    ingredients: ['Romaine lettuce', 'Tomatoes', 'Cucumber', 'Red onion', 'Kalamata olives', 'Feta cheese', 'Olive oil', 'Oregano'],
    instructions: '1. Chop lettuce, tomatoes, cucumber, and onion. 2. Combine in large bowl. 3. Add olives and crumbled feta. 4. Drizzle with olive oil. 5. Season with oregano and serve.',
    calories: 280,
    protein: 12,
    carbs: 18,
    fats: 19,
    tags: ['vegetarian', 'low-calorie', 'mediterranean', 'quick']
  },
  {
    id: '5',
    name: 'Protein Pancakes',
    ingredients: ['Egg whites', 'Protein powder', 'Oats', 'Banana', 'Greek yogurt', 'Vanilla extract'],
    instructions: '1. Blend egg whites, protein powder, oats, and banana. 2. Heat non-stick pan. 3. Pour batter and cook 2 minutes per side. 4. Top with Greek yogurt and berries.',
    calories: 320,
    protein: 32,
    carbs: 38,
    fats: 6,
    tags: ['high-protein', 'breakfast', 'easy', 'muscle-building']
  },
  {
    id: '6',
    name: 'Vegetable Stir-Fry with Tofu',
    ingredients: ['Firm tofu', 'Bell peppers', 'Broccoli', 'Carrots', 'Ginger', 'Soy sauce', 'Garlic', 'Sesame oil'],
    instructions: '1. Cut tofu into cubes and pan-fry until crispy. 2. Stir-fry vegetables in wok. 3. Add ginger and garlic. 4. Toss in tofu. 5. Add soy sauce and sesame oil. Serve over rice.',
    calories: 280,
    protein: 18,
    carbs: 24,
    fats: 14,
    tags: ['vegan', 'vegetarian', 'quick', 'asian-inspired']
  },
  {
    id: '7',
    name: 'Turkey Meatballs',
    ingredients: ['Ground turkey', 'Breadcrumbs', 'Egg', 'Parmesan', 'Garlic', 'Herbs', 'Marinara sauce'],
    instructions: '1. Mix ground turkey with breadcrumbs, egg, and seasonings. 2. Form into balls. 3. Bake at 375°F for 20 minutes. 4. Simmer in marinara sauce. 5. Serve with pasta or rice.',
    calories: 310,
    protein: 35,
    carbs: 18,
    fats: 10,
    tags: ['high-protein', 'lean-meat', 'italian', 'freezer-friendly']
  },
  {
    id: '8',
    name: 'Avocado Toast',
    ingredients: ['Whole wheat bread', 'Avocado', 'Eggs', 'Cherry tomatoes', 'Lemon', 'Sea salt', 'Red pepper flakes'],
    instructions: '1. Toast whole wheat bread. 2. Mash avocado with lemon juice and salt. 3. Spread on toast. 4. Top with fried or poached eggs. 5. Garnish with tomatoes and red pepper flakes.',
    calories: 340,
    protein: 14,
    carbs: 32,
    fats: 18,
    tags: ['vegetarian', 'quick', 'breakfast', 'healthy-fats']
  }
];

const mockWorkouts: WorkoutSession[] = [
  { id: '1', type: 'Running', duration: 30, calories: 300, steps: 3500, date: '2026-03-09' },
  { id: '2', type: 'Cycling', duration: 45, calories: 400, steps: 2000, date: '2026-03-08' },
  { id: '3', type: 'Yoga', duration: 60, calories: 150, steps: 1200, date: '2026-03-07' },
  { id: '4', type: 'Swimming', duration: 40, calories: 350, steps: 1500, date: '2026-03-06' },
  { id: '5', type: 'Weight Training', duration: 50, calories: 250, steps: 800, date: '2026-03-05' },
];

const mockMeals: Meal[] = [
  { id: '1', name: 'Oatmeal & Berries', calories: 320, protein: 12, carbs: 54, fats: 8, time: '08:00', date: '2026-03-09' },
  { id: '2', name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 25, fats: 18, time: '12:30', date: '2026-03-09' },
  { id: '3', name: 'Protein Shake', calories: 180, protein: 25, carbs: 15, fats: 3, time: '15:00', date: '2026-03-09' },
  { id: '4', name: 'Salmon & Vegetables', calories: 520, protein: 40, carbs: 32, fats: 22, time: '19:00', date: '2026-03-09' },
];

const mockHealthMetrics: HealthMetric[] = [
  { id: '1', type: 'heart_rate', value: 72, date: '2026-03-09', time: '08:00' },
  { id: '2', type: 'blood_pressure', value: '120/80', date: '2026-03-09', time: '08:05' },
  { id: '3', type: 'weight', value: 75.5, date: '2026-03-09', time: '07:30' },
  { id: '4', type: 'sleep', value: 7.5, date: '2026-03-09', time: '07:00' },
];

const mockAppointments: Appointment[] = [
  { id: '1', doctor: 'Dr. Sarah Johnson', specialty: 'General Physician', date: '2026-03-15', time: '10:00', notes: 'Annual checkup' },
  { id: '2', doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: '2026-03-20', time: '14:30', notes: 'Follow-up consultation' },
  { id: '3', doctor: 'Dr. Emily Roberts', specialty: 'Nutritionist', date: '2026-03-25', time: '11:00', notes: 'Diet plan review' },
];

const mockDailyStats: DailyStats[] = [
  { steps: 8500, caloriesBurned: 2200, caloriesIntake: 1850, activeMinutes: 45, water: 2.5, date: '2026-03-09' },
  { steps: 10200, caloriesBurned: 2400, caloriesIntake: 1920, activeMinutes: 60, water: 3.0, date: '2026-03-08' },
  { steps: 7800, caloriesBurned: 2100, caloriesIntake: 1780, activeMinutes: 40, water: 2.2, date: '2026-03-07' },
  { steps: 9500, caloriesBurned: 2300, caloriesIntake: 1950, activeMinutes: 55, water: 2.8, date: '2026-03-06' },
  { steps: 11000, caloriesBurned: 2500, caloriesIntake: 2100, activeMinutes: 70, water: 3.5, date: '2026-03-05' },
  { steps: 8200, caloriesBurned: 2150, caloriesIntake: 1820, activeMinutes: 42, water: 2.4, date: '2026-03-04' },
  { steps: 9800, caloriesBurned: 2350, caloriesIntake: 2000, activeMinutes: 58, water: 3.1, date: '2026-03-03' },
];

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function HealthProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentPrefix = user?.id;

  const [workouts, setWorkouts] = useState<WorkoutSession[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.WORKOUTS, currentPrefix), mockWorkouts)
  );
  const [meals, setMeals] = useState<Meal[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.MEALS, currentPrefix), mockMeals)
  );
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.HEALTH_METRICS, currentPrefix), mockHealthMetrics)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.APPOINTMENTS, currentPrefix), mockAppointments)
  );
  const [medications, setMedications] = useState<Medication[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.MEDICATIONS, currentPrefix), [])
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.MESSAGES, currentPrefix), [])
  );
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.RECIPES, currentPrefix), mockRecipes)
  );
  const [dailyStats, setDailyStats] = useState<DailyStats[]>(() =>
    loadFromStorage(prefixed(STORAGE_KEYS.DAILY_STATS, currentPrefix), mockDailyStats)
  );

  useEffect(() => {
    const prefix = currentPrefix;
    if (!prefix) {
      setWorkouts([]);
      setMeals([]);
      setHealthMetrics([]);
      setAppointments([]);
      setMedications([]);
      setMessages([]);
      setRecipes([]);
      setDailyStats([]);
      return;
    }

    setWorkouts(loadFromStorage(prefixed(STORAGE_KEYS.WORKOUTS, prefix), mockWorkouts));
    setMeals(loadFromStorage(prefixed(STORAGE_KEYS.MEALS, prefix), mockMeals));
    setHealthMetrics(loadFromStorage(prefixed(STORAGE_KEYS.HEALTH_METRICS, prefix), mockHealthMetrics));
    setAppointments(loadFromStorage(prefixed(STORAGE_KEYS.APPOINTMENTS, prefix), mockAppointments));
    setMedications(loadFromStorage(prefixed(STORAGE_KEYS.MEDICATIONS, prefix), []));
    setMessages(loadFromStorage(prefixed(STORAGE_KEYS.MESSAGES, prefix), []));
    setRecipes(loadFromStorage(prefixed(STORAGE_KEYS.RECIPES, prefix), []));
    setDailyStats(loadFromStorage(prefixed(STORAGE_KEYS.DAILY_STATS, prefix), mockDailyStats));

    const initialized = localStorage.getItem(prefixed(STORAGE_KEYS.INITIALIZED, prefix));
    if (!initialized) {
      saveToStorage(prefixed(STORAGE_KEYS.WORKOUTS, prefix), mockWorkouts);
      saveToStorage(prefixed(STORAGE_KEYS.MEALS, prefix), mockMeals);
      saveToStorage(prefixed(STORAGE_KEYS.HEALTH_METRICS, prefix), mockHealthMetrics);
      saveToStorage(prefixed(STORAGE_KEYS.APPOINTMENTS, prefix), mockAppointments);
      saveToStorage(prefixed(STORAGE_KEYS.DAILY_STATS, prefix), mockDailyStats);
      localStorage.setItem(prefixed(STORAGE_KEYS.INITIALIZED, prefix), 'true');
    }

    if (user?.id) {
      get(`/health?userId=${user.id}`)
        .then((entries: unknown) => {
          if (Array.isArray(entries) && entries.length) {
            const serverMetrics: HealthMetric[] = entries.map((e: any) => ({
              id: e.id,
              type: e.type as HealthMetric['type'],
              value: e.value,
              date: e.date,
              time: e.time || '00:00',
            }));
            setHealthMetrics(serverMetrics);
          }
        })
        .catch(() => {});
    }
  }, [user, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.WORKOUTS, currentPrefix), workouts);
  }, [workouts, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.MEALS, currentPrefix), meals);
  }, [meals, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.HEALTH_METRICS, currentPrefix), healthMetrics);
  }, [healthMetrics, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.APPOINTMENTS, currentPrefix), appointments);
  }, [appointments, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.MEDICATIONS, currentPrefix), medications);
  }, [medications, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.MESSAGES, currentPrefix), messages);
  }, [messages, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.RECIPES, currentPrefix), recipes);
  }, [recipes, currentPrefix]);

  useEffect(() => {
    saveToStorage(prefixed(STORAGE_KEYS.DAILY_STATS, currentPrefix), dailyStats);
  }, [dailyStats, currentPrefix]);

  // Calculate calories based on workout type, duration, and steps
  const calculateCalories = (type: string, duration: number, steps: number): number => {
    const baseCaloriesPerMinute: { [key: string]: number } = {
      'Running': 12,
      'Cycling': 8,
      'Swimming': 10,
      'Yoga': 3,
      'Weight Training': 6,
      'HIIT': 14,
      'Walking': 4,
      'Pilates': 5,
      'Boxing': 13,
      'Dancing': 7,
    };

    const caloriesFromDuration = (baseCaloriesPerMinute[type] || 5) * duration;
    const caloriesFromSteps = steps * 0.04; // ~0.04 calories per step
    return Math.round(caloriesFromDuration + caloriesFromSteps);
  };

  const addWorkout = (workout: WorkoutSession) => {
    setWorkouts(prev => [workout, ...prev]);
    
    // Auto-update daily stats
    setDailyStats(prev => {
      const dateIndex = prev.findIndex(s => s.date === workout.date);
      const updatedStats = dateIndex >= 0 ? [...prev] : [{ steps: 0, caloriesBurned: 0, caloriesIntake: 0, activeMinutes: 0, water: 0, date: workout.date }, ...prev];
      const targetIndex = dateIndex >= 0 ? dateIndex : 0;
      
      updatedStats[targetIndex] = {
        ...updatedStats[targetIndex],
        steps: (updatedStats[targetIndex].steps || 0) + workout.steps,
        caloriesBurned: (updatedStats[targetIndex].caloriesBurned || 0) + workout.calories,
        activeMinutes: (updatedStats[targetIndex].activeMinutes || 0) + workout.duration,
      };
      
      return updatedStats;
    });
    
    post('/health', {
      userId: user?.id || 'unknown',
      type: 'workout',
      value: workout.duration,
      date: workout.date,
      time: workout.date + 'T00:00'
    }).catch(() => {});
  };

  const addSteps = (steps: number, date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = date || today;
    
    setDailyStats(prev => {
      const dateIndex = prev.findIndex(s => s.date === targetDate);
      let updatedStats = dateIndex >= 0 ? [...prev] : [{ steps: 0, caloriesBurned: 0, caloriesIntake: 0, activeMinutes: 0, water: 0, date: targetDate }, ...prev];
      const targetIndex = dateIndex >= 0 ? dateIndex : 0;
      
      updatedStats[targetIndex] = {
        ...updatedStats[targetIndex],
        steps: (updatedStats[targetIndex].steps || 0) + steps,
        date: targetDate
      };
      
      return updatedStats;
    });
  };

  const addWater = (water: number, date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = date || today;
    
    setDailyStats(prev => {
      const dateIndex = prev.findIndex(s => s.date === targetDate);
      const updatedStats = dateIndex >= 0 ? [...prev] : [{ steps: 0, caloriesBurned: 0, caloriesIntake: 0, activeMinutes: 0, water: 0, date: targetDate }, ...prev];
      const targetIndex = dateIndex >= 0 ? dateIndex : 0;
      
      updatedStats[targetIndex] = {
        ...updatedStats[targetIndex],
        water: (updatedStats[targetIndex].water || 0) + water,
      };
      
      return updatedStats;
    });
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [meal, ...prev]);
    
    // Auto-update daily stats with meal calories
    setDailyStats(prev => {
      const dateIndex = prev.findIndex(s => s.date === meal.date);
      const updatedStats = dateIndex >= 0 ? [...prev] : [{ steps: 0, caloriesBurned: 0, caloriesIntake: 0, activeMinutes: 0, water: 0, date: meal.date }, ...prev];
      const targetIndex = dateIndex >= 0 ? dateIndex : 0;
      
      updatedStats[targetIndex] = {
        ...updatedStats[targetIndex],
        caloriesIntake: (updatedStats[targetIndex].caloriesIntake || 0) + meal.calories,
      };
      
      return updatedStats;
    });
    
    post('/health', {
      userId: user?.id || 'unknown',
      type: 'meal',
      value: meal.calories,
      date: meal.date,
      time: meal.time
    }).catch(() => {});
  };

  const addHealthMetric = (metric: HealthMetric) => {
    setHealthMetrics(prev => [metric, ...prev]);
    post('/health', {
      userId: user?.id || 'unknown',
      type: metric.type,
      value: metric.value,
      date: metric.date,
      time: metric.time
    }).catch(() => {});
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
  };

  const addMedication = (medication: Medication) => {
    setMedications(prev => [medication, ...prev]);
    post('/medications', medication).catch(() => {});
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [recipe, ...prev]);
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const fullMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, fullMessage]);
    post('/messages', message).catch(() => {});
  };

  const updateDailyStats = (stats: Partial<DailyStats>) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyStats(prev => {
      const todayIndex = prev.findIndex(s => s.date === today);
      let updated = [...prev];
      
      if (todayIndex >= 0) {
        updated[todayIndex] = { ...updated[todayIndex], ...stats, date: today };
      } else {
        updated = [{
          steps: 0,
          caloriesBurned: 0,
          caloriesIntake: 0,
          activeMinutes: 0,
          water: 0,
          date: today,
          ...stats
        }, ...prev];
      }
      
      return updated;
    });
  };

  const getTodayStats = (): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    return dailyStats.find(s => s.date === today) || {
      steps: 0,
      caloriesBurned: 0,
      caloriesIntake: 0,
      activeMinutes: 0,
      water: 0,
      date: today
    };
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      const prefix = currentPrefix;
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(prefixed(key, prefix));
      });
      setWorkouts([]);
      setMeals([]);
      setHealthMetrics([]);
      setAppointments([]);
      setMedications([]);
      setMessages([]);
      setRecipes([]);
      setDailyStats([]);
      window.location.reload();
    }
  };

  return (
    <HealthContext.Provider value={{
      workouts,
      meals,
      healthMetrics,
      appointments,
      medications,
      messages,
      recipes,
      dailyStats,
      addWorkout,
      addMeal,
      addHealthMetric,
      addAppointment,
      addMedication,
      addRecipe,
      sendMessage,
      updateDailyStats,
      addSteps,
      addWater,
      calculateCalories,
      getTodayStats,
      clearAllData
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider');
  }
  return context;
}