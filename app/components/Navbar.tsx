"use client"
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Soup } from 'lucide-react';
import { SignedIn, UserButton, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useStore } from '@/store/store';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemCount = useStore((state) => state.cart.length);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/admin/menu' },
    { name: 'Orders', href: '/orders' },
    { name: 'Admin', href: '/admin/menu/create' }

  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Soup className="h-5 w-5 text-black" />
            </div>
            <span className="text-2xl font-bold text-gray-800">FoodHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
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
            <SignedIn>
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-red-500 transition-colors duration-200">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <button 
                  className="relative p-2 text-gray-700 hover:text-red-500 transition-colors duration-200"
                  onClick={() => sessionStorage.setItem('redirectAfterSignIn', '/cart')}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </button>
              </SignInButton>
            </SignedOut>

            {/* User Profile */}
            <SignedIn>
              <div className="relative">
                <div className="size-8 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-red-500 transition-all duration-200">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: {
                          height: "100%",
                          width: "100%"
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <button className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer'>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-500 focus:outline-none focus:text-red-500 p-2"
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
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile cart and profile */}
            <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200 mt-3 pt-3">
              <SignedIn>
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cartItemCount})</span>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                    onClick={() => {
                      sessionStorage.setItem('redirectAfterSignIn', '/cart');
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cartItemCount})</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <div className="flex items-center space-x-2">
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer'>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;