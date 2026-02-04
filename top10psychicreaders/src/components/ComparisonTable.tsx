'use client';

import Link from 'next/link';
import { Platform } from '@/types';
import { getAffiliateLink } from '@/data/affiliate-links';
import RatingStars from './RatingStars';

interface ComparisonTableProps {
  platforms: Platform[];
  context?: string;
}

export default function ComparisonTable({ platforms, context = 'homepage' }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Platform</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Starting Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Special Offer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Best For</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {platforms.map((platform) => (
            <tr key={platform.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 font-bold rounded-full">
                  {platform.rank}
                </span>
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/review/${platform.slug}`}
                  className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                >
                  {platform.name}
                </Link>
              </td>
              <td className="px-4 py-4">
                <RatingStars rating={platform.rating.overall} size="sm" />
              </td>
              <td className="px-4 py-4">
                <span className="font-semibold text-gray-900">
                  ${platform.pricing.minPerMinute}/min
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  {platform.specialOffer.text}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">{platform.bestFor}</span>
              </td>
              <td className="px-4 py-4 text-center">
                <a
                  href={getAffiliateLink(platform.id, context)}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Visit Site
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
