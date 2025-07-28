"use client"
import React, { useEffect } from 'react';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Image, ImageKitProvider } from '@imagekit/next';
import { useStore } from '@/store/store';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
   <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.05]">
 {/* adding pop animation on hover */}
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
            <Image
              src={item.image}
              className="w-full h-full object-cover"
              width={500}
              height={500}
              alt={item.name}
            />
          </ImageKitProvider>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black border border-gray-300">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-black text-bold">{item.name}</h3>
          <div className="flex items-center text-black font-bold text-lg ml-2">
            <span className="mr-1">$</span>
            <span>{item.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {item.description}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(item)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fixed: Added leading slash to API endpoint
      const response = await fetch('/api/menu-items');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Fetched menu items:', data); // Debug log
      setMenuItems(data);
    } catch (err: unknown) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

 const handleAddToCart = useStore((state) => state.addToCart);

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-left mb-8 text-gray-800">Our Menu</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 rounded-lg p-4">
                <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-300 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button 
            onClick={fetchMenuItems}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg">No menu items found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-left mb-8 text-gray-800">Our Menu</h1>
        
        {/* Grid layout for multiple cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem.id}
              item={menuItem}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;