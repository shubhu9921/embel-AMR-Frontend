export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Top cards */}
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm h-32"
          />
        ))}
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Table */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm h-96" />

        {/* Map */}
        <div className="bg-white rounded-xl shadow-sm h-96" />
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm h-80" />
    </div>
  );
}
