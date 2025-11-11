import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { CategoryContext } from "../../context/CategoryContext";

function AddCategoryModal({
  setShowCatAddModal,
  editingCategory,
  setEditingCategory,
}) {
  // ✅ Capitalize first letter
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: editingCategory
      ? {
          name: editingCategory.name,
          isActive: editingCategory.isActive,
        }
      : {
          name: "",
          isActive: true,
        },
  });

  const { addCategory, getAllCategories, updateCategory } =
    useContext(CategoryContext);

  const onCatSubmit = async (data) => {
    let result;
    data.name = formatName(data.name);

    if (editingCategory) {
      result = await updateCategory(editingCategory._id, data);
    } else {
      result = await addCategory(data);
    }

    if (result.success) {
      await getAllCategories();
      reset();
      setEditingCategory(null);
      setShowCatAddModal(false);
    } else {
      setError("root", { message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white p-6 rounded-3xl shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setShowCatAddModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>

        <form
          onSubmit={handleSubmit(onCatSubmit)}
          className="space-y-5 text-gray-700"
        >
          {errors.root && (
            <div className="mb-2 text-red-600 text-sm text-center bg-red-50 py-3 rounded-3 border-2 border-red-700">
              {errors.root.message}
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block font-medium mb-2">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              {...register("name", { required: "Category name is required" })}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3">
            <label className="font-medium">Active</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition-all duration-300"></div>
              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-3 transition-all duration-300 shadow-lg"
          >
            <FaCheck />
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;
