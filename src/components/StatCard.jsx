export default function StatCard({
  title,
  value,
  icon = null,
  color = "indigo",
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>

      {icon && (
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
