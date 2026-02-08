'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('Invalid unsubscribe link');
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setMessage(data.error || 'Failed to unsubscribe');
          return;
        }

        setStatus('success');
        setMessage('You have been unsubscribed successfully.');
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred. Please try again later.');
        console.error('Unsubscribe error:', error);
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-950">Processing...</h1>
              <p className="text-gray-600">Unsubscribing you from our newsletter</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-950">Unsubscribed</h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                You won't receive any more event recommendations from us.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full mt-6 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-950">Oops!</h1>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="w-full mt-6 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}

          {status === 'invalid' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-950">Invalid Link</h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Please check that you have the correct unsubscribe link.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full mt-6 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
