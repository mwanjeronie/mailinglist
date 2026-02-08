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
    const { email, type, name, description } = body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a name for your suggestion' },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== 'event-type' && type !== 'topic') {
      return NextResponse.json(
        { error: 'Invalid suggestion type' },
        { status: 400 }
      );
    }

    // Insert into appropriate table
    const tableName = type === 'event-type' ? 'event_type_suggestions' : 'topic_suggestions';
    const columnName = type === 'event-type' ? 'suggested_type' : 'suggested_topic';

    const { error } = await supabase
      .from(tableName)
      .insert([
        {
          email,
          [columnName]: name,
          description: description || null,
        },
      ]);

    if (error) {
      console.error(`Suggestion insertion error:`, error);
      throw error;
    }

    return NextResponse.json(
      { message: 'Suggestion submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    );
  }
}
