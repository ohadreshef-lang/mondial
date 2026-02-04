const steps = [
  {
    number: '01',
    title: 'Choose a Platform',
    description: 'Browse our top-rated psychic reading sites and compare features, prices, and reviews.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Select a Psychic',
    description: 'Read advisor profiles, check their specialties, and find someone who resonates with you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Pick Your Method',
    description: 'Choose how you want to connect - chat, phone call, or video reading based on your preference.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Get Your Reading',
    description: 'Connect with your chosen advisor and receive personalized guidance and insights.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-gray-50 rounded-2xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Getting a psychic reading online is simple. Follow these four easy steps to connect with a trusted advisor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector Line (desktop only) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-purple-200" />
            )}

            <div className="bg-white rounded-xl p-6 relative z-10 h-full">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
                {step.icon}
              </div>

              {/* Content */}
              <div className="text-purple-600 text-sm font-semibold mb-1">
                Step {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
