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
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 400 }
      );
    }

    // Find subscriber by token
    const { data: subscriber, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('unsubscribe_token', token)
      .single();

    if (selectError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscribe link' },
        { status: 404 }
      );
    }

    // Mark as inactive instead of deleting (soft delete)
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Unsubscribe update error:', updateError);
      throw updateError;
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
