function FoodCatSkeleton({ count = 6 }) {
  return (
    <div className="flex flex-row gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 h-16 rounded-xl w-30"
        ></div>
      ))}
    </div>
  );
}

export default FoodCatSkeleton;
