import { useState, useEffect } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MessageSquare, Send, Video, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Messages() {
  const { messages, sendMessage } = useHealth();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'text' | 'video_call'>('text');

  // Mock doctors list - in real app, fetch from backend
  const doctors = [
    { id: 'doc1', name: 'Dr. Smith', specialty: 'General Medicine' },
    { id: 'doc2', name: 'Dr. Johnson', specialty: 'Cardiology' },
    { id: 'doc3', name: 'Dr. Williams', specialty: 'Nutrition' }
  ];

  const handleSend = () => {
    if (!selectedDoctor || !message.trim()) {
      toast.error('Please select a doctor and enter a message');
      return;
    }

    sendMessage({
      fromUserId: user!.id,
      toUserId: selectedDoctor,
      content: message,
      type
    });

    handleClear();
    toast.success('Message sent successfully');
  };

  const handleClear = () => {
    setSelectedDoctor('');
    setMessage('');
    setType('text');
  };

  const userMessages = messages.filter(m => m.fromUserId === user!.id || m.toUserId === user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Doctor Communication</h1>
        <p className="text-muted-foreground">Chat with your healthcare providers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Communicate with your doctor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Message Type</Label>
              <Select value={type} onValueChange={(value: 'text' | 'video_call') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="video_call">Video Call Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
            <Button onClick={handleSend} className="w-full gap-2">
              {type === 'video_call' ? <Video className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {type === 'video_call' ? 'Request Video Call' : 'Send Message'}
            </Button>
            <Button onClick={handleClear} variant="outline" className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Clear Form
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>Your recent communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No messages yet</p>
              ) : (
                userMessages.slice(-10).reverse().map((msg) => {
                  const doctor = doctors.find(d => d.id === msg.toUserId || d.id === msg.fromUserId);
                  const isFromUser = msg.fromUserId === user!.id;
                  return (
                    <div key={msg.id} className={`p-3 rounded-lg ${isFromUser ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{doctor?.name || 'Doctor'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      {msg.type === 'video_call' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Video Call Request
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}