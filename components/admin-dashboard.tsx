'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2, AlertCircle, Users, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { EVENT_TYPES, TOPICS } from '@/lib/mailinglist-config';

interface Subscriber {
  id: number;
  email: string;
  event_types: string[];
  topics: string[];
  created_at: string;
  is_active: boolean;
}

interface EventSubmission {
  id: number;
  submitter_email: string;
  submitter_name: string | null;
  event_name: string;
  event_type: string;
  topics: string[];
  event_date: string;
  event_time: string | null;
  description: string;
  location: string | null;
  event_url: string;
  organization: string | null;
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const allEventTypes = EVENT_TYPES;
const allTopics = TOPICS;

interface AdminDashboardProps {
  password: string;
}

export function AdminDashboard({ password }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'events'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [events, setEvents] = useState<EventSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventSubmission | null>(null);

  // Filter states
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/subscribers', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await response.json();
      setSubscribers(data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load subscribers. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load event submissions. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEventStatus = async (eventId: number, newStatus: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: eventId,
          status: newStatus,
          adminNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await fetchEvents();
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to update event status. Please try again.');
      console.error('Update error:', err);
    }
  };

  useEffect(() => {
    if (password) {
      if (activeTab === 'subscribers') {
        fetchSubscribers();
      } else {
        fetchEvents();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, activeTab]);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    // Status filter
    if (statusFilter === 'active' && !subscriber.is_active) return false;
    if (statusFilter === 'inactive' && subscriber.is_active) return false;

    // Event types filter
    if (selectedEventTypes.length > 0) {
      const hasSelectedType = selectedEventTypes.some((type) =>
        subscriber.event_types.includes(type)
      );
      if (!hasSelectedType) return false;
    }

    // Topics filter
    if (selectedTopics.length > 0) {
      const hasSelectedTopic = selectedTopics.some((topic) =>
        subscriber.topics.includes(topic)
      );
      if (!hasSelectedTopic) return false;
    }

    return true;
  });

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const csvData = convertToCSV(filteredSubscribers);
      downloadCSV(csvData);
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: Subscriber[]): string => {
    const headers = ['Email', 'Event Types', 'Topics', 'Subscribed Date', 'Status'];
    const rows = data.map((subscriber) => [
      subscriber.email,
      subscriber.event_types.join(';'),
      subscriber.topics.join(';'),
      new Date(subscriber.created_at).toLocaleDateString(),
      subscriber.is_active ? 'Active' : 'Inactive',
    ]);

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    element.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const pendingEventsCount = events.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Subscribers ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'events'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event Submissions ({events.length})
            {pendingEventsCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {pendingEventsCount} pending
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Event Types Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Event Types</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {EVENT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEventTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEventTypes([...selectedEventTypes, type]);
                      } else {
                        setSelectedEventTypes(selectedEventTypes.filter((t) => t !== type));
                      }
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Topics</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {TOPICS.map((topic) => (
                <label key={topic} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTopics([...selectedTopics, topic]);
                      } else {
                        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                      }
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">{topic}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || filteredSubscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export CSV ({filteredSubscribers.length})
              </>
            )}
          </button>

          {(selectedEventTypes.length > 0 || selectedTopics.length > 0) && (
            <button
              onClick={() => {
                setSelectedEventTypes([]);
                setSelectedTopics([]);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No subscribers found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Event Types
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Topics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber, idx) => (
                      <tr
                        key={subscriber.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {subscriber.event_types.map((type) => (
                              <span
                                key={type}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {subscriber.topics.map((topic) => (
                              <span
                                key={topic}
                                className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              subscriber.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {subscriber.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Event Submissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No event submissions yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {event.event_name}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleDateString()}
                            {event.event_time && ` at ${event.event_time}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {event.event_type}
                          </span>
                          {event.topics.map((topic) => (
                            <span
                              key={topic}
                              className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div>Submitted by: {event.submitter_name || event.submitter_email}</div>
                          {event.organization && <div>Org: {event.organization}</div>}
                          <div>Submitted: {new Date(event.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                          className="px-3 py-2 text-sm border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedEvent?.id === event.id ? 'Hide' : 'View'}
                        </button>
                        {event.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateEventStatus(event.id, 'approved')}
                              className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateEventStatus(event.id, 'rejected')}
                              className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {event.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateEventStatus(event.id, 'published')}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Mark Published
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedEvent?.id === event.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Full Details</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">Description:</span>
                            <p className="text-gray-700 mt-1">{event.description}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Event URL:</span>
                            <a 
                              href={event.event_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-2"
                            >
                              {event.event_url}
                            </a>
                          </div>
                          {event.image_url && (
                            <div>
                              <span className="font-medium text-gray-900">Image URL:</span>
                              <a 
                                href={event.image_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-2"
                              >
                                {event.image_url}
                              </a>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-900">Submitter Email:</span>
                            <span className="text-gray-700 ml-2">{event.submitter_email}</span>
                          </div>
                          {event.admin_notes && (
                            <div>
                              <span className="font-medium text-gray-900">Admin Notes:</span>
                              <p className="text-gray-700 mt-1">{event.admin_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
