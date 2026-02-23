'use client';

import React from "react"

import { useState } from 'react';
import { Check, AlertCircle, Loader2, Calendar, MapPin, Link2, Building2 } from 'lucide-react';
import { EVENT_TYPES, TOPICS } from '@/lib/mailinglist-config';

export function EventSubmissionForm() {
  const [formData, setFormData] = useState({
    submitterEmail: '',
    submitterName: '',
    eventName: '',
    eventType: '',
    topics: [] as string[],
    eventDate: '',
    eventTime: '',
    description: '',
    location: '',
    eventUrl: '',
    organization: '',
    imageUrl: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTopicToggle = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.submitterEmail.trim() || !formData.eventName.trim() || 
        !formData.eventType || !formData.eventDate || !formData.description.trim() || 
        !formData.eventUrl.trim()) {
      setStatus('error');
      setMessage('Please fill in all required fields');
      return;
    }

    if (formData.topics.length === 0) {
      setStatus('error');
      setMessage('Please select at least one topic');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setMessage('Thank you! Your event has been submitted and will be reviewed shortly.');
      
      // Reset form
      setFormData({
        submitterEmail: '',
        submitterName: '',
        eventName: '',
        eventType: '',
        topics: [],
        eventDate: '',
        eventTime: '',
        description: '',
        location: '',
        eventUrl: '',
        organization: '',
        imageUrl: '',
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to submit event. Please try again.');
      console.error('Event submission error:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submitter Information */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-900 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, submitterEmail: e.target.value });
                    setStatus('idle');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={status === 'loading'}
                  required
                />
              </div>

              <div>
                <label htmlFor="submitterName" className="block text-sm font-medium text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="submitterName"
                  value={formData.submitterName}
                  onChange={(e) => {
                    setFormData({ ...formData, submitterName: e.target.value });
                    setStatus('idle');
                  }}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={status === 'loading'}
                />
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>

            {/* Event Name */}
            <div className="mb-4">
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-900 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="eventName"
                value={formData.eventName}
                onChange={(e) => {
                  setFormData({ ...formData, eventName: e.target.value });
                  setStatus('idle');
                }}
                placeholder="e.g., Tech Conference 2026"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
                required
              />
            </div>

            {/* Event Type */}
            <div className="mb-4">
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-900 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) => {
                  setFormData({ ...formData, eventType: e.target.value });
                  setStatus('idle');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
                required
              >
                <option value="">Select event type...</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Topics */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Topics <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicToggle(topic)}
                    disabled={status === 'loading'}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.topics.includes(topic)
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    <span className="flex items-center gap-2 justify-center">
                      {formData.topics.includes(topic) && <Check className="w-4 h-4" />}
                      {topic}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={formData.eventDate}
                  onChange={(e) => {
                    setFormData({ ...formData, eventDate: e.target.value });
                    setStatus('idle');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={status === 'loading'}
                  required
                />
              </div>

              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-900 mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  id="eventTime"
                  value={formData.eventTime}
                  onChange={(e) => {
                    setFormData({ ...formData, eventTime: e.target.value });
                    setStatus('idle');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  setStatus('idle');
                }}
                placeholder="e.g., San Francisco, CA or Virtual/Online"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
              />
            </div>

            {/* Event URL */}
            <div className="mb-4">
              <label htmlFor="eventUrl" className="block text-sm font-medium text-gray-900 mb-2">
                <Link2 className="w-4 h-4 inline mr-1" />
                Event URL / Registration Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="eventUrl"
                value={formData.eventUrl}
                onChange={(e) => {
                  setFormData({ ...formData, eventUrl: e.target.value });
                  setStatus('idle');
                }}
                placeholder="https://example.com/event"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
                required
              />
            </div>

            {/* Organization */}
            <div className="mb-4">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-900 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Organization / Host
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={(e) => {
                  setFormData({ ...formData, organization: e.target.value });
                  setStatus('idle');
                }}
                placeholder="e.g., Tech Corp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Event Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setStatus('idle');
                }}
                placeholder="Describe what your event is about, who should attend, and what attendees will gain..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                disabled={status === 'loading'}
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900 mb-2">
                Event Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setStatus('idle');
                }}
                placeholder="https://example.com/event-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                disabled={status === 'loading'}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Add a banner or logo image for your event
              </p>
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
                Submitting Event...
              </>
            ) : (
              'Submit Event for Review'
            )}
          </button>

          {/* Back Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <a href="/" className="text-sm font-medium text-gray-900 hover:text-gray-700 underline">
              ← Back to Mailing List
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
