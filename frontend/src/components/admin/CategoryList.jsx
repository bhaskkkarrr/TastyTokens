import CategoryCard from "./CategoryCard";
export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-3 min-w-max pb-2">
        {/* ALL ITEMS BUTTON */}
        <div
          onClick={() => setSelectedCategory("all")}
          className={`flex items-center justify-center px-4 py-2 me-2 md:text-lg text-sm rounded-4 shadow-sm hover:shadow cursor-pointer transition-all duration-300 ${
            selectedCategory === "all"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-gray-700"
          }`}
        >
          All Items
        </div>

        {/* CATEGORY CARDS */}
        {categories?.map((cat) => (
          <CategoryCard
            key={cat._id}
            category={cat}
            onEdit={onEdit}
            onDelete={onDelete}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </div>
  );
}
