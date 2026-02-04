import { AffiliateConfig } from '@/types';

/**
 * Affiliate Links Configuration
 *
 * Easy to update affiliate links for each platform.
 * You can set different links for different landing pages.
 *
 * Structure:
 * - 'default': The main affiliate link used across the site
 * - 'homepage': Link used specifically on the homepage
 * - 'review': Link used on the individual review page
 * - 'category-[name]': Link used on specific category pages
 *
 * Example:
 * 'purple-garden': {
 *   default: 'https://purplegarden.com/?ref=top10',
 *   homepage: 'https://purplegarden.com/?ref=top10&src=home',
 *   review: 'https://purplegarden.com/?ref=top10&src=review',
 *   'category-love': 'https://purplegarden.com/?ref=top10&src=love',
 * }
 */
export const affiliateLinks: AffiliateConfig = {
  'purple-garden': {
    default: 'https://www.purplegarden.co/',
    homepage: 'https://www.purplegarden.co/',
    review: 'https://www.purplegarden.co/',
    'category-love': 'https://www.purplegarden.co/',
    'category-tarot': 'https://www.purplegarden.co/',
    'category-career': 'https://www.purplegarden.co/',
    'category-mediumship': 'https://www.purplegarden.co/',
    'category-astrology': 'https://www.purplegarden.co/',
  },
  'keen': {
    default: 'https://www.keen.com/',
    homepage: 'https://www.keen.com/',
    review: 'https://www.keen.com/',
    'category-love': 'https://www.keen.com/',
    'category-tarot': 'https://www.keen.com/',
    'category-career': 'https://www.keen.com/',
    'category-mediumship': 'https://www.keen.com/',
    'category-astrology': 'https://www.keen.com/',
  },
  'kasamba': {
    default: 'https://www.kasamba.com/',
    homepage: 'https://www.kasamba.com/',
    review: 'https://www.kasamba.com/',
    'category-love': 'https://www.kasamba.com/',
    'category-tarot': 'https://www.kasamba.com/',
    'category-career': 'https://www.kasamba.com/',
    'category-mediumship': 'https://www.kasamba.com/',
    'category-astrology': 'https://www.kasamba.com/',
  },
  'psiquicos': {
    default: 'https://www.psiquicos.com/',
    homepage: 'https://www.psiquicos.com/',
    review: 'https://www.psiquicos.com/',
    'category-love': 'https://www.psiquicos.com/',
    'category-tarot': 'https://www.psiquicos.com/',
    'category-career': 'https://www.psiquicos.com/',
    'category-mediumship': 'https://www.psiquicos.com/',
    'category-astrology': 'https://www.psiquicos.com/',
  },
  'purple-ocean': {
    default: 'https://www.purpleocean.co/',
    homepage: 'https://www.purpleocean.co/',
    review: 'https://www.purpleocean.co/',
    'category-love': 'https://www.purpleocean.co/',
    'category-tarot': 'https://www.purpleocean.co/',
    'category-career': 'https://www.purpleocean.co/',
    'category-mediumship': 'https://www.purpleocean.co/',
    'category-astrology': 'https://www.purpleocean.co/',
  },
};

/**
 * Get affiliate link for a platform
 * @param platformId - The platform ID (e.g., 'purple-garden')
 * @param context - The context/landing page (e.g., 'homepage', 'review', 'category-love')
 * @returns The affiliate link URL
 */
export function getAffiliateLink(platformId: string, context: string = 'default'): string {
  const platformLinks = affiliateLinks[platformId];

  if (!platformLinks) {
    console.warn(`No affiliate links found for platform: ${platformId}`);
    return '#';
  }

  // Try to get the specific context link, fall back to default
  return platformLinks[context] || platformLinks.default || '#';
}
