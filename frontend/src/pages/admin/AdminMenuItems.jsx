import { useContext, useEffect, useState } from "react";
import { FaUpload, FaCheck, FaEdit, FaTrash, FaUtensils } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import { MdRestaurantMenu } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MenuContext } from "../../context/MenuContext";
import Loader from "../../components/Loader";
import { AuthContext } from "../../context/AuthContext";
import SkeletonLoader from "../../components/SkeletonLoader";

const AdminMenuItems = () => {
  const { token } = useContext(AuthContext);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatAddModal, setShowCatAddModel] = useState(false);
  const {
    addCategory,
    getAllCategories,
    categories,
    isLoading,
    addMenuItem,
    getAllMenuItems,
    updateMenuItem,
    handleDelete,
    menuItems,
    handleDeleteCategory,
  } = useContext(MenuContext);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Image Upload
  const watchImage = watch("image");
  // Preview selected image
  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    if (editingItem) {
      // Update existing - pass raw data, not FormData
      const result = await updateMenuItem(editingItem._id, data);
      if (result.success) {
        reset();
        setEditingItem(null);
        setShowAddModal(false);
        setImagePreview(null);
      } else {
        setError("root", { message: result.message });
      }
    } else {
      const result = await addMenuItem(data);
      if (result.success) {
        reset();
        setImagePreview(null);
        setShowAddModal(false);
        await getAllMenuItems();
      }
      if (!result.success) {
        setError("root", { message: result.message });
      }
    }
  };

  const onCatSubmit = async (data) => {
    const result = await addCategory(data);
    if (result.success) {
      reset();
      setShowCatAddModel(false);
    }
    if (!result.success) {
      setError("root", { message: result.message });
    }
    console.log(data);
  };

  useEffect(() => {
    if (token) {
      getAllMenuItems();
      getAllCategories();
    }
  }, [token]);

  const onDelete = async (id) => {
    const result = await handleDelete(id);
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };

  const onEdit = async (item) => {
    console.log(item);
    setEditingItem(item);
    setShowAddModal(true);
    reset(item);
    setImagePreview(item.imageUrl);
  };

  const handleCatDelete = async (id) => {
    const result = await handleDeleteCategory(id);
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };
  return (
    <div className="container-fluid py-6 bg-emerald-50">
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl bg-white p-6 rounded-3xl shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => {
                reset({
                  name: "",
                  price: "",
                  category: "",
                  foodType: "",
                  isAvailable: true,
                  image: null,
                });
                setShowAddModal(false);
                setEditingItem(null);
                setImagePreview(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 fs-3 font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {isLoading ? (
                <Loader></Loader>
              ) : (
                <div>
                  {errors.root && (
                    <div className="mb-2 text-red-600 text-sm text-center bg-red-50 py-3 rounded-3 border-2 border-red-700">
                      {errors.root.message}
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter dish name"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Name is required",
                        },
                      })}
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      {...register("price", {
                        required: {
                          value: true,
                          message: "Price is required",
                        },
                      })}
                      className={`mb-2 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className={`mb-2 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Category</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Starters">Starters</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Burger">Burger</option>
                      <option value="Rice & Biryani">Rice & Biryani</option>
                      <option value="Pizzas">Pizzas</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Veg / Non-Veg */}
                  <div>
                    <div className="flex gap-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select type:
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="veg"
                          {...register("foodType", { required: "Select type" })}
                          className=" w-5 h-5 me-2 mb-2 text-emerald-600 rounded-full"
                        />
                        <span className="text-gray-700 text-medium">
                          Vegetarian
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="non-veg"
                          {...register("foodType", { required: "Select type" })}
                          className="w-5 h-5 me-2  mb-2 text-red-500 rounded-full"
                        />
                        <span className="text-gray-700 text-medium">
                          Non-Vegetarian
                        </span>
                      </label>
                    </div>
                    {/* Validation Error */}
                    {errors.foodType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.foodType.message}
                      </p>
                    )}
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3  mb-2">
                    <label className="text-gray-700 font-medium">
                      Available
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register("isAvailable")}
                        className="sr-only peer "
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 transition-all duration-300"></div>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5 "></span>
                    </label>
                  </div>

                  {/* Image Upload */}
                  <div className=" mb-2 d-flex align-top ">
                    <label className="block text-gray-700 font-medium mb-2 me-3">
                      Upload Image
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:border-emerald-500 transition-all duration-300">
                      <FaUpload className="text-emerald-600 w-6 h-6 mb-2" />
                      <span className="text-gray-500 text-sm mb-2">
                        Click to upload or drag file
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image", {
                          validate: (value) => {
                            // If adding new, require an image
                            if (
                              !editingItem &&
                              (!value || value.length === 0)
                            ) {
                              return "Image is required";
                            }
                            // If editing, image is optional
                            return true;
                          },
                        })}
                        className="hidden"
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="mt-3 w-32 h-32 object-cover rounded-xl border border-gray-200"
                        />
                      )}
                    </label>
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-3 transition-all duration-300 shadow-lg"
                  >
                    <FaCheck />{" "}
                    {isSubmitting
                      ? editingItem
                        ? "Updating..."
                        : "Adding..."
                      : editingItem
                      ? "Update Menu Item"
                      : "Add Menu Item"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {showCatAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg bg-white p-6 rounded-3xl shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowCatAddModel(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
              Add New Category
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
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Category name is required",
                    },
                  })}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3">
                <label className="font-medium">Active</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition-all duration-300"></div>
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-3 transition-all duration-300 shadow-lg"
              >
                <FaCheck />
                {isSubmitting ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-md-between justify-content-center items-center mb-6 flex-wrap">
        <div className="flex items-center mb-0 me-3 me-md-0">
          <MdRestaurantMenu className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Menu Items
          </h2>
        </div>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-4 shadow-md transition-all duration-300"
          onClick={() => setShowAddModal(true)}
        >
          <FaUtensils className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      {/* Category List */}
      <div className="mb-6 sm:px-0">
        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="fs-4 font-semibold text-gray-800 mb-0">
              Food Categories
            </h3>
            <button
              className="flex items-center gap-2 p-2 bg-emerald-600 text-white text-sm rounded-4 hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => setShowCatAddModel(true)}
            >
              <FaPlus className="fw-bold" />
              Add Category
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-3 min-w-max pb-2">
              <button className="me-2 p-4 sm:px-5 bg-emerald-600 text-white text-sm rounded-5 shadow-sm hover:shadow transition-all duration-300">
                All Items
              </button>
              {isLoading ? (
                <Loader />
              ) : (
                categories?.map((cat) => (
                  <div
                    key={cat._id}
                    className={`group relative  p-4 me-2 sm:px-5 text-sm rounded-5 shadow-sm hover:shadow-md transition-all duration-300 ${
                      cat.isActive
                        ? "bg-emerald-100 hover:bg-emerald-200 text-gray-800"
                        : "bg-red-100 hover:bg-red-200 text-gray-700"
                    }`}
                  >
                    <div>{cat.name}</div>

                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="absolute top-1 left-1 opacity-100 transition-opacity duration-300 bg-emerald-500 hover:bg-emerald-600 text-white rounded-5 p-1 shadow-sm"
                      title="Delete category"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleCatDelete(cat._id)}
                      className="absolute top-1 right-1 opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600 text-white rounded-5 p-1 shadow-sm"
                      title="Delete category"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Cards */}
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : menuItems.length > 0 ? (
        <div className="row g-4">
          {menuItems.map((item) => (
            <div key={item._id} className="col-12 col-md-6 col-lg-4">
              <NavLink className="card h-100 border-0 text-decoration-none bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    className="card-img-top h-60 w-full object-cover"
                    alt={item.name}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
                    <h5 className="text-xl font-semibold text-white mb-0">
                      {item.name ? item.name : "NA"}
                    </h5>
                    <div className="flex gap-2 mt-2">
                      {item.bestSeller && (
                        <span className="badge bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
                          Best Seller
                        </span>
                      )}
                      <span
                        className={`badge px-3 py-1 rounded-full text-sm ${
                          item.foodType === "veg"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.foodType === "veg" ? "Pure Veg" : "Non-Veg"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-body bg-white p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(item.category)
                        ? item.category
                        : [item.category]
                      ).map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <span className="text-xl font-bold text-emerald-600">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center  mt-4 pt-4 border-t border-gray-100">
                    {/* ✅ Checkbox with state update */}
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() =>
                          updateMenuItem(item._id, {
                            isAvailable: !item.isAvailable,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition ${
                          item.isAvailable ? "bg-emerald-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            item.isAvailable ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-3 transition-colors duration-200">
                        <FaEdit
                          className="w-4 h-4"
                          onClick={() => onEdit(item)}
                        />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-3 transition-colors duration-200">
                        <FaTrash
                          className="w-4 h-4"
                          onClick={() => onDelete(item._id)}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No menu items found.</p>
      )}
    </div>
  );
};

export default AdminMenuItems;
