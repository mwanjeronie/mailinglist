// Easy configuration for event types and topics
// Edit these arrays to add or remove options throughout the app

export const EVENT_TYPES = [
  'Conferences',
  'Workshops',
  'Webinars',
  'Networking Events',
  'Summits',
  'Meetups',
] as const;

export const TOPICS = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Product',
  'Startups',
  'AI & ML',
  'Web Development',
] as const;

export type EventType = typeof EVENT_TYPES[number];
export type Topic = typeof TOPICS[number];
