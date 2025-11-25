export default function SkeletonLoader({ count = 7 }) {
  return (
    <>
      <div className="row g-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shimmer  shadow-sm">
              {/* Image skeleton */}
              <div className="h-80 w-full "></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
