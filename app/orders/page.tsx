import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function MyOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-800 mb-2">Authentication Required</h1>
          <p className="text-gray-500">Please sign in to view your orders</p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        
      <div className="max-w-3xl mx-auto px-4">
      <h1 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 px-2 sm:px-0"> My Orders</h1>
          
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start browsing our menu to place your first order</p>
            <a 
              href="/menu" 
              className="inline-flex items-center px-5 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-gray-900">${order.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map(({ menuItem, quantity }) => (
                      <div key={menuItem.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {menuItem.image && (
                            <img
                              src={menuItem.image}
                              alt={menuItem.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{menuItem.name}</p>
                            <p className="text-xs text-gray-500">{menuItem.category}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium text-gray-900">×{quantity}</p>
                          <p className="text-gray-500">${menuItem.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
