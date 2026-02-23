import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      submitterEmail,
      submitterName,
      eventName,
      eventType,
      topics,
      eventDate,
      eventTime,
      description,
      location,
      eventUrl,
      organization,
      imageUrl,
    } = body;

    // Validate required fields
    if (!submitterEmail || !submitterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!eventName || eventName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }

    if (!eventType || eventType.trim().length === 0) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one topic' },
        { status: 400 }
      );
    }

    if (!eventDate) {
      return NextResponse.json(
        { error: 'Event date is required' },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Event description is required' },
        { status: 400 }
      );
    }

    if (!eventUrl || eventUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'Event URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(eventUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid event URL format' },
        { status: 400 }
      );
    }

    // Insert into event_submissions table
    const { error } = await supabase
      .from('event_submissions')
      .insert([
        {
          submitter_email: submitterEmail,
          submitter_name: submitterName || null,
          event_name: eventName,
          event_type: eventType,
          topics: topics,
          event_date: eventDate,
          event_time: eventTime || null,
          description: description,
          location: location || null,
          event_url: eventUrl,
          organization: organization || null,
          image_url: imageUrl || null,
          status: 'pending',
        },
      ]);

    if (error) {
      console.error('Event submission insertion error:', error);
      throw error;
    }

    return NextResponse.json(
      { message: 'Event submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event submission API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit event' },
      { status: 500 }
    );
  }
}
