# Psychic Reading Comparison Website - Product Specification

## Overview

This document outlines the specifications for building a "Top 10 Psychic Reading Services" comparison website. The website will serve as a comprehensive resource for users seeking psychic reading services, providing detailed reviews, comparisons, and recommendations of various psychic platforms.

---

## 1. Target Audience

- **Primary**: Adults (25-55) seeking spiritual guidance, life advice, or psychic readings
- **Secondary**: First-time users curious about psychic services
- **Tertiary**: Returning users comparing platforms for specific needs (love, career, family, etc.)

---

## 2. Site Architecture

### 2.1 Page Structure

```
/
├── index.html          # Homepage with top 10 rankings
├── /reviews/           # Individual platform reviews
│   ├── purple-garden.html
│   ├── kasamba.html
│   ├── keen.html
│   ├── california-psychics.html
│   ├── psychic-source.html
│   ├── oranum.html
│   ├── mysticsense.html
│   ├── psychic-world.html
│   ├── asknow.html
│   └── pathforward.html
├── /categories/        # Category-specific pages
│   ├── love-readings.html
│   ├── career-readings.html
│   ├── tarot-readings.html
│   ├── mediumship.html
│   └── astrology.html
├── /guides/            # Educational content
│   ├── how-psychic-readings-work.html
│   ├── first-reading-guide.html
│   └── choosing-a-psychic.html
├── about.html          # About the website
├── methodology.html    # How we rank/review
├── privacy-policy.html # Legal
└── terms.html          # Terms of service
```

---

## 3. Homepage Design Specification

### 3.1 Hero Section

**Purpose**: Capture attention and establish credibility

**Elements**:
- **Headline**: "Top 10 Best Psychic Reading Sites for 2026"
- **Subheadline**: "Trusted Reviews & Expert Comparisons"
- **Hero Image**: Mystical/spiritual themed background (cosmic, stars, tarot imagery)
- **Trust Badges**: "Independently Reviewed", "Updated [Month] 2026"
- **Quick CTA**: "Find Your Perfect Psychic" button

**Design**:
- Full-width background with gradient overlay
- Text: White/light colored for contrast
- CTA Button: Prominent accent color (purple, gold, or teal)

### 3.2 Quick Comparison Table

**Purpose**: Allow users to quickly compare top platforms at a glance

**Table Columns**:
| Rank | Platform | Rating | Starting Price | Special Offer | Best For | CTA |
|------|----------|--------|----------------|---------------|----------|-----|
| #1   | Platform Name | 4.9/5 | $X.XX/min | Offer text | Category | Visit Site |

**Features**:
- Sortable columns (by rating, price)
- Sticky header on scroll
- Mobile-responsive (horizontal scroll or card view)
- Affiliate links with `rel="nofollow sponsored"`

### 3.3 Detailed Platform Cards

**Purpose**: Provide detailed information for each ranked platform

