export default function MainFoodLoader({ size = 60 }) {
  const slice = size * 0.3;

  return (
    <div className="flex justify-center items-center py-6">
      <div
        className="relative animate-spin"
        style={{ width: size, height: size }}
      >
        {/* Pizza slices */}
        {[0, 120, 240].map((deg, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: slice,
              height: slice,
              transform: `translate(-50%, -100%) rotate(${deg}deg)`,
              transformOrigin: "50% 100%",
            }}
          >
            <div className="w-full h-full bg-emerald-400 rounded-t-full border-b-4 border-emerald-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
