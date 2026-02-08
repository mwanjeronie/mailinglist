import { NewsletterForm } from '@/components/newsletter-form';

export const metadata = {
  title: 'Events Newsletter',
  description: 'Subscribe to our newsletter and stay updated on events that interest you',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Never Miss an Event
          </h1>
          <p className="text-lg text-slate-600 text-balance">
            Get personalized event recommendations based on your interests
          </p>
        </div>
        <NewsletterForm />
      </div>
    </main>
  );
}
