import { platforms } from '@/data/platforms';
import { categories } from '@/data/categories';
import PlatformCard from '@/components/PlatformCard';
import ComparisonTable from '@/components/ComparisonTable';
import CategoryCard from '@/components/CategoryCard';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';

const homepageFAQs = [
  {
    question: 'Are online psychic readings accurate?',
    answer:
      'The accuracy of psychic readings varies by advisor and platform. We recommend choosing platforms with rigorous screening processes and reading user reviews before selecting an advisor. Many platforms offer satisfaction guarantees, allowing you to try services risk-free.',
  },
  {
    question: 'How much do psychic readings cost?',
    answer:
      'Prices typically range from $1.99 to $30+ per minute, depending on the platform and advisor experience. Most platforms offer introductory discounts, free minutes, or bonus credits for new users. Budget-friendly options are available on most major platforms.',
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Most reputable psychic platforms offer satisfaction guarantees. If you're not happy with your reading, you can typically request a refund or credit. Check each platform's specific refund policy before your reading.",
  },
  {
    question: "What's the difference between chat, phone, and video readings?",
    answer:
      'Chat readings allow text-based communication, offering privacy and the ability to save transcripts. Phone readings provide a more personal voice connection. Video readings offer face-to-face interaction and the ability to see tarot cards or other tools in real-time.',
  },
  {
    question: 'How do I know if a psychic is legitimate?',
    answer:
      "Look for platforms with thorough screening processes, read user reviews, and start with short sessions. Legitimate psychics won't ask for personal financial information or make unrealistic promises. Our top-rated platforms all vet their advisors.",
  },
  {
    question: 'What should I expect from my first reading?',
    answer:
      'Come with specific questions or areas of focus. Be open-minded but not overly revealing initially. A good psychic will guide the conversation and provide insights without needing excessive information from you. Most first readings are 10-20 minutes.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-purple-200 text-sm font-medium">
                Updated February 2026 - Independently Reviewed
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Top 10 Best{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                Psychic Reading
              </span>{' '}
              Sites for 2026
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Compare the most trusted online psychic platforms. Find accurate readers
              for love, career, and spiritual guidance.
            </p>

            {/* CTA */}
            <a
              href="#rankings"
              className="inline-flex items-center bg-white text-purple-700 font-semibold px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              View Top Psychics
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Affiliate Disclosure */}
        <AffiliateDisclosure />

        {/* Quick Comparison Table */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Quick Comparison
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ComparisonTable platforms={platforms} context="homepage" />
          </div>
        </section>

        {/* Detailed Rankings */}
        <section id="rankings" className="mb-16 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Top 5 Psychic Reading Sites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our expert team has reviewed and ranked the best online psychic platforms
              based on advisor quality, pricing, features, and user satisfaction.
            </p>
          </div>

          <div className="space-y-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                context="homepage"
                showRank={true}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Browse by Reading Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Looking for a specific type of guidance? Explore our top recommendations
              by category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <HowItWorks />
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <FAQ items={homepageFAQs} />
        </section>
      </div>
    </>
  );
}
