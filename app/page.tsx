import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events Mailing List — Closed',
  description:
    "This mailing list is now closed. Subscribe to Mwanje Ronnie's events newsletter on Luma.",
  openGraph: {
    title: 'Events Mailing List — Closed',
    description: "Subscribe to Mwanje Ronnie's events newsletter on Luma.",
    url: 'https://maillist.winjo.xyz',
    siteName: 'Mwanje Ronnie Events',
    type: 'website',
  },
  alternates: { canonical: 'https://maillist.winjo.xyz' },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-950 mb-4 text-balance leading-tight">
            Never Miss a Tech Event
          </h1>
          <p className="text-lg text-gray-600 text-balance">
            Get event recommendations tailored to your interests. Unsubscribe anytime.
          </p>
        </div>

        {/* Closed stamp */}
        <div className="relative flex flex-col items-center justify-center py-16 px-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Faint background watermark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span
              className="text-[10rem] font-black text-red-100 tracking-widest uppercase rotate-[-20deg] leading-none"
              style={{ letterSpacing: '0.15em' }}
            >
              CLOSED
            </span>
          </div>

          {/* Stamp badge */}
          <div
            className="relative z-10 border-[6px] border-red-600 rounded-2xl px-10 py-5 mb-6 rotate-[-8deg]"
            style={{ boxShadow: '0 0 0 2px rgba(220,38,38,0.15)', background: 'rgba(255,255,255,0.85)' }}
          >
            <span className="block text-5xl sm:text-6xl font-black text-red-600 uppercase tracking-[0.2em] leading-none">
              CLOSED
            </span>
          </div>

          {/* Message */}
          <p className="relative z-10 text-center text-gray-600 text-base max-w-sm mb-8">
            Registration for this mailing list is now closed. Thank you to everyone who signed up.
          </p>

          {/* Luma subscribe CTA */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-500">Still want to stay in the loop?</p>
            <a
              href="https://luma.com/winjo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-colors duration-150"
            >
              Subscribe on Luma
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            <a href="/admin" className="underline hover:text-gray-700">Admin Access</a>
          </p>
        </div>

      </div>
    </main>
  );
}
