import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mwanje Ronnie — Events Newsletter",
  description:
    "Stay updated on tech events in Kampala and beyond. Subscribe to Mwanje Ronnie's events newsletter on Luma.",
  openGraph: {
    title: "Mwanje Ronnie — Events Newsletter",
    description:
      "Stay updated on tech events in Kampala and beyond. Subscribe to the events newsletter on Luma.",
    url: "https://maillist.winjo.xyz",
    siteName: "Mwanje Ronnie Events",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mwanje Ronnie — Events Newsletter",
    description: "Subscribe to stay updated on tech events in Kampala and beyond.",
  },
  alternates: {
    canonical: "https://maillist.winjo.xyz",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center space-y-10">

        {/* Avatar / Brand mark */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black select-none">
            R
          </div>
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
            Mwanje Ronnie
          </p>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Never miss a<br />
            <span className="text-violet-400">tech event.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
            Get curated event recommendations — meetups, hackathons, conferences,
            and more — straight to your inbox. Hosted on Luma.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <a
            href="https://luma.com/winjo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-base rounded-2xl transition-colors duration-150 shadow-lg shadow-violet-900/40"
          >
            Subscribe on Luma
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          <p className="text-xs text-gray-600">
            Free · Unsubscribe anytime · No spam
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* Feature list */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
          {[
            { emoji: "📅", label: "Curated events", sub: "Hand-picked tech happenings" },
            { emoji: "📍", label: "Kampala & beyond", sub: "Local first, global aware" },
            { emoji: "⚡", label: "Weekly digest", sub: "Always timely, never noisy" },
          ].map(({ emoji, label, sub }) => (
            <li key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{emoji}</span>
              <span className="font-semibold text-gray-200">{label}</span>
              <span className="text-gray-500 text-xs">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
