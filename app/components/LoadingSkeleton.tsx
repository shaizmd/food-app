import React from 'react'

function LoadingSkeleton() {
  return (
    <>
        <div className="min-h-screen lg:col-span-2 my-4 container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-4 bg-gray-200 rounded w-14 animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-7 bg-gray-200 rounded w-12 animate-pulse"></div>
                      <div className="h-7 bg-gray-200 rounded w-14 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}

export default LoadingSkeleton


