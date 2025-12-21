import { motion } from 'framer-motion';
import { categories, Category } from '@/lib/products';

interface CategoryTabsProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const allCategories = [
    { id: 'all' as const, name: 'All Products', icon: '✨' },
    ...categories,
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max px-4 md:px-0 md:justify-center">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="relative px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
          >
            <span
              className={`relative z-10 flex items-center gap-2 transition-colors ${
                activeCategory === category.id
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.name}
            </span>
            
            {activeCategory === category.id && (
              <motion.div
                layoutId="category-tab-bg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
