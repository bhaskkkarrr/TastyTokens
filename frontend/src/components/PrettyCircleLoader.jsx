export default function PrettyCircleLoader({ size = 48 }) {
  const border = size / 12;

  return (
    <div className="flex">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0  border-emerald-500 rounded-full animate-ping"
          style={{ borderWidth: border }}
        ></div>

        <div
          className="absolute inset-0 border-emerald-300 rounded-full"
          style={{ borderWidth: border }}
        ></div>
      </div>
    </div>
  );
}
