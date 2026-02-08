'use client';

import React from "react"

import { useState } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { EVENT_TYPES, TOPICS } from '@/lib/newsletter-config';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleEventTypeChange = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    if (selectedEventTypes.length === 0) {
      setStatus('error');
      setMessage('Please select at least one event type');
      return;
    }

    if (selectedTopics.length === 0) {
      setStatus('error');
      setMessage('Please select at least one topic');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          event_types: selectedEventTypes,
          topics: selectedTopics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setMessage('Welcome aboard! Check your email to confirm.');
      setEmail('');
      setSelectedEventTypes([]);
      setSelectedTopics([]);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
      console.error('Subscribe error:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus('idle');
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              disabled={status === 'loading'}
            />
          </div>

          {/* Event Types Section */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Event Types You're Interested In
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleEventTypeChange(type)}
                  disabled={status === 'loading'}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedEventTypes.includes(type)
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center gap-2">
                    {selectedEventTypes.includes(type) && <Check className="w-4 h-4" />}
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics Section */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Topics You Want to Learn About
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicChange(topic)}
                  disabled={status === 'loading'}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center gap-2 justify-center">
                    {selectedTopics.includes(topic) && <Check className="w-4 h-4" />}
                    {topic}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe to Newsletter'
            )}
          </button>

          {/* Suggestion Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Missing an event type or topic?
            </p>
            <a
              href="/suggest"
              className="text-sm font-medium text-gray-900 hover:text-gray-700 underline"
            >
              Suggest one →
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
