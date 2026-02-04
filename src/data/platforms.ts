import { Platform } from '@/types';

export const platforms: Platform[] = [
  {
    id: 'purple-garden',
    name: 'Purple Garden',
    slug: 'purple-garden',
    rank: 1,
    logo: '/images/logos/purple-garden.png',
    website: 'https://www.purplegarden.co/',
    rating: {
      overall: 4.9,
      psychicQuality: 5.0,
      pricing: 4.7,
      readingVariety: 4.8,
      userExperience: 5.0,
      customerSupport: 4.8,
    },
    pricing: {
      minPerMinute: 3.99,
      maxPerMinute: 15.99,
      currency: 'USD',
    },
    specialOffer: {
      text: '$20 FREE credit for $10 deposit',
      code: null,
      expiry: null,
    },
    features: {
      chatReadings: true,
      phoneReadings: true,
      videoReadings: true,
      mobileApp: true,
      emailReadings: false,
      scheduling: true,
    },
    readingTypes: [
      'Tarot Reading',
      'Love & Relationships',
      'Career Guidance',
      'Astrology',
      'Mediumship',
      'Dream Analysis',
      'Spiritual Guidance',
    ],
    categories: ['love', 'tarot', 'career', 'astrology', 'mediumship'],
    pros: [
      'Highly vetted and compassionate psychic advisors',
      'Excellent mobile app with 4.8★ rating',
      'Video reading option for face-to-face connections',
      'Bilingual support (English & Spanish)',
      'Real-time availability indicators',
    ],
    cons: [
      'No email readings available',
      'Newer platform compared to competitors',
      'Premium advisors can be pricey',
    ],
    bestFor: 'Video readings and mobile users',
    advisorCount: 1000,
    foundedYear: 2019,
    satisfactionGuarantee: true,
    description: 'Purple Garden is our top-rated psychic reading platform, offering an exceptional mobile experience with highly vetted advisors. Their video reading feature sets them apart, allowing for more personal connections with psychics.',
    fullReview: `
## Purple Garden Review 2026

Purple Garden has quickly risen to become one of the most trusted names in online psychic readings. Founded in 2019, this platform has revolutionized the industry with its mobile-first approach and commitment to quality.

### What Makes Purple Garden Stand Out

Purple Garden's greatest strength lies in its rigorous advisor screening process. Every psychic on the platform undergoes extensive vetting to ensure authenticity and professionalism. This commitment to quality is reflected in their consistently high customer satisfaction ratings.

### Reading Experience

The platform offers multiple ways to connect with advisors:
- **Live Chat**: Perfect for quick questions or when you need discretion
- **Phone Calls**: Traditional readings with clear audio quality
- **Video Readings**: Face-to-face connections for a more personal experience

### Mobile App Excellence

Purple Garden's mobile app is rated 4.8 stars on both iOS and Android. The app offers exclusive features not available on desktop, including push notifications when your favorite advisors come online.

### Pricing & Value

With rates starting at $3.99 per minute, Purple Garden offers competitive pricing. New users receive $20 in free credits when they deposit $10, allowing you to try multiple advisors before committing.

### Customer Support

Their support team is responsive and helpful, typically responding within hours. The satisfaction guarantee ensures you can request a refund if you're not happy with your reading.

### Final Verdict

Purple Garden earns our top spot for its combination of quality advisors, innovative features, and excellent user experience. Whether you're a first-time user or an experienced seeker, Purple Garden delivers consistently excellent readings.
    `,
  },
  {
    id: 'keen',
    name: 'Keen',
    slug: 'keen',
    rank: 2,
    logo: '/images/logos/keen.png',
    website: 'https://www.keen.com/',
    rating: {
      overall: 4.8,
      psychicQuality: 4.7,
      pricing: 4.9,
      readingVariety: 4.8,
      userExperience: 4.7,
      customerSupport: 4.8,
    },
    pricing: {
      minPerMinute: 1.99,
      maxPerMinute: 9.99,
      currency: 'USD',
    },
    specialOffer: {
      text: 'First 5 minutes for just $1',
      code: null,
      expiry: null,
    },
    features: {
      chatReadings: true,
      phoneReadings: true,
      videoReadings: false,
      mobileApp: true,
      emailReadings: true,
      scheduling: true,
    },
    readingTypes: [
      'Tarot Reading',
      'Love & Relationships',
      'Career Guidance',
      'Astrology',
      'Spiritual Guidance',
      'Life Questions',
      'Pet Psychics',
    ],
    categories: ['love', 'tarot', 'career', 'astrology'],
    pros: [
      'Largest advisor network with 3,000+ psychics',
      'Most budget-friendly with rates from $1.99/min',
      'Over 20 years of trusted service',
      'Excellent matching algorithm',
      'Email readings available',
    ],
    cons: [
      'No video reading option',
      'Quality varies due to large network',
      'Interface feels dated compared to newer platforms',
    ],
    bestFor: 'Budget-conscious users and variety seekers',
    advisorCount: 3000,
    foundedYear: 1999,
    satisfactionGuarantee: true,
    description: 'Keen is one of the oldest and most trusted psychic platforms, offering the largest selection of advisors at budget-friendly prices. With over 20 years in the industry, they\'ve connected millions of users with quality psychics.',
    fullReview: `
## Keen Review 2026

Keen has been a pioneer in online psychic readings since 1999. With over two decades of experience and the largest network of advisors, Keen remains a top choice for seekers worldwide.

### The Keen Advantage

Keen's greatest strength is choice. With nearly 3,000 advisors available, you'll find specialists in virtually every type of reading imaginable. Their advanced matching system helps pair you with advisors who fit your specific needs.

### Reading Options

Keen offers flexible communication options:
- **Phone Readings**: Clear, direct conversations with advisors
- **Chat Readings**: Text-based sessions for privacy
- **Email Readings**: Detailed written responses at your convenience

### Advisor Quality

While the large network means some variation in quality, Keen's review system helps you identify top performers. Look for advisors with hundreds of positive reviews for the best experience.

### Pricing Structure

Keen is one of the most affordable platforms available:
- Starting rates as low as $1.99 per minute
- First 5 minutes for just $1 for new users
- Many experienced advisors under $5/minute

### Platform Experience

The website and app are functional if not flashy. Navigation is straightforward, and finding available advisors is easy. The mobile app works well for on-the-go readings.

### Final Verdict

Keen earns high marks for affordability and selection. It's ideal for users who want options and don't mind spending time finding the right advisor. The introductory offer makes it risk-free to try.
    `,
  },
  {
    id: 'kasamba',
    name: 'Kasamba',
    slug: 'kasamba',
    rank: 3,
    logo: '/images/logos/kasamba.png',
    website: 'https://www.kasamba.com/',
    rating: {
      overall: 4.8,
      psychicQuality: 4.9,
      pricing: 4.5,
      readingVariety: 5.0,
      userExperience: 4.6,
      customerSupport: 4.7,
    },
    pricing: {
      minPerMinute: 1.99,
      maxPerMinute: 30.00,
      currency: 'USD',
    },
    specialOffer: {
      text: '3 FREE minutes + 50% off first reading',
      code: null,
      expiry: null,
    },
    features: {
      chatReadings: true,
      phoneReadings: true,
      videoReadings: false,
      mobileApp: true,
      emailReadings: true,
      scheduling: false,
    },
    readingTypes: [
      'Tarot Reading',
      'Love & Relationships',
      'Career Guidance',
      'Astrology',
      'Mediumship',
      'Dream Analysis',
      'Aura Reading',
      'Crystal Reading',
      'Kabbalah',
      'Past Life Reading',
      'Fortune Telling',
    ],
    categories: ['love', 'tarot', 'career', 'astrology', 'mediumship'],
    pros: [
      '25+ years of trusted service',
      'Widest variety of reading types (24+ categories)',
      'Excellent for love and relationship guidance',
      'Detailed advisor profiles',
      'Strong satisfaction guarantee',
    ],
    cons: [
      'No video readings',
      'Premium advisors can be expensive',
      'No scheduling feature',
    ],
    bestFor: 'Love readings and specialized spiritual guidance',
    advisorCount: 500,
    foundedYear: 1999,
    satisfactionGuarantee: true,
    description: 'Kasamba is a veteran psychic platform known for its exceptional variety of reading types. With over 25 years of experience, they specialize in love and relationship guidance with some of the most talented advisors in the industry.',
    fullReview: `
## Kasamba Review 2026

Kasamba has been connecting seekers with psychic advisors since 1999. Known for their exceptional variety and specialization in love readings, Kasamba remains a trusted name in spiritual guidance.

### Unmatched Variety

Kasamba offers the widest selection of reading types in the industry:
- Traditional: Tarot, Astrology, Numerology
- Spiritual: Mediumship, Past Lives, Aura Reading
- Specialized: Kabbalah, Crystal Reading, Graphology
- Niche: Pet Psychics, Missing Persons, Career Forecasting

### Love & Relationship Expertise

Where Kasamba truly shines is in love and relationship readings. Their advisors are particularly skilled at:
- Soulmate connections
- Relationship compatibility
- Breakup recovery
- Future love predictions

### Advisor Quality

Kasamba's screening process ensures quality advisors. Profiles include detailed backgrounds, specialties, and genuine user reviews. Many advisors have thousands of readings and stellar ratings.

### Pricing

Rates vary widely based on advisor experience:
- Entry-level: $1.99 - $5.00/min
- Experienced: $5.00 - $15.00/min
- Premium: $15.00 - $30.00/min

New users get 3 free minutes plus 50% off their first reading.

### Final Verdict

Kasamba is the go-to platform for love readings and specialized spiritual services. While prices can be higher for premium advisors, the quality and variety make it worth considering.
    `,
  },
  {
    id: 'psiquicos',
    name: 'Psiquicos',
    slug: 'psiquicos',
    rank: 4,
    logo: '/images/logos/psiquicos.png',
    website: 'https://www.psiquicos.com/',
    rating: {
      overall: 4.7,
      psychicQuality: 4.8,
      pricing: 4.6,
      readingVariety: 4.5,
      userExperience: 4.7,
      customerSupport: 4.8,
    },
    pricing: {
      minPerMinute: 2.99,
      maxPerMinute: 12.99,
      currency: 'USD',
    },
    specialOffer: {
      text: 'First 3 minutes FREE on first reading',
      code: null,
      expiry: null,
    },
    features: {
      chatReadings: true,
      phoneReadings: true,
      videoReadings: true,
      mobileApp: true,
      emailReadings: false,
      scheduling: true,
    },
    readingTypes: [
      'Tarot Reading',
      'Love & Relationships',
      'Career Guidance',
      'Astrology',
      'Spiritual Guidance',
      'Mediumship',
      'Dream Interpretation',
    ],
    categories: ['love', 'tarot', 'career', 'astrology', 'mediumship'],
    pros: [
      'Bilingual platform (English & Spanish)',
      'Strong Latin American psychic traditions',
      'Video readings available',
      'Competitive pricing',
      'Culturally diverse advisors',
    ],
    cons: [
      'Smaller advisor network',
      'Less established than competitors',
      'Limited niche reading types',
    ],
    bestFor: 'Spanish-speaking users and Latin American spiritual traditions',
    advisorCount: 300,
    foundedYear: 2018,
    satisfactionGuarantee: true,
    description: 'Psiquicos brings authentic Latin American psychic traditions to a modern platform. Fully bilingual in English and Spanish, they offer culturally rich readings from advisors steeped in diverse spiritual practices.',
    fullReview: `
## Psiquicos Review 2026

Psiquicos has carved out a unique niche in the online psychic industry by celebrating Latin American spiritual traditions while serving a global audience.

### Cultural Authenticity

What sets Psiquicos apart is their commitment to authentic cultural practices:
- Traditional curanderismo techniques
- Santería-influenced readings
- Indigenous spiritual traditions
- Modern psychic practices

### Bilingual Excellence

The platform is fully bilingual:
- Complete Spanish and English support
- Native-speaking advisors in both languages
- Culturally appropriate readings
- No awkward translations

### Reading Experience

Psiquicos offers multiple connection methods:
- **Video Readings**: See your advisor face-to-face
- **Phone Calls**: Traditional voice readings
- **Live Chat**: Text-based convenience

### Advisor Network

While smaller than some competitors, Psiquicos' advisors are carefully selected for:
- Cultural knowledge
- Language proficiency
- Reading accuracy
- Client care

### Pricing

Competitive rates make quality readings accessible:
- Starting at $2.99 per minute
- Premium advisors up to $12.99/min
- First 3 minutes free for new users

### Final Verdict

Psiquicos is the clear choice for Spanish-speaking users or anyone interested in Latin American spiritual traditions. Their authentic approach and bilingual support create a welcoming experience.
    `,
  },
  {
    id: 'purple-ocean',
    name: 'Purple Ocean',
    slug: 'purple-ocean',
    rank: 5,
    logo: '/images/logos/purple-ocean.png',
    website: 'https://www.purpleocean.co/',
    rating: {
      overall: 4.6,
      psychicQuality: 4.7,
      pricing: 4.8,
      readingVariety: 4.4,
      userExperience: 4.6,
      customerSupport: 4.5,
    },
    pricing: {
      minPerMinute: 1.99,
      maxPerMinute: 9.99,
      currency: 'USD',
    },
    specialOffer: {
      text: 'First reading 50% off',
      code: null,
      expiry: null,
    },
    features: {
      chatReadings: true,
      phoneReadings: true,
      videoReadings: true,
      mobileApp: true,
      emailReadings: false,
      scheduling: true,
    },
    readingTypes: [
      'Tarot Reading',
      'Love & Relationships',
      'Career Guidance',
      'Astrology',
      'Spiritual Guidance',
      'Angel Readings',
    ],
    categories: ['love', 'tarot', 'career', 'astrology'],
    pros: [
      'Very affordable starting rates',
      'Video readings available',
      'User-friendly mobile app',
      'Quick response times',
      'Good for first-time users',
    ],
    cons: [
      'Smaller advisor selection',
      'Fewer specialized reading types',
      'Newer platform still building reputation',
    ],
    bestFor: 'First-time users and budget-conscious seekers',
    advisorCount: 250,
    foundedYear: 2020,
    satisfactionGuarantee: true,
    description: 'Purple Ocean offers an accessible entry point into online psychic readings. With affordable rates and a user-friendly interface, it\'s perfect for those new to psychic services or seeking budget-friendly options.',
    fullReview: `
## Purple Ocean Review 2026

Purple Ocean is a newer entrant to the online psychic space, focusing on accessibility and affordability without sacrificing quality.

### Accessibility First

Purple Ocean was designed with newcomers in mind:
- Simple, intuitive interface
- Clear pricing with no hidden fees
- Easy advisor browsing
- Helpful getting-started guides

### Video Reading Innovation

Like its sister platform Purple Garden, Purple Ocean offers video readings:
- Face-to-face connections
- More personal experience
- Build stronger advisor relationships
- See tarot cards and other tools in use

### Budget-Friendly Pricing

Purple Ocean stands out for affordability:
- Starting rates at just $1.99/min
- Most advisors under $7/min
- 50% off first reading
- No premium tier pricing

### Growing Network

While smaller than established platforms, Purple Ocean is growing:
- 250+ vetted advisors
- Diverse specialties
- Focus on quality over quantity
- Regular new additions

### Mobile Experience

The Purple Ocean app delivers:
- Clean, modern design
- Easy booking
- Secure payments
- Push notifications

### Final Verdict

Purple Ocean is ideal for first-time users or anyone seeking affordable readings. While the platform is still growing, the combination of low prices and quality advisors makes it a solid choice.
    `,
  },
];

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}

export function getPlatformsByCategory(category: string): Platform[] {
  return platforms.filter((p) => p.categories.includes(category));
}

export function getTopPlatforms(count: number = 5): Platform[] {
  return platforms.slice(0, count);
}
