import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPercent, FiTag, FiCalendar, FiGrid, FiBox } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { DiscountContext } from "../../context/DiscountContext";
import LoadingDots from "../LoadingDots";
const BASE_API = import.meta.env.VITE_BASE_API;

function AddDiscountModal({ setShowAddModal }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const { createDiscount, isLoading } = useContext(DiscountContext);
  const appliesTo = watch("appliesTo");
  const [error, setError] = useState(null);
  // Fetch categories and items
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        const res1 = await fetch(`${BASE_API}/api/category/categories`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const res2 = await fetch(`${BASE_API}/api/menu/items`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(await res1.json());
        setItems(await res2.json());
      };

      fetchData();
    }
  }, [token]);

  const onSubmit = async (data) => {
    const result = await createDiscount(data);
    console.log("result", result);
    if (result.res.success) {
      reset();
      setShowAddModal(false);
    } else {
      setError(result.res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl bg-white p-4 rounded-3xl shadow-lg overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            reset();
            setShowAddModal(false);
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl"
        >
          &times;
        </button>

        <span className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
          Create Discount
        </span>
        {/* Card */}
        <div className=" ">
          {error && (
            <p className="text-center text-red-600 bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="space-y-6">
            {/* Discount Type */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiTag /> Discount Type
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs">Required</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiPercent /> Discount Amount
              </label>
              <input
                {...register("amount", { required: true })}
                placeholder="Eg: 10"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs">Required</p>
              )}
            </div>

            {/* Applies To */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiGrid /> Applies To
              </label>
              <select
                {...register("appliesTo")}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Entire Menu</option>
                <option value="category">Specific Category</option>
                <option value="item">Specific Item</option>
              </select>
            </div>

            {/* Conditional Category */}
            {appliesTo === "category" && (
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiGrid /> Select Category
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Select Category --</option>
                  {categories?.categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs">Required</p>
                )}
              </div>
            )}

            {/* Conditional Item */}
            {appliesTo === "item" && (
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiBox /> Select Item
                </label>
                <select
                  {...register("item", { required: true })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Select Item --</option>
                  {items?.menuItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.item && (
                  <p className="text-red-500 text-xs">Required</p>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiCalendar /> Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiCalendar /> End Date
                </label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 text-white rounded-4 text-lg font-semibold hover:bg-emerald-700 transition"
            >
              {isLoading ? (
                <div className="">
                  Creating
                  <LoadingDots size={6} color="#fff" speed={1} />
                </div>
              ) : (
                " Create Discount"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDiscountModal;
