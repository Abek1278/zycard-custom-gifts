import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold">
              <span className="text-background">Zy</span>
              <span className="text-primary">card</span>
            </Link>
            <p className="mt-4 text-background/70 text-sm">
              Premium custom gifts that make every moment special. Quality prints, endless memories.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/shop?category=tshirts" className="hover:text-primary transition-colors">T-Shirts</Link>
              </li>
              <li>
                <Link to="/shop?category=mugs" className="hover:text-primary transition-colors">Mugs</Link>
              </li>
              <li>
                <Link to="/shop?category=pillows" className="hover:text-primary transition-colors">Pillows</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/account" className="hover:text-primary transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Returns Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@zycard.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Zycard. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
