import { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pill, Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Medications() {
  const { medications, addMedication } = useHealth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addMedication({
      id: Date.now().toString(),
      ...formData
    });

    toast.success('Medication added successfully');
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-muted-foreground">Track your medications and dosages</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Medication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Medication Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Aspirin"
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 100mg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once daily">Once daily</SelectItem>
                      <SelectItem value="twice daily">Twice daily</SelectItem>
                      <SelectItem value="three times daily">Three times daily</SelectItem>
                      <SelectItem value="as needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {medications.map((med) => (
          <Card key={med.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Pill className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-semibold">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {med.dosage} - {med.frequency}
                  </p>
                  <p className="text-sm">
                    Started: {new Date(med.startDate).toLocaleDateString()}
                    {med.endDate && ` - Ends: ${new Date(med.endDate).toLocaleDateString()}`}
                  </p>
                  {med.notes && <p className="text-sm mt-1">{med.notes}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {medications.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No medications added yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}