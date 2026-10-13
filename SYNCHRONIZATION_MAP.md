# Fitness App Synchronization Map

## Data Flow Architecture

### 1. **HealthContext (Central Hub)**
- **Purpose**: Single source of truth for all health app data
- **State Management**: React Context API + localStorage
- **Location**: `src/app/contexts/HealthContext.tsx`

### 2. **Data Synchronization Points**

#### A. Steps Input → Dashboard → Daily Stats
```
User Input (StepsInput.tsx)
  ↓
addSteps(steps, date)
  ↓
HealthContext updates dailyStats
  ↓
localStorage sync (useEffect)
  ↓
Dashboard displays via getTodayStats()
  ↓
All pages see updated steps
```

#### B. Water Intake → Dashboard → Daily Stats
```
User Input (WaterIntake.tsx)
  ↓
addWater(water, date)
  ↓
HealthContext updates dailyStats
  ↓
localStorage sync (useEffect)
  ↓
Dashboard displays water progress
  ↓
Stats auto-sync across all pages
```

#### C. Workouts → Daily Stats (Auto-calculation)
```
User adds Workout (Fitness page)
  ↓
addWorkout(workout)
  ↓
Automatically updates:
  - dailyStats.caloriesBurned += calculated_calories
  - dailyStats.activeMinutes += workout.duration
  - dailyStats.steps += workout.steps
  ↓
localStorage sync
  ↓
Dashboard updates in real-time
```

#### D. Meals → Daily Stats (Auto-calculation)
```
User adds Meal (Diet page)
  ↓
addMeal(meal)
  ↓
Automatically updates:
  - dailyStats.caloriesIntake += meal.calories
  ↓
localStorage sync
  ↓
Diet page shows intake vs goal
  ↓
Dashboard nutrition updates
```

### 3. **Page-to-Page Sync Matrix**

| Page | Syncs From | Syncs To | Real-time |
|------|-----------|----------|-----------|
| Dashboard | Steps, Water, Workouts, Meals | All pages | ✅ Yes |
| Fitness | Workouts, Calories calc | Dashboard | ✅ Yes |
| Diet | Meals, Nutrition | Dashboard | ✅ Yes |
| Healthcare | Vitals, Appointments | Dashboard | ✅ Yes |
| Medications | Meds data | Settings | ✅ Yes |
| Messages | Chat messages | Message history | ✅ Yes |
| Recipes | Recipe data | Diet (add meal) | ✅ Yes |
| Analytics | All historical data | Trends/reports | ✅ Yes |
| Settings | All data export/import | Global state | ✅ Yes |

### 4. **Automatic Calculations**

#### Calories Burned (Workouts)
```javascript
calories = (baseCaloriesPerMinute[type] × duration) + (steps × 0.04)
// Updates dailyStats.caloriesBurned automatically
```

#### Active Minutes
```javascript
activeMinutes += workout.duration
// Updated automatically when workout added
```

#### Water Progress
```javascript
waterProgress = (todayWater / 3.0) × 100
// Visual indicator shows hydration goal
```

### 5. **localStorage Sync Strategy**

**Keys Structure** (with user ID prefix):
```
{userId}_healthtracker_workouts
{userId}_healthtracker_meals
{userId}_healthtracker_health_metrics
{userId}_healthtracker_appointments
{userId}_healthtracker_medications
{userId}_healthtracker_messages
{userId}_healthtracker_recipes
{userId}_healthtracker_daily_stats
```

**Auto-save on change:**
```javascript
useEffect(() => {
  saveToStorage(prefixed(STORAGE_KEYS.WORKOUTS, currentPrefix), workouts);
}, [workouts, currentPrefix]);
// Similar for all other data types
```

### 6. **Date Synchronization**

- **Today's Date**: `new Date().toISOString().split('T')[0]` (YYYY-MM-DD)
- **getTodayStats()**: Returns stats for current date or creates new if missing
- **Filter by Date**: All pages use dynamic date filtering
- **No Hardcoded Dates**: All dates use `today` variable

### 7. **Real-time Update Flow**

```
User Action (Input)
  ↓
Handler Function (e.g., handleAddSteps)
  ↓
Context Method (addSteps)
  ↓
State Update (setDailyStats)
  ↓
localStorage Save (useEffect)
  ↓
Component Re-render
  ↓
All consuming pages updated
```

### 8. **Context Methods Used**

| Method | Purpose | Pages Using |
|--------|---------|-------------|
| `addWorkout()` | Log workout + calc calories | Fitness |
| `addMeal()` | Log meal + calc intake | Diet, Recipes |
| `addSteps()` | Log daily steps | Fitness (via StepsInput) |
| `addWater()` | Log water intake | Dashboard (via WaterIntake) |
| `addHealthMetric()` | Record vitals | Healthcare |
| `addAppointment()` | Schedule appointment | Healthcare |
| `addMedication()` | Add medication | Medications |
| `addRecipe()` | Create recipe | Recipes |
| `sendMessage()` | Send doctor message | Messages |
| `updateDailyStats()` | Manual stats update | All (if needed) |
| `getTodayStats()` | Get today's data | All pages |
| `calculateCalories()` | Auto-calc calories | Fitness |

### 9. **Verified Synchronization Points**

✅ Dashboard displays steps from StepsInput
✅ Dashboard displays water from WaterIntake
✅ Fitness page workouts sync to Dashboard calories burned
✅ Diet page meals sync to Dashboard calories intake
✅ Healthcare metrics sync to Dashboard vitals
✅ Daily stats persist in localStorage
✅ Data syncs on user change
✅ Dates use today's date dynamically
✅ Calculations trigger automatically
✅ All pages show consistent data

### 10. **Cross-Component Communication Example**

**User logs 5000 steps in Dashboard → StepsInput:**
```
1. User enters 5000 in StepsInput dialog
2. onClick: onAddSteps(5000, today)
3. Dashboard handler: addSteps(5000, today)
4. HealthContext: updates dailyStats[today].steps += 5000
5. useEffect watches dailyStats: saves to localStorage
6. Fitness page reads from context: dailyStats updated
7. Analytics page sees: historical data updated
8. All pages using getTodayStats(): get new value
9. UI re-renders with new step count
```

## Synchronization Verification Checklist

- [x] HealthContext exports all required methods
- [x] All pages destructure correct methods from useHealth()
- [x] No hardcoded dates in current date calculations
- [x] localStorage useEffect hooks on all data types
- [x] Daily stats auto-update on workout/meal addition
- [x] Calculations (calories, active minutes) trigger automatically
- [x] Water intake syncs across pages
- [x] Today's date uses getTodayStats() dynamically
- [x] Dashboard shows real-time updates
- [x] Cancel/clear buttons reset forms properly

## Testing Real-time Sync

### Quick Test:
1. Open Dashboard
2. Open Fitness in another view
3. Log steps in Dashboard
4. Check Fitness page shows updated steps
5. Verify calories burned auto-calculated
6. Check daily stats in Analytics

### Cross-page Test:
1. Open Dashboard
2. Log workout on Fitness page
3. Verify Dashboard shows calories burned
4. Check active minutes updated
5. Verify daily stats synced

All synchronization is fully functional! ✅
