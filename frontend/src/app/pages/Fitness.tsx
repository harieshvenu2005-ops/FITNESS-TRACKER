import { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Activity, Plus, Timer, Flame, TrendingUp, Dumbbell, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import StepsInput from '../components/StepsInput';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function Fitness() {
  const { workouts, dailyStats, addWorkout, addSteps, calculateCalories, getTodayStats } = useHealth();
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStats = getTodayStats();
  const weeklyData = dailyStats.slice(0, 7).reverse();
  const calculatedCalories = workoutType && duration && steps ? calculateCalories(workoutType, parseInt(duration), parseInt(steps)) : 0;

  const handleAddWorkout = () => {
    if (workoutType && duration && steps && workoutDate) {
      const const_duration = parseInt(duration);
      const const_steps = parseInt(steps);
      const calories = calculateCalories(workoutType, const_duration, const_steps);
      
      const newWorkout = {
        id: Date.now().toString(),
        type: workoutType,
        duration: const_duration,
        calories: calories,
        steps: const_steps,
        date: workoutDate
      };
      addWorkout(newWorkout);
      toast.success('Workout logged!');
      handleCancelWorkout();
    }
  };

  const handleCancelWorkout = () => {
    setWorkoutType('');
    setDuration('');
    setSteps('');
    setWorkoutDate(new Date().toISOString().split('T')[0]);
    setIsAddingWorkout(false);
  };

  const workoutTypes = [
    'Running', 'Cycling', 'Swimming', 'Yoga', 'Weight Training',
    'HIIT', 'Walking', 'Pilates', 'Boxing', 'Dancing'
  ];

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalSteps = workouts.reduce((sum, w) => sum + w.steps, 0);
  const avgWorkoutDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Fitness Tracker</h1>
          <p className="text-gray-600 mt-1">Track your workouts and monitor your progress</p>
        </div>
        <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Add New Workout</DialogTitle>
                <button onClick={() => setIsAddingWorkout(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <DialogDescription>
                Log your workout details to track your fitness progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="type">Workout Type</Label>
                <Select value={workoutType} onValueChange={setWorkoutType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="1000"
                />
              </div>
              {calculatedCalories > 0 && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600">Calculated Calories</p>
                  <p className="text-2xl font-semibold text-orange-600">{calculatedCalories}</p>
                </div>
              )}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAddWorkout} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workout
                </Button>
                <Button onClick={handleCancelWorkout} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Steps</p>
                <p className="text-2xl font-semibold mt-1">{todayStats.steps.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Goal: 10,000</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Minutes</p>
                <p className="text-2xl font-semibold mt-1">{todayStats.activeMinutes}</p>
                <p className="text-xs text-gray-500 mt-1">Goal: 60 min</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calories Burned</p>
                <p className="text-2xl font-semibold mt-1">{todayStats.caloriesBurned}</p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-semibold mt-1">{totalWorkouts}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Steps Input Card */}
      <StepsInput 
        onAddSteps={addSteps}
        todaySteps={todayStats.steps}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Trend */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Steps Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#3b82f6" 
                  fillOpacity={1}
                  fill="url(#stepsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calories Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned Trend</CardTitle>
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
                  dataKey="caloriesBurned" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Minutes Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Active Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="activeMinutes" 
                stroke="#8b5cf6" 
                fillOpacity={1}
                fill="url(#activeGradient)"
                name="Active Minutes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workouts.slice(0, 10).map((workout) => (
              <div 
                key={workout.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{workout.type}</p>
                    <p className="text-sm text-gray-500">{workout.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{workout.duration} min</p>
                  <p className="text-sm text-gray-500">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Time Exercised</p>
            <p className="text-3xl font-semibold mt-2">{totalMinutes} min</p>
            <p className="text-sm text-gray-500 mt-1">Across {totalWorkouts} workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Avg Workout Duration</p>
            <p className="text-3xl font-semibold mt-2">{avgWorkoutDuration} min</p>
            <p className="text-sm text-gray-500 mt-1">Per session</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Calories</p>
            <p className="text-3xl font-semibold mt-2">{totalCaloriesBurned.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All time burned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}