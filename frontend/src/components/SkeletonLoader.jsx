export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 border-0 shimmer  shadow-sm">
            {/* Image skeleton */}
            <div className="h-80 w-full "></div>
          </div>
        </div>
      ))}
    </div>
  );
}

{/* Body */}
{/* <div className="card-body bg-white p-4 space-y-4">
  <div className="flex justify-between items-center">
    <div className="h-4 w-32 bg-emerald-50 rounded"></div>
    <div className="h-4 w-16 bg-emerald-50 rounded"></div>
  </div>
  <div className="flex flex-wrap gap-2">
    <div className="h-6 w-20 bg-emerald-50 rounded-full"></div>
    <div className="h-6 w-16 bg-emerald-50 rounded-full"></div>
  </div>

  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
    <div className="flex items-center gap-2">
      <div className="h-5 w-5 bg-emerald-50 rounded"></div>
      <div className="h-4 w-20 bg-emerald-50 rounded"></div>
    </div>

    <div className="flex gap-2">
      <div className="h-8 w-8 bg-emerald-50 rounded"></div>
      <div className="h-8 w-8 bg-emerald-50 rounded"></div>
    </div>
  </div>
</div>; */}
