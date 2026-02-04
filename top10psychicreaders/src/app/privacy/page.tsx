import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Top10PsychicReaders.com - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-purple-600">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> February 2026
        </p>

        <p className="text-gray-600 mb-6">
          Top10PsychicReaders.com (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Information You Provide</h3>
        <p className="text-gray-600 mb-4">
          We may collect information you voluntarily provide, including:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Contact information (if you reach out to us)</li>
          <li>Newsletter subscription information (if applicable)</li>
          <li>Any other information you choose to provide</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
        <p className="text-gray-600 mb-4">
          When you visit our website, we may automatically collect:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Device information (browser type, operating system)</li>
          <li>IP address</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Click data and browsing patterns</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">We use collected information to:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Improve and optimize our website</li>
          <li>Analyze usage patterns and trends</li>
          <li>Respond to inquiries and provide support</li>
          <li>Send newsletters or updates (with your consent)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Cookies and Tracking Technologies</h2>
        <p className="text-gray-600 mb-4">
          We use cookies and similar tracking technologies to enhance your experience. These include:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li><strong>Essential Cookies:</strong> Required for website functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
        </ul>
        <p className="text-gray-600 mb-4">
          You can control cookies through your browser settings. Note that disabling cookies may
          affect website functionality.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
        <p className="text-gray-600 mb-4">
          Our website may contain links to third-party websites and services. We are not responsible
          for the privacy practices of these external sites. We encourage you to review their privacy
          policies.
        </p>
        <p className="text-gray-600 mb-4">
          We may use third-party services for:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Analytics (e.g., Google Analytics)</li>
          <li>Advertising and affiliate tracking</li>
          <li>Hosting and content delivery</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
        <p className="text-gray-600 mb-4">
          We implement reasonable security measures to protect your information. However, no method
          of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
        <p className="text-gray-600 mb-4">Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent where applicable</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">California Residents (CCPA)</h2>
        <p className="text-gray-600 mb-4">
          If you are a California resident, you have specific rights under the California Consumer
          Privacy Act (CCPA), including the right to know what personal information we collect and
          the right to request deletion of your personal information.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">European Residents (GDPR)</h2>
        <p className="text-gray-600 mb-4">
          If you are a European resident, you have rights under the General Data Protection Regulation
          (GDPR), including the right to access, rectify, erase, and port your data, as well as the
          right to object to processing.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Children&apos;s Privacy</h2>
        <p className="text-gray-600 mb-4">
          Our website is not intended for children under 18 years of age. We do not knowingly collect
          personal information from children.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
        <p className="text-gray-600 mb-4">
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated &quot;Last Updated&quot; date.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-600 mb-4">
          Email: privacy@top10psychicreaders.com
        </p>
      </div>
    </div>
  );
}
