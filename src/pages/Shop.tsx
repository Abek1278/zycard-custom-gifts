import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CategoryTabs from '@/components/shop/CategoryTabs';
import { products, Category, getProductsByCategory } from '@/lib/products';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>(categoryParam || 'all');

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: Category | 'all') => {
    setActiveCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const displayedProducts = activeCategory === 'all' 
    ? products 
    : getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Collection
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our complete range of customizable gifts. Each product is made with love and care.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-10">
            <CategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>

          {/* Products Grid */}
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>

          {displayedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
