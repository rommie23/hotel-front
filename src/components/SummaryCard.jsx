import React from "react";

const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2 text-gray-800">
        {value ?? 0}
      </h2>
    </div>
  );
};

export default SummaryCard;