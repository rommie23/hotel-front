import { useState } from "react";
import RevenueReport from "./RevenueReport";
import PaymentsReport from "./PaymentsReport";
import OccupancyReport from "./OccupancyReport";
import ServicesReport from "./ServicesReport";
import HousekeepingReport from "./HousekeepingReport";

export default function Reports() {

  const [activeTab, setActiveTab] = useState("revenue");

  const tabs = [
    { id:"revenue", name:"Revenue" },
    { id:"payments", name:"Payments" },
    { id:"occupancy", name:"Occupancy" },
    // { id:"services", name:"Services" },
    { id:"housekeeping", name:"Housekeeping" }
  ];

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Reports
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">

        {tabs.map(tab => (

          <button
            key={tab.id}
            onClick={()=>setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${activeTab===tab.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            {tab.name}
          </button>

        ))}

      </div>

      {/* Content */}
      <div>

        {activeTab==="revenue" && <RevenueReport />}

        {activeTab==="payments" && <PaymentsReport />}

        {activeTab==="occupancy" && <OccupancyReport />}

        {/* {activeTab==="services" && <ServicesReport />} */}

        {activeTab==="housekeeping" && <HousekeepingReport />}

      </div>

    </div>

  );

}