import { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Heart, Plus, Calendar, Activity, Thermometer, Scale, Moon, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export default function Healthcare() {
  const { healthMetrics, appointments, addHealthMetric, addAppointment } = useHealth();
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  
  // Metric form state
  const [metricType, setMetricType] = useState<'heart_rate' | 'blood_pressure' | 'weight' | 'sleep'>('heart_rate');
  const [metricValue, setMetricValue] = useState('');
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricTime, setMetricTime] = useState(new Date().toTimeString().slice(0, 5));
  
  // Appointment form state
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddMetric = () => {
    if (metricValue) {
      const newMetric = {
        id: Date.now().toString(),
        type: metricType,
        value: metricType === 'blood_pressure' ? metricValue : parseFloat(metricValue),
        date: metricDate,
        time: metricTime
      };
      addHealthMetric(newMetric);
      toast.success('Health metric recorded!');
      handleCancelMetric();
    }
  };

  const handleCancelMetric = () => {
    setMetricValue('');
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricTime(new Date().toTimeString().slice(0, 5));
    setIsAddingMetric(false);
  };

  const handleAddAppointment = () => {
    if (doctor && specialty && appointmentDate && appointmentTime) {
      const newAppointment = {
        id: Date.now().toString(),
        doctor,
        specialty,
        date: appointmentDate,
        time: appointmentTime,
        notes
      };
      addAppointment(newAppointment);
      toast.success('Appointment scheduled!');
      handleCancelAppointment();
    }
  };

  const handleCancelAppointment = () => {
    setDoctor('');
    setSpecialty('');
    setAppointmentDate('');
    setAppointmentTime('');
    setNotes('');
    setIsAddingAppointment(false);
  };

  // Filter metrics by type
  const heartRateData = healthMetrics
    .filter(m => m.type === 'heart_rate')
    .slice(0, 10)
    .reverse()
    .map(m => ({ value: m.value as number, date: m.date, time: m.time }));

  const weightData = healthMetrics
    .filter(m => m.type === 'weight')
    .slice(0, 10)
    .reverse()
    .map(m => ({ value: m.value as number, date: m.date }));

  const sleepData = healthMetrics
    .filter(m => m.type === 'sleep')
    .slice(0, 10)
    .reverse()
    .map(m => ({ value: m.value as number, date: m.date }));

  // Latest metrics
  const latestHeartRate = healthMetrics.find(m => m.type === 'heart_rate');
  const latestWeight = healthMetrics.find(m => m.type === 'weight');
  const latestSleep = healthMetrics.find(m => m.type === 'sleep');
  const latestBP = healthMetrics.find(m => m.type === 'blood_pressure');

  const specialties = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Nutritionist',
    'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Dentist'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Healthcare Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your health vitals and manage appointments</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingMetric} onOpenChange={setIsAddingMetric}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Vital
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Record Health Vital</DialogTitle>
                  <button onClick={() => setIsAddingMetric(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <DialogDescription>
                  Record your health metrics to track your wellness.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="metricType">Vital Type</Label>
                  <Select value={metricType} onValueChange={(value: any) => setMetricType(value)}>
                    <SelectTrigger id="metricType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heart_rate">Heart Rate</SelectItem>
                      <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="sleep">Sleep Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">
                    Value
                    {metricType === 'heart_rate' && ' (bpm)'}
                    {metricType === 'blood_pressure' && ' (e.g., 120/80)'}
                    {metricType === 'weight' && ' (kg)'}
                    {metricType === 'sleep' && ' (hours)'}
                  </Label>
                  <Input
                    id="value"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    placeholder={
                      metricType === 'blood_pressure' ? '120/80' :
                      metricType === 'heart_rate' ? '72' :
                      metricType === 'weight' ? '75.5' : '7.5'
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metricDate">Date</Label>
                    <Input
                      id="metricDate"
                      type="date"
                      value={metricDate}
                      onChange={(e) => setMetricDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metricTime">Time</Label>
                    <Input
                      id="metricTime"
                      type="time"
                      value={metricTime}
                      onChange={(e) => setMetricTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleAddMetric} className="flex-1 bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Vital
                  </Button>
                  <Button onClick={handleCancelMetric} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Schedule Appointment</DialogTitle>
                  <button onClick={() => setIsAddingAppointment(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <DialogDescription>
                  Schedule a medical appointment with your healthcare provider.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="doctor">Doctor Name</Label>
                  <Input
                    id="doctor"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any relevant notes..."
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleAddAppointment} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button onClick={handleCancelAppointment} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-2xl font-semibold mt-1">
                  {latestHeartRate ? `${latestHeartRate.value} bpm` : 'N/A'}
                </p>
                {latestHeartRate && (
                  <p className="text-xs text-gray-500 mt-1">{latestHeartRate.time}</p>
                )}
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <p className="text-2xl font-semibold mt-1">
                  {latestBP ? latestBP.value : 'N/A'}
                </p>
                {latestBP && (
                  <p className="text-xs text-gray-500 mt-1">{latestBP.time}</p>
                )}
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
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-2xl font-semibold mt-1">
                  {latestWeight ? `${latestWeight.value} kg` : 'N/A'}
                </p>
                {latestWeight && (
                  <p className="text-xs text-gray-500 mt-1">{latestWeight.date}</p>
                )}
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sleep</p>
                <p className="text-2xl font-semibold mt-1">
                  {latestSleep ? `${latestSleep.value} hrs` : 'N/A'}
                </p>
                {latestSleep && (
                  <p className="text-xs text-gray-500 mt-1">Last night</p>
                )}
              </div>
              <div className="p-3 rounded-full bg-indigo-500">
                <Moon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vital Trends */}
      <Tabs defaultValue="heart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heart">Heart Rate</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>

        <TabsContent value="heart">
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Heart Rate (bpm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[70, 80]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Duration Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[5, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Sleep (hours)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointments & Health Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No appointments scheduled</p>
              ) : (
                appointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Health Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              Recent Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthMetrics.slice(0, 8).map((metric) => (
                <div 
                  key={metric.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {metric.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {metric.date} at {metric.time}
                    </p>
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
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Heart Rate</p>
              <p className="text-3xl font-semibold mt-2 text-green-600">
                {heartRateData.length > 0
                  ? Math.round(heartRateData.reduce((sum, d) => sum + d.value, 0) / heartRateData.length)
                  : 0} bpm
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 10 readings</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Sleep</p>
              <p className="text-3xl font-semibold mt-2 text-blue-600">
                {sleepData.length > 0
                  ? (sleepData.reduce((sum, d) => sum + d.value, 0) / sleepData.length).toFixed(1)
                  : 0} hrs
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 10 days</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-3xl font-semibold mt-2 text-purple-600">
                {appointments.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Scheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}