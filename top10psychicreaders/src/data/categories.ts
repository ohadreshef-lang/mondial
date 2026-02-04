import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'love',
    name: 'Love & Relationships',
    slug: 'love',
    description: 'Find guidance on matters of the heart. Our top-rated psychics specialize in love readings, relationship advice, soulmate connections, and romantic compatibility.',
    icon: '❤️',
    metaTitle: 'Best Psychics for Love Readings 2026 | Top10PsychicReaders',
    metaDescription: 'Discover the best online psychics for love and relationship readings. Compare top platforms for accurate love guidance, soulmate connections, and romantic advice.',
  },
  {
    id: 'tarot',
    name: 'Tarot Readings',
    slug: 'tarot',
    description: 'Experience the ancient wisdom of tarot with skilled readers. Get insights into your past, present, and future through professional tarot card interpretations.',
    icon: '🃏',
    metaTitle: 'Best Tarot Reading Sites 2026 | Top10PsychicReaders',
    metaDescription: 'Find the best online tarot reading platforms. Compare top tarot readers for accurate card interpretations and spiritual guidance.',
  },
  {
    id: 'career',
    name: 'Career & Finance',
    slug: 'career',
    description: 'Navigate your professional path with clarity. Our recommended psychics offer guidance on career decisions, job changes, business ventures, and financial matters.',
    icon: '💼',
    metaTitle: 'Best Psychics for Career Readings 2026 | Top10PsychicReaders',
    metaDescription: 'Discover top psychic platforms for career and finance guidance. Get professional insights on job decisions, business ventures, and financial paths.',
  },
  {
    id: 'astrology',
    name: 'Astrology',
    slug: 'astrology',
    description: 'Unlock the secrets of the stars. Connect with expert astrologers for birth chart readings, horoscope interpretations, and cosmic guidance.',
    icon: '⭐',
    metaTitle: 'Best Astrology Reading Sites 2026 | Top10PsychicReaders',
    metaDescription: 'Find the best online astrology platforms. Compare top astrologers for birth chart readings, horoscopes, and cosmic guidance.',
  },
  {
    id: 'mediumship',
    name: 'Mediumship',
    slug: 'mediumship',
    description: 'Connect with loved ones who have passed. Our vetted mediums provide compassionate readings to help you find closure and receive messages from the other side.',
    icon: '🕊️',
    metaTitle: 'Best Online Mediums 2026 | Top10PsychicReaders',
    metaDescription: 'Discover the best online mediums for spirit communication. Compare trusted platforms for connecting with deceased loved ones.',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}
