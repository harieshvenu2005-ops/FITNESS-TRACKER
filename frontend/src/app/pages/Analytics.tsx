import { useMemo } from 'react';
import { useHealth } from '../contexts/HealthContext';

function calculateStreak(workouts: any[]): number {
  if (workouts.length === 0) return 0;
  
  const sortedByDate = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasWorkout = sortedByDate.some(w => w.date === dateStr);
    
    if (!hasWorkout) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Heart, Scale, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const { workouts, meals, healthMetrics, dailyStats } = useHealth();

  // Calculate insights
  const insights = useMemo(() => {
    const totalWorkouts = workouts.length;
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const avgHeartRate = healthMetrics
      .filter(m => m.type === 'heart_rate')
      .reduce((sum, m, _, arr) => sum + Number(m.value) / arr.length, 0);

    const weightTrend = healthMetrics
      .filter(m => m.type === 'weight')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    const weightChange = weightTrend.length >= 2 ?
      Number(weightTrend[weightTrend.length - 1].value) - Number(weightTrend[0].value) : 0;

    return {
      totalWorkouts,
      totalCalories,
      avgHeartRate: avgHeartRate.toFixed(1),
      weightChange: weightChange.toFixed(1),
      workoutStreak: calculateStreak(workouts),
      healthyDays: dailyStats.filter(d => d.steps >= 8000 && d.caloriesIntake <= 2200).length
    };
  }, [workouts, meals, healthMetrics, dailyStats]);

  // Prepare chart data
  const workoutData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayWorkouts = workouts.filter(w => w.date === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0)
      };
    });
  }, [workouts]);

  const nutritionData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayMeals = meals.filter(m => m.date === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
        carbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
        fats: dayMeals.reduce((sum, m) => sum + m.fats, 0)
      };
    });
  }, [meals]);

  const macroData = useMemo(() => {
    const total = meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { protein: 0, carbs: 0, fats: 0 });

    return [
      { name: 'Protein', value: total.protein, color: '#8884d8' },
      { name: 'Carbs', value: total.carbs, color: '#82ca9d' },
      { name: 'Fats', value: total.fats, color: '#ffc658' }
    ];
  }, [meals]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Analytics</h1>
        <p className="text-muted-foreground">Advanced insights into your health and fitness data</p>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{insights.totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Total Workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{insights.avgHeartRate}</p>
                <p className="text-xs text-muted-foreground">Avg Heart Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Scale className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{insights.weightChange}kg</p>
                <p className="text-xs text-muted-foreground">Weight Change (7d)</p>
                {Number(insights.weightChange) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Moon className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{insights.healthyDays}</p>
                <p className="text-xs text-muted-foreground">Healthy Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Workout Activity</CardTitle>
            <CardDescription>Workouts and calories burned over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
                <Bar dataKey="calories" fill="#82ca9d" name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Trends</CardTitle>
            <CardDescription>Daily calorie intake over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Macronutrient Distribution</CardTitle>
            <CardDescription>Overall macro breakdown from your meals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={insights.workoutStreak > 3 ? "default" : "secondary"}>
                Workout Streak: {insights.workoutStreak} days
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              {insights.workoutStreak > 3 && (
                <p className="text-green-600">🎉 Great job maintaining your workout streak!</p>
              )}
              {Number(insights.avgHeartRate) > 80 && (
                <p className="text-yellow-600">💡 Consider monitoring your heart rate during exercise.</p>
              )}
              {insights.healthyDays >= 5 && (
                <p className="text-green-600">🌟 You're having mostly healthy days this week!</p>
              )}
              {Number(insights.weightChange) > 1 && (
                <p className="text-orange-600">⚖️ Weight trending up - consider reviewing your nutrition.</p>
              )}
              {meals.length > 0 && meals.reduce((sum, m) => sum + m.calories, 0) / Math.max(meals.length, 1) > 2500 && (
                <p className="text-red-600">🍽️ High average daily calories - consider portion control.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}