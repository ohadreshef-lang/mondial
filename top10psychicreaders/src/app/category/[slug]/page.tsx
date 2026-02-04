import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getPlatformsByCategory, platforms } from '@/data/platforms';
import PlatformCard from '@/components/PlatformCard';
import FAQ from '@/components/FAQ';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

// Category-specific FAQs
const categoryFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  love: [
    {
      question: 'What can a love psychic help me with?',
      answer: 'Love psychics can provide guidance on current relationships, help you understand patterns in your love life, offer insights about potential partners, and give advice on improving communication with your significant other.',
    },
    {
      question: 'Are love readings accurate?',
      answer: 'Accuracy varies by advisor. Look for psychics with high ratings specifically for love readings and read reviews from other users who sought similar guidance. Many platforms offer satisfaction guarantees.',
    },
    {
      question: 'Can a psychic tell me if someone loves me?',
      answer: 'Psychics can often sense energy and intentions, providing insights into how someone feels about you. However, readings should be used as guidance rather than absolute predictions.',
    },
  ],
  tarot: [
    {
      question: 'How does an online tarot reading work?',
      answer: 'In online tarot readings, the reader shuffles and draws cards on your behalf while connecting with your energy. You can watch via video or receive descriptions through chat. The cards are then interpreted based on your questions.',
    },
    {
      question: 'What questions should I ask during a tarot reading?',
      answer: 'Open-ended questions work best. Instead of "Will I get the job?" try "What do I need to know about my career path?" This allows for more insightful and helpful guidance.',
    },
    {
      question: 'How often should I get a tarot reading?',
      answer: 'Most readers recommend waiting at least a month between readings on the same topic. For general guidance, quarterly readings are common. Avoid getting multiple readings on the same question in a short period.',
    },
  ],
  career: [
    {
      question: 'Can a psychic help with career decisions?',
      answer: 'Yes, career psychics can offer insights into your professional path, help identify hidden opportunities, provide guidance on timing for job changes, and reveal potential obstacles to prepare for.',
    },
    {
      question: 'What information should I share before a career reading?',
      answer: 'Share your current situation, specific concerns or questions, and what outcomes you hope for. Avoid sharing too many details initially, as a good psychic should pick up on key information.',
    },
    {
      question: 'Should I make major career decisions based on a psychic reading?',
      answer: 'Use readings as one input among many. Combine psychic insights with practical research, professional advice, and your own intuition when making major career decisions.',
    },
  ],
  astrology: [
    {
      question: 'What information do I need for an astrology reading?',
      answer: 'For an accurate birth chart reading, you need your exact birth date, time (as precise as possible), and location. The birth time is crucial for determining your rising sign and house placements.',
    },
    {
      question: 'What\'s the difference between sun sign horoscopes and birth chart readings?',
      answer: 'Sun sign horoscopes are general and based only on your birth date. Birth chart readings are personalized and consider the positions of all planets at your exact birth time and location.',
    },
    {
      question: 'How can astrology help me in daily life?',
      answer: 'Astrology can help you understand your strengths and challenges, identify favorable timing for decisions, improve relationships by understanding compatibility, and gain insight into recurring life patterns.',
    },
  ],
  mediumship: [
    {
      question: 'How does a mediumship reading work?',
      answer: 'Mediums connect with the energy of those who have passed to deliver messages. They may describe physical characteristics, personality traits, or specific memories to validate the connection.',
    },
    {
      question: 'Can I request contact with a specific person?',
      answer: 'You can set the intention, but mediums cannot guarantee contact with a specific spirit. Be open to receiving messages from whoever comes through, as it may not always be who you expect.',
    },
    {
      question: 'How should I prepare for a mediumship reading?',
      answer: 'Come with an open mind and heart. Have some photos or items belonging to the deceased nearby if it helps you feel connected. Avoid providing too much information upfront.',
    },
  ],
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryPlatforms = getPlatformsByCategory(category.id);
  const faqs = categoryFAQs[category.id] || [];

  // If no platforms match the category, show all platforms
  const displayPlatforms = categoryPlatforms.length > 0 ? categoryPlatforms : platforms;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-purple-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Best Psychics for {category.name}
            </h1>
            <p className="text-lg text-purple-100">{category.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AffiliateDisclosure />

        {/* Platform Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top {category.name} Psychics
          </h2>
          <div className="space-y-6">
            {displayPlatforms.map((platform, index) => (
              <PlatformCard
                key={platform.id}
                platform={{ ...platform, rank: index + 1 }}
                context={`category-${category.id}`}
                showRank={true}
              />
            ))}
          </div>
        </section>

        {/* About This Category */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {category.name} Readings
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">{category.description}</p>
              <p>
                Our recommended platforms have been carefully selected based on their expertise
                in {category.name.toLowerCase()}. Each platform offers vetted advisors who
                specialize in this type of reading, along with satisfaction guarantees to ensure
                you have a positive experience.
              </p>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What to Expect from a {category.name} Reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Connection</h3>
              <p className="text-gray-600 text-sm">
                Your advisor will take a moment to connect with your energy and may ask a few
                clarifying questions to focus the reading.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insights & Guidance</h3>
              <p className="text-gray-600 text-sm">
                Receive personalized insights related to your {category.name.toLowerCase()} questions,
                with specific guidance and potential outcomes.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Actionable Advice</h3>
              <p className="text-gray-600 text-sm">
                Leave with clear next steps and practical advice you can apply to your situation
                moving forward.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mb-16">
            <FAQ items={faqs} title={`${category.name} Reading FAQs`} />
          </section>
        )}

        {/* Other Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Reading Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter((c) => c.id !== category.id)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  <span className="text-2xl mr-3">{cat.icon}</span>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
