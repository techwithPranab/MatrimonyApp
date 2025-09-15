'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Send, 
  Check, 
  AlertCircle,
  Star,
  Zap
} from 'lucide-react';

interface SendInterestProps {
  readonly targetUserId: string;
  readonly targetUserName: string;
  readonly onInterestSent?: () => void;
}

export default function SendInterest({ 
  targetUserId, 
  targetUserName, 
  onInterestSent 
}: SendInterestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendInterest = async () => {
    try {
      setSending(true);
      setError('');

      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: targetUserId,
          message: message.trim() || undefined,
          priority,
        }),
      });

      if (response.ok) {
        setSent(true);
        setIsOpen(false);
        onInterestSent?.();
        setTimeout(() => setSent(false), 3000); // Reset after 3 seconds
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      setError('Failed to send interest');
    } finally {
      setSending(false);
    }
  };

  const predefinedMessages = [
    "Hi! I'd love to get to know you better. Your profile caught my attention!",
    "I find your profile very interesting. Would you like to connect?",
    "Hello! I think we might be a good match. I'd love to chat with you.",
    "Your profile shows we have a lot in common. I'd like to get to know you!",
  ];

  if (sent) {
    return (
      <Button disabled className="bg-green-600 text-white">
        <Check className="h-4 w-4 mr-2" />
        Interest Sent!
      </Button>
    );
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white"
      >
        <Heart className="h-4 w-4 mr-2" />
        Send Interest
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Send Interest to {targetUserName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Priority Selection */}
        <div>
          <div className="text-sm font-medium mb-2">Priority</div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={priority === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriority('normal')}
              className="flex items-center gap-1"
            >
              <Heart className="h-3 w-3" />
              Normal
            </Button>
            <Button
              type="button"
              variant={priority === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriority('high')}
              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
            >
              <Star className="h-3 w-3" />
              High Priority
            </Button>
          </div>
          {priority === 'high' && (
            <p className="text-xs text-gray-600 mt-1">
              High priority interests get noticed faster!
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="text-sm font-medium mb-2 block">
            Personal Message (Optional)
          </label>
          <Textarea
            id="message"
            placeholder="Write a personal message to stand out..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {message.length}/500 characters
            </span>
          </div>
        </div>

        {/* Quick Message Suggestions */}
        <div>
          <div className="text-sm font-medium mb-2">
            Quick Suggestions
          </div>
          <div className="space-y-1">
            {predefinedMessages.map((suggestion) => (
              <button
                key={suggestion.slice(0, 20)}
                type="button"
                onClick={() => setMessage(suggestion)}
                className="text-xs text-left p-2 rounded bg-gray-50 hover:bg-gray-100 w-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInterest}
            disabled={sending}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
          >
            {sending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Interest
              </>
            )}
          </Button>
        </div>

        {/* Feature Info */}
        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="h-3 w-3 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-800">Interest Features:</div>
              <ul className="mt-1 space-y-1">
                <li>• They&apos;ll get a notification about your interest</li>
                <li>• High priority interests are shown first</li>
                <li>• Personal messages increase response rates</li>
                <li>• You can send up to 10 interests per day</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
