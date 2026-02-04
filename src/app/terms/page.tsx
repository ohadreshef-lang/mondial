import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Top10PsychicReaders.com - Please read these terms carefully before using our website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-purple-600">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Terms of Service</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> February 2026
        </p>

        <p className="text-gray-600 mb-6">
          Welcome to Top10PsychicReaders.com. By accessing or using our website, you agree to be
          bound by these Terms of Service. If you do not agree with any part of these terms, please
          do not use our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-4">
          By accessing and using Top10PsychicReaders.com, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service and our Privacy Policy.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
        <p className="text-gray-600 mb-4">
          Top10PsychicReaders.com is an informational website that provides reviews, comparisons,
          and recommendations for online psychic reading services. We do not provide psychic
          readings directly. Our content is for informational and entertainment purposes only.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Entertainment Disclaimer</h2>
        <p className="text-gray-600 mb-4">
          <strong>IMPORTANT:</strong> The psychic reading services reviewed on this website are
          intended for entertainment purposes only. Psychic readings should not be used as a
          substitute for professional advice, including but not limited to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Medical or health advice</li>
          <li>Legal advice</li>
          <li>Financial or investment advice</li>
          <li>Mental health counseling</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Always consult qualified professionals for important life decisions.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
        <p className="text-gray-600 mb-4">
          Our website contains links to third-party psychic reading platforms. We are not responsible
          for the content, accuracy, or practices of these external websites. Your interactions with
          these platforms are governed by their respective terms and policies.
        </p>
        <p className="text-gray-600 mb-4">
          We do not guarantee the quality, accuracy, or results of any psychic reading services
          provided by third parties.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Affiliate Relationships</h2>
        <p className="text-gray-600 mb-4">
          Top10PsychicReaders.com participates in affiliate programs. This means we may earn
          commissions when you click links on our site and make purchases on third-party platforms.
          This does not affect our editorial integrity or the price you pay.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
        <p className="text-gray-600 mb-4">
          All content on this website, including text, graphics, logos, and images, is the property
          of Top10PsychicReaders.com or its content suppliers and is protected by copyright laws.
          You may not reproduce, distribute, or create derivative works without our written permission.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. User Conduct</h2>
        <p className="text-gray-600 mb-4">You agree not to:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Use our website for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the website</li>
          <li>Scrape or harvest content without permission</li>
          <li>Transmit any viruses or malicious code</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
        <p className="text-gray-600 mb-4">
          This website is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
          either express or implied. We do not warrant that:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>The website will be uninterrupted or error-free</li>
          <li>The information provided is accurate or complete</li>
          <li>Any defects will be corrected</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
        <p className="text-gray-600 mb-4">
          To the fullest extent permitted by law, Top10PsychicReaders.com shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages arising from your
          use of the website or any linked third-party services.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Age Requirement</h2>
        <p className="text-gray-600 mb-4">
          You must be at least 18 years old to use this website and the services we review.
          By using our website, you confirm that you meet this age requirement.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to modify these Terms of Service at any time. Changes will be
          effective immediately upon posting. Your continued use of the website after changes
          constitutes acceptance of the modified terms.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
        <p className="text-gray-600 mb-4">
          These Terms of Service shall be governed by and construed in accordance with the laws
          of the United States, without regard to conflict of law principles.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
        <p className="text-gray-600 mb-4">
          If you have questions about these Terms of Service, please contact us at:
        </p>
        <p className="text-gray-600 mb-4">
          Email: legal@top10psychicreaders.com
        </p>
      </div>
    </div>
  );
}
