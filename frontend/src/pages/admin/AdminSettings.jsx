import React, { useContext, useEffect, useState } from "react";
import {
  FaCog,
  FaUser,
  FaStore,
  FaSave,
  FaUsers,
  FaCrown,
} from "react-icons/fa";
import { SettingContext } from "../../context/SettingsContext";

export default function AdminSettings() {
  const { settings, updateSettings, createUser, updateSubscription } =
    useContext(SettingContext);

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "DigiThali Restaurant",
    phoneNumber: "+91 XXXXX-78452",
    address: "123 Food Street, Bangalore",
    taxRate: 5,
    currency: "INR",
  });

  const [userInfo, setUserInfo] = useState({
    name: "Bhaskar Chauhan",
    email: "bhaskarchauhan748@gmail.com",
    phoneNumber: "+91 XXXXX-12345",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [subscription, setSubscription] = useState({
    plan: "free",
    expiresAt: null,
  });

  // Load from settings context
  useEffect(() => {
    if (settings?.restaurant) {
      setRestaurantInfo({
        name: settings.restaurant.name || "Unnamed Restaurant",
        phoneNumber: settings.restaurant.phoneNumber || "N/A",
        address: settings.restaurant.address || "Not Provided",
        taxRate: settings.restaurant.taxRate || 0,
        currency: settings.restaurant.currency || "INR",
      });
      setSubscription(settings.restaurant.subscription || { plan: "free" });
    }

    if (settings?.user) {
      setUserInfo({
        name: settings.user.name || "Unknown User",
        email: settings.user.email || "N/A",
        phoneNumber: settings.user.phoneNumber || "N/A",
      });
    }
  }, [settings]);

  // ✅ Save settings
  const handleSaveSettings = async () => {
    const res = await updateSettings(restaurantInfo, userInfo);
    if (res.success) {
      alert("✅ Settings updated successfully!");
    } else {
      alert("❌ Failed to update settings: " + res.message);
    }
  };

  // ✅ Create staff
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password)
      return alert("Please fill all fields");

    const res = await createUser(newUser);
    if (res.success) {
      alert("✅ Staff user created!");
      setNewUser({ name: "", email: "", password: "", role: "staff" });
    } else {
      alert("❌ Failed to create user: " + res.message);
    }
  };

  // ✅ Update subscription
  const handleUpgrade = async (plan) => {
    const res = await updateSubscription(plan);
    if (res.success) {
      alert("✅ Subscription updated!");
      setSubscription(res.subscription);
    } else {
      alert("❌ Failed to update subscription");
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaCog className="text-emerald-600 w-6 h-6 sm:w-8 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-semibold ms-2 text-gray-800">
            Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaStore className="text-emerald-600 w-5 h-5 mr-2" />
              <div className="text-lg font-semibold text-gray-800">
                Restaurant Information
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Restaurant Name"
                value={restaurantInfo.name}
                onChange={(e) =>
                  setRestaurantInfo({ ...restaurantInfo, name: e.target.value })
                }
              />
              <InputField
                label="Address"
                type="textarea"
                value={restaurantInfo.address}
                onChange={(e) =>
                  setRestaurantInfo({
                    ...restaurantInfo,
                    address: e.target.value,
                  })
                }
              />
              <InputField
                label="Default Tax Rate (%)"
                type="number"
                value={restaurantInfo.taxRate}
                onChange={(e) =>
                  setRestaurantInfo({
                    ...restaurantInfo,
                    taxRate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaUser className="text-emerald-600 w-5 h-5 mr-2" />
              <div className="text-lg font-semibold text-gray-800">
                User Information
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Name"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
              />
              <InputField
                label="Email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
              <InputField
                label="Phone Number"
                value={userInfo.phoneNumber}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>

          {/* Add New User */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <div className="flex items-center mb-4">
              <FaUsers className="text-emerald-600 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Add Staff User
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <InputField
                label="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <InputField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreateUser}
                className="bg-emerald-600 text-white px-5 py-2 rounded-4 hover:bg-emerald-700 transition-all"
              >
                Create User
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <div className="flex items-center mb-4">
              <FaCrown className="text-yellow-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Subscription Plan
              </h3>
            </div>

            <p className="text-gray-600 mb-2">
              Current Plan:{" "}
              <span className="font-semibold capitalize text-emerald-600">
                {subscription.plan}
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              {["free", "pro", "enterprise"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleUpgrade(p)}
                  className={`px-4 py-2 rounded-lg border ${
                    subscription.plan === p
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-4 hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <FaSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ Reusable Input Components */
function InputField({ label, value, onChange, type = "text" }) {
  const base =
    "w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          rows="2"
          value={value}
          onChange={onChange}
          className={base}
        ></textarea>
      ) : (
        <input type={type} value={value} onChange={onChange} className={base} />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
