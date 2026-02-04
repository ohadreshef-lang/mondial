import Link from 'next/link';
import { categories } from '@/data/categories';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">10</span>
              </div>
              <span className="text-xl font-bold text-white">
                Top10<span className="text-purple-400">Psychic</span>Readers
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted guide to finding the best online psychic reading services.
              We independently review and compare platforms to help you make informed decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Our Methodology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Reading Types</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Affiliate Disclaimer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-gray-500 text-xs text-center">
            <strong>Affiliate Disclosure:</strong> We may earn a commission when you click links on our site and make a purchase.
            This does not affect our rankings or reviews, which are based on independent research and analysis.
            <Link href="/affiliate-disclosure" className="text-purple-400 hover:underline ml-1">
              Learn more
            </Link>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} Top10PsychicReaders.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
