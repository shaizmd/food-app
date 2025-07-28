"use client"
import React, { use, useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, MapPin, Clock, Soup } from 'lucide-react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useStore } from '@/store/store';

interface NavbarProps {
  cartItemCount?: number;
  userLoggedIn?: boolean;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = useStore((state) => state.cart.length),
  userLoggedIn = false,
  onSearch,
  onCartClick,
  onProfileClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/admin/menu' },
    { name: 'Admin', href: '/admin/menu/create' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */} 
<Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl"><Soup className="h-5 w-5" /></span>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-800">FoodHub</span>
            </div>
          </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-black hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pizzas, burgers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-black  hover:text-red-500 transition-colors duration-200 cursor-pointer"
            >
              <Link href="/cart" className="flex items-center">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </button>

            {/* User Profile */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-red-500 focus:outline-none focus:text-red-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {/* close this immediately after a button click */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile cart and profile */}
            <div className="flex items-center justify-between px-3 py-2">
              <Link href="/cart" className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
              <button
                onClick={onCartClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemCount})</span>
              </button>
              </Link>
              <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;