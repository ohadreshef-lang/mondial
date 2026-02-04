import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Affiliate Disclosure for Top10PsychicReaders.com - Learn how we earn revenue and maintain editorial integrity.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-purple-600">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Affiliate Disclosure</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Affiliate Disclosure</h1>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> February 2026
        </p>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8">
          <p className="text-purple-900 font-medium">
            Top10PsychicReaders.com is a participant in various affiliate programs. This means we
            may earn commissions when you click certain links on our website and make purchases
            on third-party platforms.
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Make Money</h2>
        <p className="text-gray-600 mb-4">
          Top10PsychicReaders.com earns revenue through affiliate partnerships with psychic reading
          platforms. When you click on a link to a psychic service on our website and subsequently
          sign up or make a purchase, we may receive a commission from that platform.
        </p>
        <p className="text-gray-600 mb-4">
          This affiliate commission comes at no additional cost to you. The prices you see on
          partner websites are the same whether you arrive through our links or directly.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Editorial Integrity</h2>
        <p className="text-gray-600 mb-4">
          We want to be completely transparent: our affiliate relationships do NOT influence our
          rankings, reviews, or recommendations. Our editorial team independently evaluates each
          platform based on:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Quality of psychic advisors</li>
          <li>Pricing and value</li>
          <li>User experience</li>
          <li>Customer support</li>
          <li>Reading variety</li>
          <li>User reviews and feedback</li>
        </ul>
        <p className="text-gray-600 mb-4">
          We will never recommend a service we don&apos;t believe provides genuine value to our readers,
          regardless of the commission we might earn.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Identify Affiliate Links</h2>
        <p className="text-gray-600 mb-4">
          Links to psychic reading platforms throughout our website are typically affiliate links.
          These include:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>&quot;Visit Site&quot; buttons</li>
          <li>&quot;Claim Offer&quot; links</li>
          <li>Platform name links in reviews</li>
          <li>Links in comparison tables</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why We Use Affiliate Links</h2>
        <p className="text-gray-600 mb-4">
          Affiliate commissions help us:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Keep our website free for all visitors</li>
          <li>Invest time in thorough research and reviews</li>
          <li>Regularly update our content with accurate information</li>
          <li>Maintain and improve our website</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">FTC Compliance</h2>
        <p className="text-gray-600 mb-4">
          This disclosure is provided in accordance with the Federal Trade Commission&apos;s guidelines
          on endorsements and testimonials. We believe in full transparency and want our readers to
          make informed decisions.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your Support</h2>
        <p className="text-gray-600 mb-4">
          By using our affiliate links, you support our ability to provide free, high-quality
          content and reviews. We genuinely appreciate your support and are committed to
          maintaining your trust through honest, unbiased recommendations.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Questions?</h2>
        <p className="text-gray-600 mb-4">
          If you have any questions about our affiliate relationships or how we earn revenue,
          please don&apos;t hesitate to contact us at:
        </p>
        <p className="text-gray-600 mb-4">
          Email: partnerships@top10psychicreaders.com
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-600">
            We earn money through affiliate links, but this never affects our honest reviews and
            rankings. We only recommend services we genuinely believe in, and using our links
            costs you nothing extra while helping support our work.
          </p>
        </div>
      </div>
    </div>
  );
}
