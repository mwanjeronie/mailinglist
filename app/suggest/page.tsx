import { EventSubmissionForm } from '@/components/event-submission-form';

export const metadata = {
  title: 'Submit an Event',
  description: 'Submit your event to be featured in our weekly newsletter',
};

export default function SuggestPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4 text-balance">
            Submit Your Event
          </h1>
          <p className="text-lg text-gray-600 text-balance">
            Share your event with our community. We'll review it and include it in our weekly newsletter.
          </p>
        </div>

        {/* Form */}
        <EventSubmissionForm />
      </div>
    </main>
  );
}
