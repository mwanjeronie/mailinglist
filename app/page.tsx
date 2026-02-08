import { MailingListForm } from '@/components/mailinglist-form';

export const metadata = {
  title: 'Events Mailing List',
  description: 'Subscribe to our mailing list and stay updated on events that interest you',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-950 mb-4 text-balance leading-tight">
            Never Miss an Event
          </h1>
          <p className="text-lg text-gray-600 text-balance">
            Get event recommendations tailored to your interests. Unsubscribe anytime.
          </p>
        </div>

        {/* Form */}
        <MailingListForm />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            We respect your privacy. <a href="/admin" className="underline hover:text-gray-700">Admin Access</a>
          </p>
        </div>
      </div>
    </main>
  );
}
