import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div
      onClick={() => setSelectedCategory(category._id)}
      className={`flex flex-col justify-between group relative me-2 md:text-lg text-sm rounded-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 
  ${
    selectedCategory === category._id
      ? category.isActive
        ? "border-2 border-emerald-600 bg-emerald-100 text-gray-800" // ✅ active selected → green
        : "border-2 border-red-600 bg-red-100 text-gray-700" // ✅ inactive selected → red
      : category.isActive
      ? "bg-emerald-100 hover:bg-emerald-200 text-gray-800" // ✅ active unselected
      : "bg-red-100 hover:bg-red-200 text-gray-700" // ✅ inactive unselected
  }
`}
    >
      <div className="flex justify-between px-2 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent category click filtering
            onEdit(category);
          }}
          className="opacity-100 transition-opacity duration-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-5 p-1 shadow-sm"
          title="Edit category"
        >
          <MdOutlineEdit />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent category click filtering
            onDelete(category._id);
          }}
          className="opacity-100 transition-opacity duration-300 bg-red-50 text-red-600 hover:bg-red-100 rounded-5 p-1 shadow-sm"
          title="Delete category"
        >
          <MdDeleteOutline />
        </button>
      </div>

      <div className="px-4 pb-2">{category.name}</div>
    </div>
  );
}
