'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EVENT_TYPES = [
  { id: 'conference', label: 'Conferences' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'webinar', label: 'Webinars' },
  { id: 'networking', label: 'Networking Events' },
  { id: 'training', label: 'Training Programs' },
  { id: 'meetup', label: 'Meetups' },
];

const TOPICS = [
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'design', label: 'Design' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'startups', label: 'Startups' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'sustainability', label: 'Sustainability' },
];

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleEventType = (id: string) => {
    setEventTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          eventTypes,
          topics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to subscribe',
        });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Successfully subscribed! Check your email for confirmation.',
      });
      setEmail('');
      setEventTypes([]);
      setTopics([]);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Events Newsletter</CardTitle>
        <CardDescription>
          Stay updated on the events and topics you care about
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
              disabled={loading}
            />
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Event Types</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the types of events you'd like to hear about
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EVENT_TYPES.map((eventType) => (
                <div key={eventType.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`event-${eventType.id}`}
                    checked={eventTypes.includes(eventType.id)}
                    onCheckedChange={() => toggleEventType(eventType.id)}
                    disabled={loading}
                  />
                  <Label
                    htmlFor={`event-${eventType.id}`}
                    className="font-normal cursor-pointer"
                  >
                    {eventType.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Topics of Interest</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the topics you want to learn more about
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPICS.map((topic) => (
                <div key={topic.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`topic-${topic.id}`}
                    checked={topics.includes(topic.id)}
                    onCheckedChange={() => toggleTopic(topic.id)}
                    disabled={loading}
                  />
                  <Label
                    htmlFor={`topic-${topic.id}`}
                    className="font-normal cursor-pointer"
                  >
                    {topic.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-base py-6"
          >
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
