import { useHealth } from '../contexts/HealthContext';
import { Activity, Flame, Footprints, TrendingUp, Droplet, Clock, Apple, Heart, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { get } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import StepsInput from '../components/StepsInput';
import WaterIntake from '../components/WaterIntake';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { dailyStats, workouts, meals, healthMetrics, appointments, addSteps, getTodayStats, addWater } = useHealth();
  const [serverMessage, setServerMessage] = useState<string|null>(null);

  const todayStats = getTodayStats();

  // Add water intake handler
  const handleAddWater = (water: number, date: string) => {
    addWater(water, date);
  };

  // Get today's meals using correct date
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === today);
  const weeklyData = dailyStats.slice(0, 7).reverse();
  const avgSteps = Math.round(weeklyData.reduce((sum, day) => sum + day.steps, 0) / (weeklyData.length || 1));
  const avgCalories = Math.round(weeklyData.reduce((sum, day) => sum + day.caloriesBurned, 0) / (weeklyData.length || 1));
  
  const totalNutrition = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const nutritionData = [
    { name: 'Protein', value: totalNutrition.protein, color: '#3b82f6' },
    { name: 'Carbs', value: totalNutrition.carbs, color: '#10b981' },
    { name: 'Fats', value: totalNutrition.fats, color: '#f59e0b' },
  ];

  // Recent health metrics
  const latestMetrics = healthMetrics.slice(0, 4);

  // Upcoming appointments
  const upcomingAppointments = appointments.slice(0, 2);

  // Ask backend for a hello message (dev only)
  useEffect(() => {
    get<{message:string}>('/hello')
      .then(r => setServerMessage(r.message))
      .catch(() => {});
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600 mt-1">Your complete health overview for today</p>
        {serverMessage && (
          <p className="mt-2 text-sm text-green-600">Backend says: {serverMessage}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Footprints}
          title="Steps Today"
          value={todayStats.steps.toLocaleString()}
          subtitle={`Avg: ${avgSteps.toLocaleString()} steps/day`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Flame}
          title="Calories Burned"
          value={todayStats.caloriesBurned}
          subtitle={`Avg: ${avgCalories} cal/day`}
          color="bg-orange-500"
        />
        <StatCard
          icon={Apple}
          title="Calories Intake"
          value={totalNutrition.calories}
          subtitle={`${todayMeals.length} meals logged`}
          color="bg-green-500"
        />
        <StatCard
          icon={Clock}
          title="Active Minutes"
          value={todayStats.activeMinutes}
          subtitle="Today's goal: 60 min"
          color="bg-purple-500"
        />
        <StatCard
          icon={Droplet}
          title="Water Intake"
          value={`${todayStats.water.toFixed(1)}L`}
          subtitle="Goal: 3L"
          color="bg-cyan-500"
        />
      </div>

      {/* Steps Input Card */}
      <StepsInput 
        onAddSteps={addSteps}
        todaySteps={todayStats.steps}
      />

      {/* Water Intake Card */}
      <WaterIntake
        onAddWater={handleAddWater}
        todayWater={todayStats.water}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} name="Steps" />
                <Line yAxisId="right" type="monotone" dataKey="caloriesBurned" stroke="#f59e0b" strokeWidth={2} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Nutrition Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Nutrition Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {nutritionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.value}g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workouts.slice(0, 7).reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="#8b5cf6" name="Duration (min)" />
              <Bar dataKey="calories" fill="#ec4899" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Health Summary & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Latest Health Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{metric.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">{metric.date} at {metric.time}</p>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    {metric.value}
                    {metric.type === 'heart_rate' && ' bpm'}
                    {metric.type === 'weight' && ' kg'}
                    {metric.type === 'sleep' && ' hrs'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{appointment.date}</p>
                      <p className="text-xs text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Intake & Active Minutes Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Hydration Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{todayStats.water}L</span>
                <span className="text-sm text-gray-500">Goal: 3L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((todayStats.water / 3) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {todayStats.water >= 3 ? 'Great job! Goal achieved!' : `${(3 - todayStats.water).toFixed(1)}L to go`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Steps Goal</span>
                <span className="text-sm font-medium">{avgSteps.toLocaleString()} / 10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${Math.min((avgSteps / 10000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Active Minutes</span>
                <span className="text-sm font-medium">{todayStats.activeMinutes} / 60 min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: `${Math.min((todayStats.activeMinutes / 60) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
