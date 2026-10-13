import { useState } from 'react';
import { Plus, Footprints, X, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

interface StepsInputProps {
  onAddSteps: (steps: number, date: string) => void;
  onDeleteSteps?: (amount: number) => void;
  todaySteps: number;
}

export default function StepsInput({ onAddSteps, onDeleteSteps, todaySteps }: StepsInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddSteps = () => {
    if (steps && parseInt(steps) > 0) {
      onAddSteps(parseInt(steps), date);
      toast.success('Steps logged!');
      handleCancel();
    }
  };

  const handleCancel = () => {
    setSteps('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (todaySteps > 0) {
      onDeleteSteps?.(500); // Delete last 500 steps entry
      toast.success('Last steps entry removed');
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-blue-500" />
              Add Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-blue-600">{todaySteps.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Today's steps</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Log Steps</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Add your daily steps to track your activity
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g., 5000"
              min="0"
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
            <Button onClick={handleAddSteps} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Steps
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            {todaySteps > 0 && (
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
