import { useState } from 'react';
import { Plus, Droplet, X, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

interface WaterIntakeProps {
  onAddWater: (water: number, date: string) => void;
  onDeleteWater?: (amount: number) => void;
  todayWater: number;
}

export default function WaterIntake({ onAddWater, onDeleteWater, todayWater }: WaterIntakeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [water, setWater] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddWater = () => {
    if (water && parseFloat(water) > 0) {
      onAddWater(parseFloat(water), date);
      toast.success('Water intake logged!');
      handleCancel();
    }
  };

  const handleCancel = () => {
    setWater('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (todayWater > 0) {
      onDeleteWater?.(0.5); // Delete last 0.5L entry
      toast.success('Last water entry removed');
      handleCancel();
    }
  };

  const waterGoal = 3.0; // 3 liters per day
  const waterProgress = (todayWater / waterGoal) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-cyan-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-cyan-600">{todayWater.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-2">L / {waterGoal}L today</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(waterProgress, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Log Water Intake</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Add your water intake to track your hydration
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="water">Water (Liters)</Label>
            <Input
              id="water"
              type="number"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="e.g., 0.5"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={handleAddWater} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Water
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            {todayWater > 0 && (
              <Button onClick={handleDelete} variant="destructive" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
