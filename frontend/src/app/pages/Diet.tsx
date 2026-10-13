import { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Apple, Plus, Utensils, TrendingUp, Target, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

export default function Diet() {
  const { meals, dailyStats, addMeal } = useHealth();
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealTime, setMealTime] = useState(new Date().toTimeString().slice(0, 5));

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === today);
  const weeklyData = dailyStats.slice(0, 7).reverse();

  // Calculate today's totals
  const todayTotals = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  // Daily goals
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65
  };

  const handleAddMeal = () => {
    if (mealName && calories && protein && carbs && fats && mealDate && mealTime) {
      const newMeal = {
        id: Date.now().toString(),
        name: mealName,
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fats),
        time: mealTime,
        date: mealDate
      };
      addMeal(newMeal);
      toast.success('Meal logged!');
      handleCancelMeal();
    }
  };

  const handleCancelMeal = () => {
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setMealDate(new Date().toISOString().split('T')[0]);
    setMealTime(new Date().toTimeString().slice(0, 5));
    setIsAddingMeal(false);
  };

  const macroData = [
    { name: 'Protein', value: todayTotals.protein, color: '#3b82f6', goal: goals.protein },
    { name: 'Carbs', value: todayTotals.carbs, color: '#10b981', goal: goals.carbs },
    { name: 'Fats', value: todayTotals.fats, color: '#f59e0b', goal: goals.fats },
  ];

  const calorieProgress = (todayTotals.calories / goals.calories) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Diet & Nutrition</h1>
          <p className="text-gray-600 mt-1">Track your meals and monitor your nutrition</p>
        </div>
        <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Add New Meal</DialogTitle>
                <button onClick={() => setIsAddingMeal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <DialogDescription>
                Log your meal details to track your nutrition.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Grilled Chicken Salad"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="450"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="35"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    placeholder="18"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mealDate">Date</Label>
                  <Input
                    id="mealDate"
                    type="date"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mealTime">Time</Label>
                  <Input
                    id="mealTime"
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAddMeal} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
                <Button onClick={handleCancelMeal} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calorie Goal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Daily Calorie Goal</p>
              <p className="text-3xl font-semibold mt-1">
                {todayTotals.calories} / {goals.calories}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <Progress value={calorieProgress} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">
            {goals.calories - todayTotals.calories > 0
              ? `${goals.calories - todayTotals.calories} calories remaining`
              : 'Daily goal exceeded'}
          </p>
        </CardContent>
      </Card>

      {/* Macros Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macro Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {macroData.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.value}g / {item.goal}g</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macro Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Macro Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {macroData.map((macro) => (
                <div key={macro.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{macro.name}</span>
                    <span className="text-sm text-gray-500">
                      {macro.value}g / {macro.goal}g
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                        backgroundColor: macro.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Calorie Intake vs Burn</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="caloriesIntake" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Intake"
              />
              <Line 
                type="monotone" 
                dataKey="caloriesBurned" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Burned"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Meal Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Meal Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={todayMeals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" />
              <Bar dataKey="carbs" fill="#10b981" name="Carbs (g)" />
              <Bar dataKey="fats" fill="#f59e0b" name="Fats (g)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Today's Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayMeals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No meals logged today</p>
            ) : (
              todayMeals.map((meal) => (
                <div 
                  key={meal.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Apple className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{meal.calories} cal</p>
                    <p className="text-xs text-gray-500">
                      P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Meals</p>
            <p className="text-3xl font-semibold mt-2">{todayMeals.length}</p>
            <p className="text-sm text-gray-500 mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Avg Calories/Meal</p>
            <p className="text-3xl font-semibold mt-2">
              {todayMeals.length > 0 ? Math.round(todayTotals.calories / todayMeals.length) : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Per meal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Protein</p>
            <p className="text-3xl font-semibold mt-2">{todayTotals.protein}g</p>
            <p className="text-sm text-gray-500 mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Net Calories</p>
            <p className="text-3xl font-semibold mt-2">
              {todayTotals.calories - dailyStats[0]?.caloriesBurned || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Intake - Burned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}