**Card Structure**:
```
┌─────────────────────────────────────────────────────────┐
│ [Rank Badge] [Platform Logo]           [Rating: 4.9/5] │
│                                                         │
│ Platform Name                                           │
│ Brief description (2-3 sentences)                       │
│                                                         │
│ ✓ Pros                      ✗ Cons                     │
│ • Pro item 1                • Con item 1               │
│ • Pro item 2                • Con item 2               │
│ • Pro item 3                                           │
│                                                         │
│ Key Features:                                           │
│ [Tag: Video] [Tag: Chat] [Tag: Phone] [Tag: Mobile App]│
│                                                         │
│ Special Offer: "First 3 minutes FREE + $20 credit"     │
│                                                         │
│ [Read Full Review]              [Visit Site →]          │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Category Quick Links

**Purpose**: Help users find specialized reading types

**Categories to Display**:
- Love & Relationships
- Career & Finance
- Tarot Readings
- Mediumship & Deceased
- Astrology & Horoscopes
- Dream Interpretation
- Pet Psychics
- Past Life Readings

**Design**: Grid of clickable cards with icons

### 3.5 How It Works Section

**Purpose**: Educate new users

**Steps**:
1. **Choose a Platform** - Browse our top-rated psychic sites
2. **Select a Psychic** - Read profiles and reviews
3. **Pick Your Method** - Chat, phone, or video reading
4. **Get Your Reading** - Connect with your chosen advisor

### 3.6 Trust & Credibility Section

**Elements**:
- Methodology explanation ("How We Review")
- Total reviews analyzed badge
- "Last Updated" timestamp
- Expert reviewer profiles/avatars
- User testimonials (if applicable)

### 3.7 FAQ Section

**Purpose**: Address common questions and improve SEO

**Questions to Include**:
- Are online psychic readings accurate?
- How much do psychic readings cost?
- Can I get a refund if I'm not satisfied?
- What's the difference between chat and phone readings?
- How do I know if a psychic is legitimate?
- What should I expect from my first reading?

**Format**: Accordion-style expandable sections with Schema.org FAQ markup

### 3.8 Footer

**Sections**:
- **Quick Links**: Home, About, Methodology, Contact
- **Categories**: Love, Career, Tarot, Mediumship, Astrology
- **Legal**: Privacy Policy, Terms of Service, Disclaimer
- **Social Links**: Facebook, Twitter, Instagram, Pinterest
- **Affiliate Disclaimer**: Clear disclosure statement
- **Copyright**: © 2026 [Site Name]. All rights reserved.

---

## 4. Individual Review Page Specification

### 4.1 Page Structure

```
1. Breadcrumb Navigation
2. Platform Header (Logo, Name, Rating, Quick Stats)
3. Promotional Banner (Special Offer CTA)
4. Table of Contents (sticky sidebar)
5. Overview Section
6. Pros & Cons
7. Pricing Breakdown
8. Reading Types Available
9. Psychic Selection Process
10. User Experience Review
11. Mobile App Review (if applicable)
12. Customer Support
13. Satisfaction Guarantee
14. User Reviews/Testimonials
15. Comparison with Alternatives
16. Final Verdict
17. FAQ Section
18. Related Reviews
```

### 4.2 Review Scoring Criteria

**Rating Categories** (each out of 5):
- **Psychic Quality**: Vetting process, accuracy, professionalism
- **Pricing**: Value for money, transparency, introductory offers
- **Reading Variety**: Types of readings, specializations
- **User Experience**: Website/app usability, booking ease
- **Customer Support**: Responsiveness, refund policy

**Overall Score**: Weighted average displayed as X.X/5 stars

---

## 5. Platform Data Structure

### 5.1 Platform Object Schema

```javascript
{
  id: "purple-garden",
  name: "Purple Garden",
  rank: 1,
  logo: "/images/logos/purple-garden.png",
  website: "https://purplegarden.com",
  affiliateLink: "https://tracking.example.com/purple-garden",
  rating: {
    overall: 4.9,
    psychicQuality: 5.0,
    pricing: 4.7,
    readingVariety: 4.8,
    userExperience: 5.0,
    customerSupport: 4.8
  },
  pricing: {
    minPerMinute: 3.99,
    maxPerMinute: 15.99,
    currency: "USD"
  },
  specialOffer: {
    text: "$20 FREE for $10 deposit",
    code: null,
    expiry: null
  },
  features: {
    chatReadings: true,
    phoneReadings: true,
    videoReadings: true,
    mobileApp: true,
    emailReadings: false,
    scheduling: true
  },
  readingTypes: [
    "Tarot",
    "Love & Relationships",
    "Career",
    "Astrology",
    "Mediumship",
    "Dream Analysis"
  ],
  pros: [
    "Highly vetted psychic advisors",
    "Excellent mobile app experience",
    "Video reading option",
    "Bilingual (English & Spanish)"
  ],
  cons: [
    "No email readings",
    "Newer platform (less established)"
  ],
  bestFor: "Video readings and mobile users",
  advisorCount: 1000,
  foundedYear: 2019,
  satisfactionGuarantee: true,
  description: "Purple Garden leads the industry..."
}
```

---

## 6. Design System

### 6.1 Color Palette

```css
:root {
  /* Primary Colors */
  --primary: #6B46C1;        /* Deep Purple - Main brand */
  --primary-light: #9F7AEA;  /* Light Purple - Hover states */
  --primary-dark: #553C9A;   /* Dark Purple - Active states */

  /* Secondary Colors */
  --secondary: #D69E2E;      /* Gold - CTAs, highlights */
  --secondary-light: #ECC94B;

  /* Accent Colors */
  --accent-teal: #319795;    /* Trust, info sections */
  --accent-pink: #D53F8C;    /* Special offers */

  /* Neutrals */
  --gray-900: #1A202C;       /* Primary text */
  --gray-700: #4A5568;       /* Secondary text */
  --gray-500: #718096;       /* Muted text */
  --gray-200: #E2E8F0;       /* Borders */
  --gray-100: #F7FAFC;       /* Backgrounds */
  --white: #FFFFFF;

  /* Semantic Colors */
  --success: #38A169;        /* Pros, positive */
  --warning: #D69E2E;        /* Attention */
  --error: #E53E3E;          /* Cons, negative */
  --info: #3182CE;           /* Information */
}
```

### 6.2 Typography

```css
/* Font Family */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 6.3 Spacing System

