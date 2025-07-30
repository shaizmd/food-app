"use client";
import React, { useState, useActionState, useEffect, Suspense } from 'react';
import { X, Plus, DollarSign, Tag, FileText, Edit } from 'lucide-react';
import UploadExample from '@/app/components/UploadImage';
import { createMenuItem, updateMenuItem } from '@/actions/menu';
import { useSearchParams, useRouter } from 'next/navigation';

// Update the FormData interface to match server action expectations
interface FormState {
  errors?: {
    name?: string[];
    description?: string[];
    category?: string[];
    price?: string[];
    image?: string[];
    formError?: string[];
  };
  success?: boolean;
  data?: any;
  message?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
}

const AddMenuItemForm: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  // Initialize useActionState with the create action only
  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    createMenuItem,
    { errors: {} }
  );

  // Fetch item data if editing
  useEffect(() => {
    const fetchItemForEdit = async () => {
      if (editId) {
        setIsEditing(true);
        setLoadingItem(true);
        try {
          const response = await fetch(`/api/menu-items/${editId}`);
          if (response.ok) {
            const item = await response.json();
            setEditingItem(item);
            setImageUrl(item.image || '');
          } else {
            console.error('Failed to fetch menu item for editing');
            router.push('/admin/menu/create'); // Redirect if item not found
          }
        } catch (error) {
          console.error('Error fetching menu item:', error);
          router.push('/admin/menu/create');
        } finally {
          setLoadingItem(false);
        }
      }
    };

    fetchItemForEdit();
  }, [editId, router]);

  const handleAction = async (formData: FormData) => {
    formData.append('image', imageUrl);
    
    if (isEditing && editingItem) {
      // Handle update separately
      try {
        const result = await updateMenuItem(editingItem.id, formData);
        if (result.success) {
          router.push('/admin/menu');
        }
      } catch (error) {
        console.error('Error updating menu item:', error);
      }
    } else {
      // Use the form action for create
      formAction(formData);
    }
  };

  // Reset form when switching from edit to create
  const handleNewItem = () => {
    router.push('/admin/menu/create');
    setIsEditing(false);
    setEditingItem(null);
    setImageUrl('');
  };

  const categories = [
    'Appetizers',
    'Main Course',
    'Pizza',
    'Burgers',
    'Desserts',
    'Beverages',
    'Salads',
    'Pasta',
    'Seafood',
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 text-black" />
              <span className="font-semibold text-black">
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl border border-t-0 border-gray-200 p-6">
          {/* Edit Mode Indicator */}
          {isEditing && editingItem && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <Edit className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">Editing: {editingItem.name}</span>
              </div>
              <button
                onClick={handleNewItem}
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Item
              </button>
            </div>
          )}

          {/* Loading State */}
          {loadingItem && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-gray-600">Loading menu item...</p>
            </div>
          )}

          {/* Success Message */}
          {formState.success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 font-medium">{formState.message}</p>
            </div>
          )}

          {/* Form Error */}
          {formState.errors?.formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              {formState.errors.formError.map((error, index) => (
                <p key={index} className="text-red-800 font-medium">{error}</p>
              ))}
            </div>
          )}

            <form action={handleAction} className="space-y-4">
              {/* Item Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="flex items-center text-sm font-bold text-gray-800">
                  <FileText className="w-4 h-4 mr-2 text-gray-600" />
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  placeholder="e.g. Margherita Pizza"
                  className={`w-full px-3 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 ${
                    formState.errors?.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-black hover:border-gray-300'
                  }`}
                />
                {formState.errors?.name && (
                  <div className="space-y-1">
                    {formState.errors.name.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="description" className="flex items-center text-sm font-bold text-gray-800">
                  <FileText className="w-4 h-4 mr-2 text-gray-600" />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  placeholder="Brief description of the item"
                  rows={3}
                  className={`w-full px-3 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 resize-none ${
                    formState.errors?.description 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-black hover:border-gray-300'
                  }`}
                />
                {formState.errors?.description && (
                  <div className="space-y-1">
                    {formState.errors.description.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="price" className="flex items-center text-sm font-bold text-gray-800">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    defaultValue={editingItem?.price || ''}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 ${
                      formState.errors?.price 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-black hover:border-gray-300'
                    }`}
                  />
                  {formState.errors?.price && (
                    <div className="space-y-1">
                      {formState.errors.price.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="category" className="flex items-center text-sm font-bold text-gray-800">
                    <Tag className="w-4 h-4 mr-2 text-gray-600" />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingItem?.category || ''}
                    className={`w-full px-3 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 appearance-none cursor-pointer ${
                      formState.errors?.category 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-black hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formState.errors?.category && (
                    <div className="space-y-1">
                      {formState.errors.category.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL Input (temporary until file upload is implemented) */}
            <UploadExample
              setImageUrl={setImageUrl}
            />

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>
                      {isPending 
                        ? (isEditing ? 'Updating Menu Item...' : 'Adding Menu Item...') 
                        : (isEditing ? 'Update Menu Item' : 'Add Menu Item')
                      }
                    </span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AddMenuItemForm />
    </Suspense>
  );
}