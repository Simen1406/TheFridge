import React, { useState, useEffect } from 'react';

/*
the next thing to do is create the api endpoints, connect it to frontend and then visualize
data from backend here instead of the mock data below
*/

interface FoodItem {
  id: number;
  name: string;
  qty: number;
  barcode: string;
  added_date: string;
  category: string | null;
}

const FoodInventory: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  // Mock data - set immediately without loading states
  useEffect(() => {
    const mockData: FoodItem[] = [
      {
        id: 1,
        name: "Milk",
        qty: 1,
        barcode: "123456789",
        added_date: "2025-09-12T10:30:00",
        category: "Dairy"
      },
      {
        id: 2,
        name: "Bread",
        qty: 1,
        barcode: "987654321",
        added_date: "2025-09-11T15:20:00",
        category: "Bakery"
      },
      {
        id: 3,
        name: "Apples",
        qty: 1,
        barcode: "456789123",
        added_date: "2025-09-10T09:15:00",
        category: "Fruit"
      }
    ];
    setFoodItems(mockData);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string | null) => {
    const colors: { [key: string]: string } = {
      'Dairy': 'bg-blue-100 text-blue-800',
      'Bakery': 'bg-orange-100 text-orange-800',
      'Fruit': 'bg-green-100 text-green-800',
      'Vegetable': 'bg-green-100 text-green-800',
      'Meat': 'bg-red-100 text-red-800',
      'Beverage': 'bg-purple-100 text-purple-800',
      'Grain': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Inventory</h1>
          <p className="text-gray-600">Manage your food items and track expiration dates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{foodItems.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quantity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {foodItems.reduce((sum, item) => sum + item.qty, 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(foodItems.map(item => item.category).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Food Items</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foodItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.qty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{item.barcode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(item.added_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodInventory;