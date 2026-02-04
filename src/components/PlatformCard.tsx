import Link from 'next/link';
import { Platform } from '@/types';
import { getAffiliateLink } from '@/data/affiliate-links';
import RatingStars from './RatingStars';

interface PlatformCardProps {
  platform: Platform;
  context?: string;
  showRank?: boolean;
}

export default function PlatformCard({
  platform,
  context = 'homepage',
  showRank = true,
}: PlatformCardProps) {
  const affiliateLink = getAffiliateLink(platform.id, context);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Rank Badge */}
      {showRank && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 flex items-center justify-between">
          <span className="text-white font-bold text-lg">#{platform.rank}</span>
          <span className="text-purple-200 text-sm">{platform.bestFor}</span>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{platform.name}</h3>
            <RatingStars rating={platform.rating.overall} size="md" />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Starting at</div>
            <div className="text-lg font-bold text-purple-600">
              ${platform.pricing.minPerMinute}/min
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{platform.description}</p>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2">Pros</h4>
            <ul className="space-y-1">
              {platform.pros.slice(0, 3).map((pro, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="line-clamp-1">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2">Cons</h4>
            <ul className="space-y-1">
              {platform.cons.slice(0, 2).map((con, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="line-clamp-1">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {platform.features.chatReadings && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Chat
            </span>
          )}
          {platform.features.phoneReadings && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Phone
            </span>
          )}
          {platform.features.videoReadings && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Video
            </span>
          )}
          {platform.features.mobileApp && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Mobile App
            </span>
          )}
          {platform.satisfactionGuarantee && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Satisfaction Guarantee
            </span>
          )}
        </div>

        {/* Special Offer */}
        {platform.specialOffer.text && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            <span className="text-amber-800 text-sm font-medium">
              Special Offer: {platform.specialOffer.text}
            </span>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={affiliateLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Visit Site
          </a>
          <Link
            href={`/review/${platform.slug}`}
            className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 text-center font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Read Review
          </Link>
        </div>
      </div>
    </div>
  );
}
