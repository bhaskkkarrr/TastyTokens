import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../context/MenuContext";
import { useForm, useFieldArray } from "react-hook-form";
import { FaUpload, FaCheck, FaPlus, FaTrash } from "react-icons/fa";
import Loader from "../Loader";
import { CategoryContext } from "../../context/CategoryContext";
import LoadingDots from "../LoadingDots";

function AddItemModal({ editingItem, setEditingItem, setShowAddModal }) {
  const { isMenuLoading, addMenuItem, getAllMenuItems, updateMenuItem } =
    useContext(MenuContext);
  const { categories } = useContext(CategoryContext);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: editingItem
      ? {
          name: editingItem.name,
          description: editingItem.description,
          basePrice: editingItem.basePrice,
          discountedPrice: editingItem.discountedPrice,
          category: editingItem.category?._id || editingItem.category || "",
          isVeg: editingItem.isVeg ? "true" : "false",
          isAvailable: editingItem.isAvailable,
          isBestSeller: editingItem.isBestSeller ? "true" : "false",
          variants: editingItem.variants || [],
        }
      : {
          name: "",
          description: "",
          basePrice: "",
          discountedPrice: "",
          category: "",
          isVeg: "true",
          isAvailable: true,
          isBestSeller: "false",
          variants: [],
        },
  });

  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const watchImage = watch("image");

  // ✅ Image Preview Logic
  useEffect(() => {
    if (editingItem?.imageUrl && !imagePreview && !watchImage) {
      setImagePreview(editingItem.imageUrl);
    }

    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchImage, editingItem]);

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    data.name = formatName(data.name);

    try {
      // Validate Variants
      for (let i = 0; i < data.variants.length; i++) {
        if (!data.variants[i].name) {
          setError(`variants.${i}.name`, {
            type: "manual",
            message: "Variant name is required",
          });
          return;
        }
        if (!data.variants[i].price) {
          setError(`variants.${i}.price`, {
            type: "manual",
            message: "Variant price is required",
          });
          return;
        }
      }

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "variants") {
          formData.append(
            "variants",
            JSON.stringify(
              data.variants.map((v) => ({
                ...v,
                price: Number(v.price),
              }))
            )
          );
        } else if (key === "basePrice" || key === "discountedPrice") {
          formData.append(key, Number(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      let result;
      if (editingItem) {
        result = await updateMenuItem(editingItem._id, formData);
      } else {
        result = await addMenuItem(formData);
      }

      if (result.success) {
        reset();
        setEditingItem(null);
        setImagePreview(null);
        setShowAddModal(false);
        await getAllMenuItems();
      } else {
        setError("root", { message: result.message });
      }
    } catch (err) {
      setError("root", { message: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl bg-white p-6 rounded-3xl shadow-lg overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            reset();
            setEditingItem(null);
            setImagePreview(null);
            setShowAddModal(false);
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
          {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <p className="text-center text-red-600 bg-red-50 py-2 rounded-lg">
              {errors.root.message}
            </p>
          )}

          {/* Row: Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Item Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Item name is required" })}
                className={`w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.name ? "border-red-500" : "border-emerald-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className={`w-full p-3 border rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.category ? "border-red-500" : "border-emerald-200"
                }`}
              >
                <option value="">Select Category</option>
                {categories
                  .filter((cat) => cat.isActive)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full p-3 border border-emerald-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Price (₹)
              </label>
              <input
                type="number"
                {...register("basePrice", {
                  required: "Base price is required",
                  setValueAs: (v) => Number(v),
                })}
                className={`w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.basePrice ? "border-red-500" : "border-emerald-200"
                }`}
              />
              {errors.basePrice && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.basePrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Veg / Non Veg */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Veg / Non-Veg
            </label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border-1 border-emerald-500 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  {...register("isVeg")}
                  className="accent-emerald-600"
                />
                <span className="text-sm text-emerald-800">Veg</span>
              </label>

              <label className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border-1 border-emerald-500 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  {...register("isVeg")}
                  className="accent-emerald-600"
                />
                <span className="text-sm text-emerald-800">Non-Veg</span>
              </label>
            </div>
          </div>

          {/* Best Seller */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Best Seller
            </label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border-1 border-emerald-500 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  {...register("isBestSeller")}
                  className="accent-emerald-600"
                />
                <span className="text-sm text-emerald-800">Yes</span>
              </label>

              <label className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border-1 border-emerald-500 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  {...register("isBestSeller")}
                  className="accent-emerald-600"
                />
                <span className="text-sm text-emerald-800">No</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <label className="flex items-center gap-3 text-emerald-800">
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="accent-emerald-600 w-4 h-4"
            />
            Available
          </label>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="font-medium text-emerald-800">Upload Image</label>

            <label className="mt-2 w-25 flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 p-3 rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-all duration-300">
              <FaUpload className="text-emerald-600 w-6 h-6 mb-2" />
              <span className="text-emerald-700 text-sm">
                Click to upload or drag file
              </span>

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="hidden"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-4 w-32 h-32 object-cover rounded-xl border border-emerald-300"
                />
              )}
            </label>
          </div>

          {/* Variants */}
          <div>
            <label className="font-semibold text-emerald-800">Variants</label>

            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 my-2">
                <div className="flex-1">
                  <input
                    placeholder="Eg. Half, Full"
                    {...register(`variants.${index}.name`, {
                      required: "Variant name is required",
                    })}
                    className={`p-2 border rounded-xl w-full shadow-sm focus:ring-2 focus:ring-emerald-500 ${
                      errors.variants?.[index]?.name
                        ? "border-red-500"
                        : "border-emerald-200"
                    }`}
                  />
                  {errors.variants?.[index]?.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.variants[index].name.message}
                    </p>
                  )}
                </div>

                <div className="w-32">
                  <input
                    placeholder="Price"
                    type="number"
                    {...register(`variants.${index}.price`, {
                      required: "Variant price is required",
                      setValueAs: (v) => Number(v),
                    })}
                    className={`p-2 border rounded-xl w-full shadow-sm focus:ring-2 focus:ring-emerald-500 ${
                      errors.variants?.[index]?.price
                        ? "border-red-500"
                        : "border-emerald-200"
                    }`}
                  />
                  {errors.variants?.[index]?.price && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.variants[index].price.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 bg-red-50 border-2 p-2.5 rounded-3"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ name: "", price: "" })}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-4 flex items-center gap-2 shadow hover:bg-emerald-700"
            >
              <FaPlus /> Add Variant
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-4 mt-4 shadow"
          >
            <FaCheck />
            {editingItem ? (
              isSubmitting ? (
                <div>
                  Updating <LoadingDots size={6} color="#fff" speed={1} />
                </div>
              ) : (
                "Update Menu Item"
              )
            ) : isSubmitting ? (
              <div>
                Adding <LoadingDots size={6} color="#fff" speed={1} />
              </div>
            ) : (
              "Add Menu Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
