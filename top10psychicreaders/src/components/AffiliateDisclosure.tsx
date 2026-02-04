import Link from 'next/link';

interface AffiliateDisclosureProps {
  variant?: 'banner' | 'inline';
}

export default function AffiliateDisclosure({ variant = 'banner' }: AffiliateDisclosureProps) {
  if (variant === 'inline') {
    return (
      <p className="text-gray-500 text-sm">
        <strong>Disclosure:</strong> We may earn a commission when you click links on our site.{' '}
        <Link href="/affiliate-disclosure" className="text-purple-600 hover:underline">
          Learn more
        </Link>
      </p>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 mb-6">
      <p className="text-purple-800 text-sm">
        <strong>Affiliate Disclosure:</strong> We may receive compensation when you click links and make purchases.
        This does not affect our rankings, which are based on independent research.{' '}
        <Link href="/affiliate-disclosure" className="underline hover:no-underline">
          Learn more
        </Link>
      </p>
    </div>
  );
}
