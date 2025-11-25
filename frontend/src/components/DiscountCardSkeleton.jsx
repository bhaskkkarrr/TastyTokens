export default function DiscountCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl shadow-md px-3 py-3 flex flex-col justify-between gap-3 animate-pulse"
        >
          {/* Top Section */}
          <div className="flex flex-col gap-3">
            {/* Title Row */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>

            {/* Applies To */}
            <div className="h-4 w-32 bg-gray-200 rounded"></div>

            {/* Dates */}
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
