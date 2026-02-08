import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, event_types, topics } = body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate that at least one event type or topic is selected
    if ((!event_types || event_types.length === 0) && (!topics || topics.length === 0)) {
      return NextResponse.json(
        { error: 'Please select at least one event type or topic' },
        { status: 400 }
      );
    }

    const unsubscribeToken = generateUnsubscribeToken();

    // Insert into database
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          event_types: event_types || [],
          topics: topics || [],
          unsubscribe_token: unsubscribeToken,
          is_active: true,
        },
      ])
      .select();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