```css
/* Based on 4px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 6.4 Component Styles

**Buttons**:
- Primary: Purple background, white text, rounded-lg
- Secondary: White background, purple border, purple text
- CTA: Gold background, dark text, larger size, subtle animation

**Cards**:
- White background
- Subtle shadow: `0 4px 6px -1px rgba(0,0,0,0.1)`
- Border radius: 12px
- Hover: Slight lift effect

**Rating Stars**:
- Filled: Gold (#D69E2E)
- Empty: Gray (#E2E8F0)
- Size options: sm (16px), md (20px), lg (24px)

---

## 7. Technical Requirements

### 7.1 Frontend Stack

**Options**:
1. **Static Site** (Recommended for SEO)
   - HTML5 / CSS3 / Vanilla JavaScript
   - Or: Astro, 11ty, Hugo for templating

2. **Modern Framework**
   - Next.js with Static Site Generation (SSG)
   - Gatsby with GraphQL data layer

### 7.2 Performance Requirements

- **Lighthouse Score**: 90+ for all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Image Optimization**: WebP format, lazy loading
- **Core Web Vitals**: Pass all metrics

### 7.3 SEO Requirements

**Technical SEO**:
- Semantic HTML5 structure
- Schema.org structured data (Article, Review, FAQ, Organization)
- XML sitemap generation
- robots.txt configuration
- Canonical URLs
- Open Graph and Twitter Card meta tags
- Mobile-first responsive design

**On-Page SEO**:
- Unique title tags (< 60 characters)
- Meta descriptions (< 160 characters)
- H1-H6 hierarchy
- Internal linking strategy
- Alt text for all images
- Breadcrumb navigation

### 7.4 Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Focus indicators
- Skip navigation links
- ARIA labels where needed

---

## 8. Features & Functionality

### 8.1 Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Platform Rankings | P0 | Display top 10 ranked platforms |
| Comparison Table | P0 | Side-by-side comparison grid |
| Individual Reviews | P0 | Detailed review pages per platform |
| Search/Filter | P1 | Filter by reading type, price, rating |
| Category Pages | P1 | Specialized landing pages |
| Mobile Responsive | P0 | Full mobile optimization |
| Affiliate Tracking | P0 | Track clicks to partner sites |

### 8.2 Enhanced Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Dark Mode | P2 | Theme toggle |
| Newsletter Signup | P2 | Email capture for updates |
| User Reviews | P3 | Allow user-submitted reviews |
| Comparison Tool | P2 | Select 2-3 platforms to compare |
| "Quiz" Matcher | P3 | Help users find best platform |
| Price Calculator | P3 | Estimate reading costs |

### 8.3 Search & Filter System

**Filter Options**:
- Reading Type: Tarot, Astrology, Mediumship, etc.
- Communication: Chat, Phone, Video
- Price Range: Budget (<$5), Mid ($5-10), Premium (>$10)
- Rating: 4+ stars, 4.5+ stars
- Features: Mobile app, Satisfaction guarantee, Free minutes

**Sort Options**:
- Best Overall (default)
- Lowest Price
- Highest Rated
- Most Psychics
- Best Offers

---

## 9. Content Requirements

### 9.1 Platform Review Content (per platform)

- **Word Count**: 1,500 - 2,500 words
- **Sections**: Overview, Pros/Cons, Pricing, Features, Verdict
- **Media**: Logo, screenshots (2-4), comparison graphics
- **Updates**: Quarterly review for accuracy

### 9.2 Evergreen Content

| Content Piece | Target Keywords | Word Count |
|--------------|-----------------|------------|
| How to Choose a Psychic | best psychic reader, choose psychic | 1,500 |
| Psychic Reading Types Explained | types of psychic readings | 2,000 |
| First Psychic Reading Guide | first psychic reading tips | 1,200 |
| Are Psychic Readings Real? | psychic readings legitimate | 1,500 |
| Online vs In-Person Readings | online psychic reading | 1,000 |

### 9.3 Legal Content

- **Privacy Policy**: GDPR and CCPA compliant
- **Terms of Service**: User agreement
- **Affiliate Disclosure**: FTC-compliant disclosure
- **Disclaimer**: Entertainment purposes notice

---

## 10. Monetization Strategy

### 10.1 Revenue Streams

1. **Affiliate Commissions** (Primary)
   - CPA (Cost Per Acquisition): $25-100 per signup
   - Revenue Share: 20-40% of user spend
   - Hybrid models available

2. **Display Advertising** (Secondary)
   - AdSense or premium ad networks
   - Strategic placement (non-intrusive)

3. **Sponsored Content** (Optional)
   - Sponsored reviews (clearly disclosed)
   - Premium placements

### 10.2 Affiliate Disclosure

Display clear disclosure:
- In header/above comparison table
- On individual review pages
- In footer

Example text:
> "We may earn a commission when you click links on our site. This doesn't affect our rankings or reviews. [Learn more about how we make money](/affiliate-disclosure)"

---

## 11. Analytics & Tracking

### 11.1 Required Tracking

- **Google Analytics 4**: User behavior, traffic sources
- **Google Search Console**: Search performance, indexing
- **Affiliate Tracking**: Click tracking, conversions
- **Heatmaps** (Optional): Hotjar or similar

### 11.2 Key Metrics

- Organic traffic growth
- Click-through rate to affiliate partners
- Conversion rate (visits to affiliate clicks)
- Bounce rate by page
- Time on page
- Top performing content

---

## 12. Launch Checklist

### Pre-Launch
- [ ] All 10 platform reviews complete
- [ ] Homepage and category pages ready
- [ ] Mobile responsiveness verified
- [ ] All affiliate links tested
- [ ] Legal pages in place
- [ ] Analytics configured
- [ ] SEO audit passed
- [ ] Lighthouse scores verified
- [ ] Cross-browser testing complete
- [ ] SSL certificate active

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Social media profiles created
- [ ] Initial link building campaign
- [ ] Monitor for 404 errors
- [ ] Set up rank tracking

---

## 13. Maintenance Schedule

| Task | Frequency |
|------|-----------|
| Check affiliate links | Weekly |
| Update pricing/offers | Weekly |
| Review rankings accuracy | Monthly |
| Content updates | Quarterly |
| Full site audit | Bi-annually |
| Security updates | As needed |

---

## 14. Competitive Differentiation

To stand out from competitors:

1. **Deeper Reviews**: More thorough, honest reviews than competitors
2. **Better UX**: Faster, cleaner, more modern design
3. **Unique Tools**: Comparison tool, psychic matcher quiz
4. **Fresh Content**: Regular updates, blog content
5. **Transparency**: Clear methodology, honest cons
6. **Mobile Excellence**: Superior mobile experience

---

## 15. Risk Considerations

| Risk | Mitigation |
|------|------------|
| Affiliate program changes | Diversify across multiple programs |
| Google algorithm updates | Focus on quality content, E-E-A-T |
| Legal challenges | Proper disclaimers, FTC compliance |
| Platform reputation issues | Monitor news, update reviews promptly |
| Ad blockers | Don't rely solely on ads |

---

## Appendix A: Top 10 Platforms (2026)

Based on industry research, the current top platforms to review:

1. **Purple Garden** - Best overall, excellent app
2. **Kasamba** - Most reading variety, 25+ years
3. **Keen** - Most advisors, budget-friendly
4. **California Psychics** - Premium quality, phone readings
5. **Psychic Source** - Best for beginners, satisfaction guarantee
6. **Oranum** - Best for live video readings
7. **Mysticsense** - Best filtering options, transparent pricing
8. **Psychic World** - Best for international users
9. **AskNow** - Best for quick answers
10. **PathForward** - Best loyalty program

---

## Appendix B: Research Sources

- [Top10.com - Psychic Reading](https://www.top10.com/psychic-reading)
- [MysticMag - 10 Best Online Psychic Reading Sites](https://www.mysticmag.com/)
- [Purple Garden Blog - Ultimate Comparison](https://www.purplegarden.co/blog/best-online-psychic-reading-sites-ultimate-comparison-for-2025)
- [Colorlib - Psychic Website Design Examples](https://colorlib.com/wp/psychic-website-design/)
- [InteliqoServices - Best Psychic Website Templates](https://www.inteliqoservices.com/best-psychic-website-template/)

---

*Document Version: 1.0*
*Created: February 2026*
*Last Updated: February 2026*
