export type Category = 'tshirts' | 'mugs' | 'pillows';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags?: string[];
}

export const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'tshirts', name: 'T-Shirts', icon: '👕' },
  { id: 'mugs', name: 'Mugs', icon: '☕' },
  { id: 'pillows', name: 'Pillows', icon: '🛋️' },
];

export const products: Product[] = [
  // T-Shirts
  {
    id: 'tshirt-1',
    name: 'Custom Photo T-Shirt',
    description: 'Premium cotton t-shirt with your custom photo printed in vivid colors. Perfect for gifts or personal wear.',
    price: 599,
    originalPrice: 799,
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    tags: ['bestseller', 'customizable'],
  },
  {
    id: 'tshirt-2',
    name: 'Text Print T-Shirt',
    description: 'Add your favorite quote, name, or message. High-quality print that lasts.',
    price: 499,
    originalPrice: 649,
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    tags: ['popular'],
  },
  {
    id: 'tshirt-3',
    name: 'Graphic Art T-Shirt',
    description: 'Upload your artwork or choose from our designs. Premium fabric with soft finish.',
    price: 699,
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop',
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: 'tshirt-4',
    name: 'Couple Photo T-Shirt',
    description: 'Matching t-shirts for couples with your special photo. Perfect anniversary gift.',
    price: 1099,
    originalPrice: 1399,
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop',
    rating: 4.9,
    reviews: 312,
    inStock: true,
    tags: ['bestseller', 'gift'],
  },

  // Mugs
  {
    id: 'mug-1',
    name: 'Magic Color Change Mug',
    description: 'Your photo appears when hot liquid is poured! A magical gift experience.',
    price: 449,
    originalPrice: 599,
    category: 'mugs',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    rating: 4.9,
    reviews: 456,
    inStock: true,
    tags: ['bestseller', 'magic'],
  },
  {
    id: 'mug-2',
    name: 'Classic Photo Mug',
    description: 'Premium ceramic mug with your photo printed in stunning quality. Dishwasher safe.',
    price: 349,
    category: 'mugs',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&h=600&fit=crop',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    tags: ['popular'],
  },
  {
    id: 'mug-3',
    name: 'Quote & Text Mug',
    description: 'Personalize with your favorite quote, name, or special message.',
    price: 299,
    category: 'mugs',
    image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&h=600&fit=crop',
    rating: 4.5,
    reviews: 167,
    inStock: true,
  },
  {
    id: 'mug-4',
    name: 'Anniversary Special Mug',
    description: 'Celebrate your special moments with a custom anniversary mug.',
    price: 499,
    originalPrice: 649,
    category: 'mugs',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
    rating: 4.8,
    reviews: 289,
    inStock: true,
    tags: ['gift'],
  },

  // Pillows
  {
    id: 'pillow-1',
    name: 'Photo Print Pillow',
    description: 'Soft, huggable pillow with your favorite photo. Perfect home décor.',
    price: 799,
    originalPrice: 999,
    category: 'pillows',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
    rating: 4.7,
    reviews: 178,
    inStock: true,
    tags: ['bestseller'],
  },
  {
    id: 'pillow-2',
    name: 'Sequin Magic Pillow',
    description: 'Reveal your photo by swiping the sequins! Fun interactive gift.',
    price: 899,
    originalPrice: 1199,
    category: 'pillows',
    image: 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&h=600&fit=crop',
    rating: 4.9,
    reviews: 321,
    inStock: true,
    tags: ['bestseller', 'magic'],
  },
  {
    id: 'pillow-3',
    name: 'Heart Shape Pillow',
    description: 'Express love with a heart-shaped photo pillow. Ideal for couples.',
    price: 699,
    category: 'pillows',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    rating: 4.6,
    reviews: 145,
    inStock: true,
    tags: ['gift'],
  },
  {
    id: 'pillow-4',
    name: 'Custom Text Pillow',
    description: 'Add names, dates, or messages to create a unique decorative pillow.',
    price: 649,
    category: 'pillows',
    image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=600&h=600&fit=crop',
    rating: 4.5,
    reviews: 98,
    inStock: true,
  },
];

export const getProductsByCategory = (category: Category): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
