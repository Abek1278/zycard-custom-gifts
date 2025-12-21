import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Truck, Shield, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { getProductById, getProductsByCategory, formatPrice } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </motion.div>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.tags?.includes('bestseller') && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Bestseller
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 bg-destructive text-destructive-foreground text-sm font-semibold rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>High-quality premium materials</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom printed with your design</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Ready in 2-3 business days</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  variant="premium" 
                  size="xl" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Link to="/cart" className="flex-1">
                  <Button variant="outline" size="xl" className="w-full" onClick={handleAddToCart}>
                    Buy Now
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  Free shipping over ₹999
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  7-day easy returns
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                You may also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
