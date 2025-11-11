import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../context/MenuContext";
import { AuthContext } from "../../context/AuthContext";
import SkeletonLoader from "../../components/SkeletonLoader";
import AddItemModal from "../../components/admin/AddItemModal";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import CategoryList from "../../components/admin/CategoryList";
import MenuItemList from "../../components/admin/MenuItemList";
import { FaUtensils, FaPlus } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { MdRestaurantMenu } from "react-icons/md";
import { CategoryContext } from "../../context/CategoryContext";

export default function AdminMenuItems() {
  const { token } = useContext(AuthContext);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatAddModal, setShowCatAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    isMenuLoading,
    getAllMenuItems,
    updateMenuItem,
    handleDelete,
    menuItems,
  } = useContext(MenuContext);

  const { categories, getAllCategories, handleDeleteCategory, isCatLoading } =
    useContext(CategoryContext);

  useEffect(() => {
    if (token) {
      getAllMenuItems();
      getAllCategories();
    }
  }, [token]);

  //-----------------------------------------------------------------------
  // MENU ITEMS HANDLERS
  //-----------------------------------------------------------------------
  const toggleAvailability = async (id, value) => {
    const fd = new FormData();
    fd.append("isAvailable", value ? "true" : "false");
    return await updateMenuItem(id, fd);
  };

  const onEdit = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const onDelete = async (id) => {
    const result = await handleDelete(id);
    if (!result.success) {
      alert("Error deleting menu item: " + result.message);
    }
  };

  //-----------------------------------------------------------------------
  // CATEGORIES  HANDLERS
  //-----------------------------------------------------------------------
  const handleCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setShowCatAddModal(true);
  };

  const handleCategoryDelete = async (id) => {
    const result = await handleDeleteCategory(id);
    if (!result.success) {
      alert("Error deleting category: " + result.message);
    }
  };

  return (
    <div className="container-fluid py-2 px-0 p-sm-3">
      {showAddModal && (
        <AddItemModal
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showCatAddModal && (
        <AddCategoryModal
          key={editingCategory ? editingCategory._id : "new"}
          setShowCatAddModal={setShowCatAddModal}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
        />
      )}

      {/* Add Category */}
      <div className="d-flex justify-content-md-between justify-content-center items-center my-sm-4 my-3  flex-wrap">
        <div className="flex items-center mb-0 me-3 me-md-0">
          <GiMeal className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-2xl font-semibold mb-sm-0 ms-2 text-gray-800 mb-1">
            Food Categories
          </h2>
        </div>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-4 shadow-md transition-all duration-300"
          onClick={() => {
            setEditingCategory(null);
            setShowCatAddModal(true);
          }}
        >
          <FaPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Category List */}
      {isCatLoading ? (
        <SkeletonLoader count={5} />
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleCategoryEdit}
          onDelete={handleCategoryDelete}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Add Menu Items */}
      <div className="d-flex justify-content-md-between justify-content-center items-center my-sm-4 my-3  flex-wrap">
        <div className="flex items-center mb-0 me-3 me-md-0">
          <MdRestaurantMenu className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-2xl font-semibold mb-0 ms-2 text-gray-800 ">
            Menu Items
          </h2>
        </div>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-4 shadow-md transition-all duration-300"
          onClick={() => {
            setEditingItem(null);
            setShowAddModal(true);
          }}
        >
          <FaUtensils className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      {/* Menu Item List */}
      {isMenuLoading ? (
        <SkeletonLoader count={5} />
      ) : (
        <MenuItemList
          menuItems={
            selectedCategory === "all"
              ? menuItems
              : menuItems.filter(
                  (item) => item.category?._id === selectedCategory
                )
          }
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedCategory={selectedCategory} // ✅ ADD THIS
          toggleAvailability={toggleAvailability}
        />
      )}
    </div>
  );
}
