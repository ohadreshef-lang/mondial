import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { platforms, getPlatformBySlug } from '@/data/platforms';
import { getAffiliateLink } from '@/data/affiliate-links';
import RatingStars from '@/components/RatingStars';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import PlatformCard from '@/components/PlatformCard';

interface ReviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return platforms.map((platform) => ({
    slug: platform.slug,
  }));
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);

  if (!platform) {
    return {
      title: 'Platform Not Found',
    };
  }

  return {
    title: `${platform.name} Review 2026 - Honest Analysis & Rating`,
    description: `Read our in-depth ${platform.name} review. Learn about pricing, features, pros & cons, and whether it's right for you. Updated for 2026.`,
    openGraph: {
      title: `${platform.name} Review 2026`,
      description: `Honest ${platform.name} review with pricing, features, and expert analysis.`,
    },
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);

  if (!platform) {
    notFound();
  }

  const affiliateLink = getAffiliateLink(platform.id, 'review');
  const otherPlatforms = platforms.filter((p) => p.id !== platform.id).slice(0, 3);

  // Rating categories for breakdown
  const ratingCategories = [
    { label: 'Psychic Quality', value: platform.rating.psychicQuality },
    { label: 'Pricing', value: platform.rating.pricing },
    { label: 'Reading Variety', value: platform.rating.readingVariety },
    { label: 'User Experience', value: platform.rating.userExperience },
    { label: 'Customer Support', value: platform.rating.customerSupport },
  ];

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
            <Link href="/#rankings" className="text-gray-500 hover:text-purple-600">
              Reviews
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{platform.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                  #{platform.rank} Top Pick
                </span>
                {platform.satisfactionGuarantee && (
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Satisfaction Guarantee
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {platform.name} Review 2026
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <RatingStars rating={platform.rating.overall} size="lg" />
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">
                  {platform.advisorCount.toLocaleString()}+ Advisors
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">Since {platform.foundedYear}</span>
              </div>

              <p className="text-lg text-gray-600">{platform.description}</p>
            </header>

            <AffiliateDisclosure />

            {/* Special Offer Banner */}
            {platform.specialOffer.text && (
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 mb-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-purple-200 text-sm font-medium">Special Offer</span>
                    <p className="text-xl font-bold">{platform.specialOffer.text}</p>
                  </div>
                  <a
                    href={affiliateLink}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Claim Offer
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Pros & Cons */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {platform.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-900">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {platform.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-900">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-500 text-sm">Starting Price</span>
                    <p className="text-3xl font-bold text-purple-600">
                      ${platform.pricing.minPerMinute}/min
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Premium Advisors</span>
                    <p className="text-3xl font-bold text-gray-900">
                      Up to ${platform.pricing.maxPerMinute}/min
                    </p>
                  </div>
                </div>
                {platform.specialOffer.text && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-amber-700 font-medium">
                      New User Offer: {platform.specialOffer.text}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Communication</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Chat Readings', available: platform.features.chatReadings },
                  { label: 'Phone Readings', available: platform.features.phoneReadings },
                  { label: 'Video Readings', available: platform.features.videoReadings },
                  { label: 'Mobile App', available: platform.features.mobileApp },
                  { label: 'Email Readings', available: platform.features.emailReadings },
                  { label: 'Scheduling', available: platform.features.scheduling },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className={`flex items-center p-3 rounded-lg ${
                      feature.available ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    {feature.available ? (
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={feature.available ? 'text-green-900' : 'text-gray-500'}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reading Types */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Reading Types</h2>
              <div className="flex flex-wrap gap-2">
                {platform.readingTypes.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </section>

            {/* Full Review Content */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Review</h2>
              <div className="prose max-w-none">
                {platform.fullReview.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc pl-5 mb-4 space-y-1">
                        {items.map((item, i) => (
                          <li key={i} className="text-gray-600">
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-gray-600 mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </section>

            {/* Final CTA */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to try {platform.name}?
              </h3>
              <p className="text-gray-600 mb-4">
                {platform.specialOffer.text || 'Get started today and connect with a trusted psychic.'}
              </p>
              <a
                href={affiliateLink}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Visit {platform.name}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-8 lg:mt-0">
            <div className="sticky top-20 space-y-6">
              {/* Quick Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-bold text-purple-600">{platform.rating.overall}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Price</span>
                    <span className="font-bold">${platform.pricing.minPerMinute}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advisors</span>
                    <span className="font-bold">{platform.advisorCount.toLocaleString()}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-bold">{platform.foundedYear}</span>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Rating Breakdown */}
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Breakdown</h4>
                <div className="space-y-3">
                  {ratingCategories.map((cat) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{cat.label}</span>
                        <span className="font-medium">{cat.value}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(cat.value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={affiliateLink}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors mt-6"
                >
                  Visit {platform.name}
                </a>
              </div>

              {/* Other Platforms */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Also Consider</h3>
                <div className="space-y-4">
                  {otherPlatforms.map((other) => (
                    <Link
                      key={other.id}
                      href={`/review/${other.slug}`}
                      className="block p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{other.name}</span>
                        <RatingStars rating={other.rating.overall} size="sm" showNumber={false} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{other.bestFor}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* More Platforms */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Platforms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPlatforms.map((p) => (
              <PlatformCard key={p.id} platform={p} context="review" showRank={false} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
