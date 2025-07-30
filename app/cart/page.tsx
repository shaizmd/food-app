"use client";
import React from "react";
import { Plus, Minus, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";

const CartPage = () => {
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useStore();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems: cart }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url; // Redirect to Stripe checkout
                } else {
                    throw new Error('No checkout URL received');
                }
            } else {
                // Try to parse error response
                let errorMessage = 'Failed to initiate checkout. Please try again.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                }
                
                console.error('Checkout error:', errorMessage);
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please check your connection and try again.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-2 sm:px-4">
                {cart.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-4">
                        <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-base sm:text-lg font-medium text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400 mt-1">Add some items to get started</p>
                        <Link href="/menu">
                            <button className="mt-4 sm:mt-6 bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                Browse Menu
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 px-2 sm:px-0">Your Cart</h1>
                        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 order-2 lg:order-1">
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Cart Items ({cart.length})</h2>
                                    </div>

                                    {/* Mobile Card Layout */}
                                    <div className="block sm:hidden">
                                        {cart.map((item) => (
                                            <div key={item.id} className="border-b border-gray-200 last:border-b-0 p-4">
                                                <div className="flex items-start space-x-3">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                                            <span className="text-gray-500 text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {item.category}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 ml-2 flex-shrink-0"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-sm font-medium text-black">
                                                                ${item.price.toFixed(2)}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => decrementQuantity(item.id)}
                                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                                <span className="w-6 text-center text-sm font-medium">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => incrementQuantity(item.id)}
                                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table Layout */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full">
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {cart.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-4">
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                                        <span className="text-gray-500 text-xs">No Image</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {item.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {item.category}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-black">
                                                                ${item.price.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => decrementQuantity(item.id)}
                                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-medium">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => incrementQuantity(item.id)}
                                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-black">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1 order-1 lg:order-2">
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 mx-2 sm:mx-0 lg:sticky lg:top-8">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax (8%)</span>
                                            <span className="font-medium">${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>Total</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-4 cursor-pointer" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </button>

                                    <div className="text-center">
                                        <Link href="/menu">
                                            <button className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                                                Back to Menu
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;