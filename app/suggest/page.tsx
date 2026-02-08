import { SuggestionForm } from '@/components/suggestion-form';

export const metadata = {
  title: 'Suggest Event Type or Topic',
  description: 'Help us improve by suggesting new event types and topics',
};

export default function SuggestPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4 text-balance">
            Have a Great Idea?
          </h1>
          <p className="text-lg text-gray-600 text-balance">
            Help us grow our event types and topics. We'd love to hear your suggestions.
          </p>
        </div>

        {/* Form */}
        <SuggestionForm />
      </div>
    </main>
  );
}
