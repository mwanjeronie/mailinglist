'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { EVENT_TYPES, TOPICS } from '@/lib/newsletter-config';

interface Subscriber {
  id: number;
  email: string;
  event_types: string[];
  topics: string[];
  created_at: string;
  is_active: boolean;
}

const allEventTypes = EVENT_TYPES;
const allTopics = TOPICS;

export function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Filter states
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/subscribers');

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}
