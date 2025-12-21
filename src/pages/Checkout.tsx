import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, Check, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';
import { toast } from 'sonner';

type PaymentMethod = 'cod' | 'razorpay';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'cod') {
        // Simulate COD order
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Order placed successfully!', {
          description: 'You will pay on delivery.',
        });
        clearCart();
        navigate('/account?tab=orders');
      } else {
        // Razorpay placeholder - would need backend integration
        toast.info('Razorpay integration coming soon!', {
          description: 'Please use Cash on Delivery for now.',
        });
        setPaymentMethod('cod');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
          >
            Checkout
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Shipping Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 space-y-6"
              >
                {/* Shipping Details */}
                <div className="card-premium p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Shipping Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address, apartment, etc."
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card-premium p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <Banknote className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                      <Check className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-primary' : 'text-transparent'}`} />
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'razorpay' ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Card / UPI / Net Banking</p>
                        <p className="text-sm text-muted-foreground">Pay securely via Razorpay</p>
                      </div>
                      <Check className={`h-5 w-5 ${paymentMethod === 'razorpay' ? 'text-primary' : 'text-transparent'}`} />
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="card-premium p-6 sticky top-24">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-primary">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-lg">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="premium"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Place Order • ${formatPrice(grandTotal)}`
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Secure checkout
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
