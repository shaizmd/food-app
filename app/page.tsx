"use client"
import React from 'react';
import { Search, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LandingPageProps {
  onSearch?: (query: string) => void;
  onLocationClick?: () => void;
  onOrderNow?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onSearch,
  onLocationClick,
  onOrderNow
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularCategories = [
    { name: 'Pizza', emoji: '🍕', count: '50+ restaurants' },
    { name: 'Burgers', emoji: '🍔', count: '35+ restaurants' },
    { name: 'Asian', emoji: '🍜', count: '40+ restaurants' },
    { name: 'Desserts', emoji: '🍰', count: '25+ restaurants' }
  ];

  const userReviews = [
    { 
      name: 'Priya Sharma', 
      rating: 3, 
      review: 'Amazing service! Food arrived hot and fresh in just 20 minutes. The variety of restaurants is incredible.',
      location: 'Koramangala',
      avatar: '👩'
    },
    { 
      name: 'Rahul Kumar', 
      rating: 5, 
      review: 'Best food delivery app I\'ve used. Great prices and the tracking feature is so helpful. Highly recommend!',
      location: 'Indiranagar',
      avatar: '👨'
    },
    { 
      name: 'Sneha Patel', 
      rating: 4, 
      review: 'Love the app interface and quick delivery. Customer support is very responsive. Will definitely order again.',
      location: 'Whitefield',
      avatar: '👩‍💼'
    }
  ];

  return (
    <>
    <main className="bg-white">
      {/* Hero Section with Side Image */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Main Heading */}
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-black">
                  Delicious food,
                  <span className="text-green-500 text-shadow-2xl"> delivered fast</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                  Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
                </p>
              </div>

              {/* Location & Search */}
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5 text-black" />
                  <button 
                    onClick={onLocationClick}
                    className="text-sm hover:text-gray-800 transition-colors duration-200"
                  >
                    Delivering to: Bengaluru, Karnataka
                  </button>
                </div>

                {/* Hero Search Bar */}
                <div className="max-w-md mx-auto lg:mx-0">
                  {/* <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for restaurants or food..."
                      className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-full bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-100 shadow-lg"
                    />
                  </div> */}
                  <Link href="/menu">
                    <button
                      className="mt-4 w-full bg-green-500 hover:bg-green-300 text-white py-4 px-8 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg cursor-pointer"
                    >
                      View Menu
                    </button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">25 min</div>
                  <div className="text-sm text-gray-600">Avg Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            {/* Right Image */}
            <div className="lg:order-last">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Delicious food spread"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userReviews.map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl border border-gray-200">
                    {review.avatar}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-black">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Experience our Cuisine?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Want to taste the best food in town? Order now and enjoy exclusive offers!
          </p>
          <button
            className="inline-flex items-center bg-green-500 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Order Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </main>
    </>
  );
};

export default LandingPage;
