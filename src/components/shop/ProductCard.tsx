import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="group card-premium p-3 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Tags */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {product.tags?.includes('bestseller') && (
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Bestseller
                </span>
              )}
              {product.originalPrice && (
                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-md">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Quick Add Button - Shows on Hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button
                variant="hero"
                size="sm"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="mt-auto flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
