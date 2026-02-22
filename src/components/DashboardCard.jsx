export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "gray"
}) {

  const styles = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600"
    }
  };

  const style = styles[color];

  return (
    <div className={`
      ${style.bg}
      ${style.border}
      border
      rounded-xl
      p-5
      flex
      items-center
      justify-between
      transition-all
      duration-200
      hover:shadow-md
      hover:-translate-y-0.5
    `}>

      <div>
        <p className="text-sm text-gray-600">
          {title}
        </p>

        <p className="text-2xl font-bold text-gray-800 mt-1">
          {value}
        </p>
      </div>

      {Icon && (
        <div className={`
          ${style.iconBg}
          ${style.iconColor}
          p-3
          rounded-lg
        `}>
          <Icon className="h-6 w-6" />
        </div>
      )}

    </div>
  );
}