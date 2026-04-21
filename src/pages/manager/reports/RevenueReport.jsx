import { useState, useRef } from "react";
import { getRevenueReport } from "../../../api/reports.api";
import StatCard from "../../../components/StatCard";
import { formatHotelDateCA } from "../../../utils/dateTime";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RevenueReport() {
  const today = new Date().toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chargesType, setChargesType] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const tableRef = useRef();



  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both dates");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getRevenueReport(fromDate, toDate);

      // console.log(res);
      setSummary(res || null);

      setChargesType(res.chargeTypes || []);
      setData(res.services_charges || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch revenue report");
    } finally {
      setLoading(false);
    }
  };


  const exportToCSV = () => {
    if (!data.length) return;

    // Build headers dynamically
    const headers = ["Date"];

    chargesType.forEach(type => {
      headers.push(`${type} Qty`);
      headers.push(`${type} Unit Price`);
      headers.push(`${type} Amount`);
    });

    headers.push("Total");

    // Build rows
    const rows = data.map(row => {
      let total = 0;

      const rowData = [(row.date).split("T")[0]];

      chargesType.forEach(type => {
        const qty = Number(row[type]?.quantity || 0);
        const amount = Number(row[type]?.amount || 0);
        const unitPrice = Number(row[type]?.unit_price || 0);

        total += amount;

        rowData.push(qty);
        rowData.push(unitPrice.toFixed(2));
        rowData.push(amount.toFixed(2));
      });

      rowData.push(total.toFixed(2));

      return rowData;
    });

    // Convert to CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // const printReport = () => {
  //   if (!tableRef.current) return;

  //   const win = window.open("", "", "width=900,height=700");

  //   win.document.write(`
  //   <html>
  //     <body>
  //       ${tableRef.current.innerHTML}
  //     </body>
  //   </html>
  // `);

  //   win.document.close();
  //   win.print();
  // };

  const exportPDF = ({
    hotelName,
    from,
    to,
    chargesType,
    services_charges
  }) => {

    console.log({
      hotelName,
      from,
      to,
      chargesType,
      services_charges
    });


    const doc = new jsPDF();

    // ===== Header =====
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(hotelName, 14, 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Revenue Report", 14, 30);

    doc.setFontSize(10);
    doc.text(`Period: ${from} to ${to}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

    // ===== Build table columns =====
    const columns = [
      { header: "Date", dataKey: "date" }
    ];

    chargesType.forEach(type => {
      columns.push({
        header: `${type} Qty`,
        dataKey: `${type}_qty`
      });
      columns.push({
        header: `${type} Price`,
        dataKey: `${type}_price`
      });
      columns.push({
        header: `${type} Amount`,
        dataKey: `${type}_amount`
      });
    });

    columns.push({
      header: "Total",
      dataKey: "total"
    });

    // ===== Build rows =====
    const rows = services_charges.map(row => {

      let total = 0;

      const r = {
        date: formatHotelDateCA(row.date)
      };

      chargesType.forEach(type => {

        const qty = Number(row[type]?.quantity || 0);
        const amount = Number(row[type]?.amount || 0);
        const price = qty ? amount / qty : 0;

        total += amount;

        r[`${type}_qty`] = qty;
        r[`${type}_price`] = `$${price.toFixed(2)}`;
        r[`${type}_amount`] = `$${amount.toFixed(2)}`;

      });

      r.total = `$${total.toFixed(2)}`;

      return r;

    });

    // ===== Create table =====
    autoTable(doc, {
      startY: 50,
      columns,
      body: rows,

      theme: "grid",

      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold"
      },

      styles: {
        fontSize: 9,
        cellPadding: 3
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // ===== Footer =====
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(10);
    doc.text(
      "Generated by Hotel PMS",
      14,
      pageHeight - 10
    );

    // Save
    doc.save(`Revenue_Report_${from}_to_${to}.pdf`);
  };



  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Revenue Report</h2>
        <p className="text-gray-600 mt-1">View and analyze revenue across services and charges</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>
        </div>

        {/* Active Filters Display */}
        {(fromDate || toDate) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Selected period:</span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {fromDate ? new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Start'}
              {' — '}
              {toDate ? new Date(toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'End'}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {error}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Revenue"
              value={`$${summary.summary.totalRevenue}`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Payments"
              value={`$${summary.summary.totalPayments}`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              title="Balance"
              value={`$${summary.summary.balance}`}
              trend={summary.summary.balance >= 0 ? 'positive' : 'negative'}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* Revenue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Daily Revenue Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Showing revenue for {data.length} day{data.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-600">Loading revenue data...</p>
              </div>
            </div>
          ) : (
            // <table className="w-full text-sm border-collapse">
            //   <thead>
            //     <tr className="bg-gray-50 border-b border-gray-200">
            //       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //         Date
            //       </th>

            //       {/* Dynamic service columns */}
            //       {chargesType.map((type, index) => (
            //         <th
            //           key={type}
            //           className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            //         >
            //           <div className="flex items-center gap-1">
            //             <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            //             {type}
            //           </div>
            //         </th>
            //       ))}

            //       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //         <div className="flex items-center gap-1">
            //           <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            //           Daily Total
            //         </div>
            //       </th>
            //     </tr>
            //   </thead>

            //   <tbody className="divide-y divide-gray-100">
            //     {data.length === 0 ? (
            //       <tr>
            //         <td
            //           colSpan={chargesType.length + 2}
            //           className="px-4 py-12 text-center text-gray-500"
            //         >
            //           <div className="flex flex-col items-center justify-center">
            //             <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            //             </svg>
            //             <p className="text-gray-500 text-lg mb-1">No revenue data available</p>
            //             <p className="text-gray-400 text-sm">Select a date range and generate report</p>
            //           </div>
            //         </td>
            //       </tr>
            //     ) : (
            //       data.map((row, idx) => {
            //         // Calculate daily total
            //         const total = chargesType.reduce(
            //           (sum, type) => sum + Number(row[type]?.amount || 0), 0
            //         );

            //         return (
            //           <tr
            //             key={row.date}
            //             className={`
            //               ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
            //               hover:bg-gray-100/50 transition
            //             `}
            //           >
            //             {/* Date */}
            //             <td className="px-4 py-3 font-medium text-gray-800">
            //               <div>{formatHotelDateCA(row.date)}</div>
            //               <div className="text-xs text-gray-500 mt-0.5">
            //                 {new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' })}
            //               </div>
            //             </td>

            //             {/* Dynamic amounts */}
            //             {chargesType.map(type => (
            //               <td key={type} className="px-4 py-3">
            //                 <div className="font-medium text-gray-800">
            //                   ${Number(row[type]?.amount || 0).toFixed(2)}
            //                 </div>
            //                 <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            //                   <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
            //                   {row[type]?.quantity || 0} sold @ ${Number(row[type]?.unit_price || 0).toFixed(2)}
            //                 </div>
            //               </td>
            //             ))}

            //             {/* Daily Total */}
            //             <td className="px-4 py-3">
            //               <div className="font-semibold text-green-600">
            //                 ${total.toFixed(2)}
            //               </div>
            //               <div className="text-xs text-gray-500 mt-0.5">
            //                 Total for day
            //               </div>
            //             </td>
            //           </tr>
            //         );
            //       })
            //     )}
            //   </tbody>

            //   {/* Table Footer with Totals */}
            //   {data.length > 0 && (
            //     <tfoot className="bg-gray-50 border-t border-gray-200">
            //       <tr>
            //         <td className="px-4 py-3 font-semibold text-gray-800">
            //           Period Total
            //         </td>

            //         {chargesType.map(type => {
            //           const typeTotal = data.reduce(
            //             (sum, row) => sum + Number(row[type]?.amount || 0), 0
            //           );
            //           return (
            //             <td key={type} className="px-4 py-3">
            //               <div className="font-medium text-indigo-600">
            //                 ${typeTotal.toFixed(2)}
            //               </div>
            //               <div className="text-xs text-gray-500 mt-0.5">
            //                 Total {type}
            //               </div>
            //             </td>
            //           );
            //         })}

            //         <td className="px-4 py-3">
            //           <div className="font-bold text-green-600">
            //             ${data.reduce((sum, row) => {
            //               const rowTotal = chargesType.reduce(
            //                 (rowSum, type) => rowSum + Number(row[type]?.amount || 0), 0
            //               );
            //               return sum + rowTotal;
            //             }, 0).toFixed(2)}
            //           </div>
            //           <div className="text-xs text-gray-500 mt-0.5">
            //             Grand Total
            //           </div>
            //         </td>
            //       </tr>
            //     </tfoot>
            //   )}
            // </table>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>

                  {/* Dynamic Columns: Room Rent, Food, Beverages */}
                  {chargesType.map((type) => (
                    <th
                      key={type}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${type === 'Room Rent' ? 'bg-indigo-500' :
                            type === 'Food' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></span>
                        {type}
                      </div>
                    </th>
                  ))}

                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={chargesType.length + 2} className="px-4 py-12 text-center text-gray-500">
                      <p>No revenue data available for this period.</p>
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => {
                    // Calculate Daily Total
                    const dailyTotal = chargesType.reduce(
                      (sum, type) => sum + (row[type]?.amount || 0), 0
                    );

                    return (
                      <tr key={row.date} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-100/50 transition`}>
                        {/* Date Column */}
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <div>{formatHotelDateCA(row.date)}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </td>

                        {/* Dynamic Category Columns */}
                        {chargesType.map((type) => (
                          <td key={type} className="px-4 py-3">
                            <div className="font-medium text-gray-800">
                              ${(row[type]?.amount || 0).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                              {row[type]?.quantity || 0} sold @ ${(row[type]?.unit_price || 0).toFixed(2)}
                            </div>
                          </td>
                        ))}

                        {/* Daily Total Column */}
                        <td className="px-4 py-3 text-right">
                          <div className="font-semibold text-green-600">
                            ${dailyTotal.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Footer: Period Totals */}
              {data.length > 0 && (
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-800">Period Total</td>

                    {chargesType.map((type) => {
                      const typeTotal = data.reduce((sum, row) => sum + (row[type]?.amount || 0), 0);
                      const typeQty = data.reduce((sum, row) => sum + (row[type]?.quantity || 0), 0);

                      return (
                        <td key={type} className="px-4 py-3">
                          <div className="font-medium text-indigo-600">${typeTotal.toFixed(2)}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{typeQty} total units</div>
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-green-600">
                        ${data.reduce((sum, row) => {
                          return sum + chargesType.reduce((rSum, type) => rSum + (row[type]?.amount || 0), 0);
                        }, 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Grand Total</div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>

      {/* Export Options (Optional Enhancement) */}
      {data.length > 0 && (
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm" onClick={() => exportToCSV()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm" onClick={() => exportPDF({
            hotelName: "Demo Hotel Toronto",
            from: fromDate,
            to: toDate,
            chargesType,
            services_charges: data
          })}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      )}
    </div>
  );
}