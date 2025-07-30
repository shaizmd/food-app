"use client"
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Soup } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = () => {
    if (email.trim()) {
      // For now, just show an alert
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewsletterSubmit();
    }
  };

  const quickLinks = [
    { name: 'About', href: '#' },
    { name: 'Menu', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Support', href: '#' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Soup className="h-4 w-4 text-black" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">FoodHub</span>
            </div>
            <p className="text-gray-600 text-sm">
              Delicious food delivered fresh to your doorstep.
            </p>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-3 w-3 mr-2 text-green-500" />
                <span>Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-3 w-3 mr-2 text-green-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-3 w-3 mr-2 text-green-500" />
                <span>support@foodhub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-green-500 text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Stay Connected</h3>

            {/* Newsletter Signup */}
            <div>
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className="w-full pr-28 pl-3 py-2 text-sm border border-gray-500 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="absolute h-full right-0 top-0 bottom-1 px-4 bg-green-500 mr-0 hover:bg-green-300 text-white rounded-r-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2025 FoodHub. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-green-500 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-green-500 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;