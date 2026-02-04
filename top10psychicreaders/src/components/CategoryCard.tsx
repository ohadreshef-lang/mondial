import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
    >
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
      <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
        View Top Readers
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
