import React, { useState } from "react";
import {
  FaCog,
  FaUser,
  FaStore,
  FaBell,
  FaLock,
  FaClock,
  FaLanguage,
  FaSave,
  FaImage,
} from "react-icons/fa";

function AdminSettings() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "DigiThali Restaurant",
    phone: "+91 98765 43210",
    email: "contact@digithali.com",
    address: "123 Food Street, Bangalore",
    taxRate: "5",
    currency: "INR",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    reviewNotifications: true,
    stockAlerts: true,
    emailNotifications: false,
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "09:00", close: "22:00", isOpen: true },
    tuesday: { open: "09:00", close: "22:00", isOpen: true },
    wednesday: { open: "09:00", close: "22:00", isOpen: true },
    thursday: { open: "09:00", close: "22:00", isOpen: true },
    friday: { open: "09:00", close: "23:00", isOpen: true },
    saturday: { open: "09:00", close: "23:00", isOpen: true },
    sunday: { open: "10:00", close: "22:00", isOpen: true },
  });

  const handleSaveSettings = () => {
    // Handle saving settings
    alert("Settings saved successfully!");
  };

  return (
    <div className="w-full p-2 xs:p-3 sm:p-4 md:p-6 bg-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-3 xs:mb-4 sm:mb-6">
          <FaCog className="text-emerald-600 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 flex-shrink-0" />
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-0 ms-2 text-gray-800">
            Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {/* Restaurant Information */}
          <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 xs:mb-3 sm:mb-4">
              <FaStore className="text-emerald-600 w-4 xs:w-4 sm:w-5 h-4 xs:h-4 sm:h-5 mr-2 flex-shrink-0" />
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 truncate">
                Restaurant Information
              </h3>
            </div>
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base rounded-md xs:rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={restaurantInfo.phone}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={restaurantInfo.address}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 xs:mb-3 sm:mb-4">
              <FaBell className="text-emerald-600 w-4 xs:w-4 sm:w-5 h-4 xs:h-4 sm:h-5 mr-2 flex-shrink-0" />
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 truncate">
                Notification Preferences
              </h3>
            </div>
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-2">
                <label className="text-xs xs:text-sm font-medium text-gray-700">
                  Order Notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        orderNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Review Notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.reviewNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        reviewNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Low Stock Alerts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.stockAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        stockAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 xs:mb-3 sm:mb-4">
              <FaCog className="text-emerald-600 w-4 xs:w-4 sm:w-5 h-4 xs:h-4 sm:h-5 mr-2 flex-shrink-0" />
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 truncate">
                Additional Settings
              </h3>
            </div>
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={restaurantInfo.taxRate}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      taxRate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={restaurantInfo.currency}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 xs:mt-5 sm:mt-6 flex justify-center sm:justify-end px-3 xs:px-4 sm:px-0">
          <button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 xs:py-2.5 bg-emerald-600 text-white text-xs xs:text-sm sm:text-base rounded-md xs:rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <FaSave className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
