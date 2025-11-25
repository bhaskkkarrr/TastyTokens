export default function QrCardSkeleton({ count = 4 }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 border-0 bg-white rounded-3xl shadow-sm p-6 animate-pulse">
            {/* Title + Date */}
            <div className="flex justify-between items-center mb-6">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>

            {/* QR Image Placeholder */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 rounded-2xl w-56 h-56"></div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
              </div>

              <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
