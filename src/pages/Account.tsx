import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, MapPin, LogIn, Mail, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type TabId = 'orders' | 'profile' | 'addresses';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

// Mock data for UI demonstration
const mockOrders = [
  {
    id: 'ORD001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 1299,
    items: [
      { name: 'Custom Photo T-Shirt', qty: 1, price: 599 },
      { name: 'Magic Color Change Mug', qty: 2, price: 350 },
    ],
  },
  {
    id: 'ORD002',
    date: '2024-01-20',
    status: 'Processing',
    total: 899,
    items: [
      { name: 'Sequin Magic Pillow', qty: 1, price: 899 },
    ],
  },
];

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(tabParam || 'orders');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            My Account
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card-premium p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Login Prompt */}
              <div className="card-premium p-4 mt-4">
                <div className="text-center">
                  <LogIn className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in for a personalized experience
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Your Orders
                  </h2>
                  
                  {mockOrders.map((order) => (
                    <div key={order.id} className="card-premium p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                        <div>
                          <p className="font-semibold text-foreground">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.name} x{item.qty}
                            </span>
                            <span className="font-medium">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between mt-4 pt-4 border-t border-border">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">₹{order.total}</span>
                      </div>
                    </div>
                  ))}

                  {mockOrders.length === 0 && (
                    <div className="card-premium p-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">When you place orders, they'll appear here.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card-premium p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Profile Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </Label>
                      <Input
                        id="profile-name"
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="profile-phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </Label>
                      <Input
                        id="profile-phone"
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button variant="premium" className="mt-6">
                    Save Changes
                  </Button>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Saved Addresses
                    </h2>
                    <Button variant="outline" size="sm">
                      Add New
                    </Button>
                  </div>

                  <div className="card-premium p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Home</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          123 Main Street, Apartment 4B<br />
                          Mumbai, Maharashtra 400001<br />
                          Phone: +91 98765 43210
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>

                  <div className="card-premium p-12 text-center border-dashed">
                    <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Add a new address for faster checkout</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Add Address
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
