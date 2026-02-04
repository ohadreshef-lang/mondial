import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Top10PsychicReaders.com - Our mission, methodology, and commitment to helping you find the best psychic reading services.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-purple-600">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">About Us</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Top10PsychicReaders</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Welcome to Top10PsychicReaders.com, your trusted guide to navigating the world of online
          psychic readings. We&apos;re dedicated to helping you find authentic, quality psychic services
          that meet your unique needs.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          With hundreds of psychic reading platforms available online, finding a trustworthy service
          can be overwhelming. Our mission is simple: to provide honest, thorough, and unbiased
          reviews that help you make informed decisions.
        </p>
        <p className="text-gray-600 mb-4">
          We believe everyone deserves access to quality spiritual guidance without the risk of
          scams or poor experiences. That&apos;s why we rigorously evaluate each platform we review.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Review Platforms</h2>
        <p className="text-gray-600 mb-4">
          Our review process is comprehensive and systematic. We evaluate each psychic reading
          platform based on five key criteria:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Psychic Quality</h3>
            <p className="text-gray-600 text-sm">
              We assess the vetting process, advisor qualifications, and overall reading accuracy
              based on user feedback and our own experiences.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Value</h3>
            <p className="text-gray-600 text-sm">
              We analyze pricing structures, introductory offers, and overall value for money
              compared to service quality.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading Variety</h3>
            <p className="text-gray-600 text-sm">
              We evaluate the range of reading types offered, from tarot and astrology to
              mediumship and specialized services.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Experience</h3>
            <p className="text-gray-600 text-sm">
              We test website and app usability, booking processes, and communication options
              across different devices.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Support</h3>
            <p className="text-gray-600 text-sm">
              We evaluate response times, helpfulness, refund policies, and satisfaction
              guarantees offered by each platform.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Commitment to You</h2>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li className="mb-2">
            <strong>Honesty First:</strong> We never let affiliate relationships influence our
            rankings or recommendations.
          </li>
          <li className="mb-2">
            <strong>Regular Updates:</strong> We continuously update our reviews to reflect
            current offerings and user experiences.
          </li>
          <li className="mb-2">
            <strong>Real Testing:</strong> Our team personally tests platforms before recommending
            them.
          </li>
          <li className="mb-2">
            <strong>User Feedback:</strong> We consider real user reviews and experiences in
            our evaluations.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Important Disclaimer</h2>
        <p className="text-gray-600 mb-4">
          We want to be clear: psychic readings are intended for entertainment and personal
          insight purposes. They should never replace professional medical, legal, financial,
          or mental health advice. Always consult qualified professionals for important life
          decisions.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          Have questions, suggestions, or feedback? We&apos;d love to hear from you:
        </p>
        <p className="text-gray-600 mb-4">
          Email: hello@top10psychicreaders.com
        </p>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mt-8">
          <p className="text-purple-900">
            Thank you for trusting Top10PsychicReaders.com as your guide to online psychic services.
            We&apos;re committed to helping you find the perfect advisor for your spiritual journey.
          </p>
        </div>
      </div>
    </div>
  );
}
