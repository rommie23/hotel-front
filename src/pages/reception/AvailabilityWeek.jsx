// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// // Generate consistent colors for guests
// const generateGuestColor = (guestName) => {
//   let hash = 0;
//   for (let i = 0; i < guestName.length; i++) {
//     hash = guestName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const hue = hash % 360;
//   return `hsl(${hue}, 70%, 85%)`;
// };

// const generateGuestTextColor = (guestName) => {
//   let hash = 0;
//   for (let i = 0; i < guestName.length; i++) {
//     hash = guestName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const hue = hash % 360;
//   return `hsl(${hue}, 70%, 30%)`;
// };

// export default function AvailabilityWeek() {
//   const [weekStart, setWeekStart] = useState("2026-02-09");
//   const [data, setData] = useState([]);
//   const [guestColors, setGuestColors] = useState({});

//   // Generate 7 days (Monday to Sunday) - SIMPLE string manipulation, no Date objects
//   const getWeekDays = (startDate) => {

//   const days = [];

//   const start = new Date(startDate + "T00:00:00");

//   for (let i = 0; i < 7; i++) {

//     const d = new Date(start);

//     d.setDate(start.getDate() + i);

//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");

//     days.push(`${y}-${m}-${day}`);
//   }

//   return days;
// };


//   const weekDays = getWeekDays(weekStart);

//   // FIXED: Simple date comparison using string comparison
//   const getOccupancyType = (day, booking) => {

//   if (!booking.from || !booking.to) return null;

//   // Checkout day is not occupied
//   if (day === booking.to) return null;

//   // Checkin day
//   if (day === booking.from) return "checkin";

//   // Between checkin and checkout
//   if (day > booking.from && day < booking.to) return "full";

//   return null;
// };



//   const fetchData = async () => {
//     try {
//       const res = await api.post("/rooms/weekly-occupancy", {
//         weekStart,
//         weekEnd: weekDays[6],
//       });

//       console.log("API Response:", res.data.data);

//       // Group bookings by room
//       const grouped = {};

//       res.data.data.forEach((row) => {
//         if (!grouped[row.roomId]) {
//           grouped[row.roomId] = {
//             roomId: row.roomId,
//             roomNumber: row.roomNumber,
//             bookings: [],
//           };
//         }

//         if (row.stayId) {
//           // Ensure dates are in YYYY-MM-DD format
//           const from = row.checkinDate?.split('T')[0] || row.checkinDate;
//           const to = row.checkoutDate?.split('T')[0] || row.checkoutDate;

//           grouped[row.roomId].bookings.push({
//             guestName: row.guestName,
//             from: from,
//             to: to,
//           });
//         }
//       });

//       console.log("Grouped Data:", grouped);
//       setData(Object.values(grouped));

//       // Generate colors for all unique guests
//       const colors = {};
//       res.data.data.forEach((row) => {
//         if (row.guestName && !colors[row.guestName]) {
//           colors[row.guestName] = {
//             bg: generateGuestColor(row.guestName),
//             text: generateGuestTextColor(row.guestName),
//           };
//         }
//       });
//       setGuestColors(colors);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [weekStart]);

//   const changeWeek = (offset) => {
//     const [year, month, day] = weekStart.split('-').map(Number);
//     const date = new Date(year, month - 1, day);
//     date.setDate(date.getDate() + offset * 7);

//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');

//     setWeekStart(`${y}-${m}-${d}`);
//   };

//   // Get today's date in YYYY-MM-DD format
//   const today = new Date();
//   const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

//   // Calculate today's check-ins and check-outs
//   const getTodaysCheckins = () => {
//     return data.reduce((count, room) =>
//       count + room.bookings.filter(b => b.from === todayFormatted).length, 0
//     );
//   };

//   const getTodaysCheckouts = () => {
//     return data.reduce((count, room) =>
//       count + room.bookings.filter(b => b.to === todayFormatted).length, 0
//     );
//   };

//   // Format date for display
//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return '';
//     const [year, month, day] = dateString.split('-').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Get day name
//   const getDayName = (dateString) => {
//     const [year, month, day] = dateString.split('-').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString('en-US', { weekday: 'short' });
//   };

//   // Get month name
//   const getMonthName = (dateString) => {
//     const [year, month, day] = dateString.split('-').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString('en-US', { month: 'short' });
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-800">Weekly Availability</h2>
//         <p className="text-gray-600 mt-1">View room occupancy with partial-day indicators</p>
//       </div>

//       {/* Week Navigation Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => changeWeek(-1)}
//             className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium text-gray-700 flex items-center gap-2 shadow-sm"
//           >
//             <span className="text-lg">←</span>
//             <span className="hidden sm:inline">Previous Week</span>
//           </button>

//           <button
//             onClick={() => changeWeek(1)}
//             className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium text-gray-700 flex items-center gap-2 shadow-sm"
//           >
//             <span className="hidden sm:inline">Next Week</span>
//             <span className="text-lg">→</span>
//           </button>
//         </div>

//         <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
//           <span className="text-indigo-600 font-medium">Week of</span>
//           <span className="bg-white px-4 py-1.5 rounded-md border border-indigo-200 text-indigo-800 font-semibold">
//             {formatDisplayDate(weekDays[0])} — {formatDisplayDate(weekDays[6])}
//           </span>
//         </div>
//       </div>

//       {/* Availability Grid */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr>
//                 <th className="border-b border-r border-gray-200 p-4 bg-gray-50 text-left font-semibold text-gray-700 w-32">
//                   Room
//                 </th>

//                 {weekDays.map((day) => {
//                   const isToday = day === todayFormatted;

//                   return (
//                     <th
//                       key={day}
//                       className={`
//                         border-b border-r border-gray-200 p-4 text-center font-medium min-w-30
//                         ${isToday
//                           ? "bg-yellow-50"
//                           : "bg-gray-50"
//                         }
//                       `}
//                     >
//                       <div className="flex flex-col">
//                         <span className="text-xs uppercase tracking-wider text-gray-500">
//                           {getDayName(day)}
//                         </span>
//                         <span className={`
//                           text-lg font-semibold mt-0.5
//                           ${isToday ? "text-yellow-700" : "text-gray-700"}
//                         `}>
//                           {day.split("-")[2]}
//                         </span>
//                         <span className="text-xs text-gray-500 mt-0.5">
//                           {getMonthName(day)}
//                         </span>
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>

//             <tbody>
//               {data.length > 0 ? (
//                 data.map((room, roomIndex) => (
//                   <tr
//                     key={room.roomId}
//                     className={`
//                       ${roomIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
//                       hover:bg-gray-100/50 transition
//                     `}
//                   >
//                     <td className="border-b border-r border-gray-200 p-4 font-medium bg-gray-50/80 align-top">
//                       <div className="flex items-center gap-2">
//                         <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                         <span className="text-gray-800 font-semibold">Room {room.roomNumber}</span>
//                       </div>
//                       <div className="mt-2 text-xs text-gray-500">
//                         {room.bookings.length} booking{room.bookings.length !== 1 ? 's' : ''}
//                       </div>
//                     </td>

//                     {weekDays.map((day) => {
//                       // Find all bookings that affect this day
//                       const dayBookings = room.bookings
//                         .map(booking => ({
//                           ...booking,
//                           occupancyType: getOccupancyType(day, booking)
//                         }))
//                         .filter(b => b.occupancyType !== null);

//                       return (
//                         <td
//                           key={day}
//                           className="border-b border-r border-gray-200 p-2 align-top"
//                         >
//                           {dayBookings.length > 0 ? (
//                             <div className="space-y-1.5">
//                               {dayBookings.map((booking, idx) => {
//                                 const colors = guestColors[booking.guestName] || {
//                                   bg: '#f87171',
//                                   text: '#ffffff'
//                                 };

//                                 return (
//                                   <div
//                                     key={idx}
//                                     className="rounded-md p-2 text-xs transition-all hover:shadow-md"
//                                     style={{
//                                       backgroundColor: booking.occupancyType === 'full' ? colors.bg : 'transparent',
//                                       color: colors.text,
//                                       backgroundImage: booking.occupancyType === 'checkin'
//                                         ? `linear-gradient(to right, transparent 0%, ${colors.bg} 50%, ${colors.bg} 100%)`
//                                         : booking.occupancyType === 'checkout'
//                                           ? `linear-gradient(to left, transparent 0%, ${colors.bg} 50%, ${colors.bg} 100%)`
//                                           : 'none',
//                                       backgroundSize: '100% 100%',
//                                       backgroundRepeat: 'no-repeat',
//                                     }}
//                                   >
//                                     <div className="font-medium truncate">
//                                       {booking.guestName.split(' ').slice(0, 2).join(' ')}
//                                     </div>
//                                     <div className="flex justify-between items-center mt-0.5 opacity-90 text-[10px]">
//                                       <span>
//                                         {formatDisplayDate(booking.from).split(',')[0]}
//                                       </span>
//                                       <span>→</span>
//                                       <span>
//                                         {formatDisplayDate(booking.to).split(',')[0]}
//                                       </span>
//                                     </div>
//                                     {booking.occupancyType !== 'full' && (
//                                       <div className={`
//                                         text-[9px] uppercase tracking-wider mt-0.5 font-semibold
//                                         ${booking.occupancyType === 'checkin' ? 'text-green-700' : 'text-orange-700'}
//                                       `}>
//                                         {booking.occupancyType === 'checkin' ? '🟢 Check-in' : '🟠 Check-out'}
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           ) : (
//                             <div className="h-full min-h-25 flex flex-col items-center justify-center">
//                               <span className="text-green-700 font-medium text-sm">Available</span>
//                               <span className="text-xs text-green-600 mt-1">●</span>
//                             </div>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="p-12 text-center border-b border-gray-200"
//                   >
//                     <div className="flex flex-col items-center justify-center">
//                       <p className="text-gray-500 text-lg mb-1">No room data available</p>
//                       <p className="text-gray-400 text-sm">Add rooms to view availability</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="mt-6 flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 bg-green-50 border border-green-300 rounded"></div>
//           <span className="text-sm text-gray-700">Available</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-3" style={{ background: 'linear-gradient(to right, transparent 0%, #f87171 50%, #f87171 100%)' }}></div>
//           <span className="text-sm text-gray-700">Check-in day (starts at noon)</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-3" style={{ background: 'linear-gradient(to left, transparent 0%, #f87171 50%, #f87171 100%)' }}></div>
//           <span className="text-sm text-gray-700">Check-out day (ends at noon)</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-3 bg-red-500 rounded"></div>
//           <span className="text-sm text-gray-700">Full day occupied</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 bg-yellow-50 border border-yellow-300 rounded"></div>
//           <span className="text-sm text-gray-700">Today</span>
//         </div>
//       </div>

//       {/* Week Summary */}
//       {data.length > 0 && (
//         <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <p className="text-xs text-gray-500 uppercase tracking-wider">Total Rooms</p>
//             <p className="text-2xl font-bold text-gray-800 mt-1">{data.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <p className="text-xs text-gray-500 uppercase tracking-wider">Today's Check-ins</p>
//             <p className="text-2xl font-bold text-gray-800 mt-1">
//               {getTodaysCheckins()}
//             </p>
//             {getTodaysCheckins() > 0 && (
//               <p className="text-xs text-green-600 mt-1">Guests arriving today</p>
//             )}
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <p className="text-xs text-gray-500 uppercase tracking-wider">Today's Check-outs</p>
//             <p className="text-2xl font-bold text-gray-800 mt-1">
//               {getTodaysCheckouts()}
//             </p>
//             {getTodaysCheckouts() > 0 && (
//               <p className="text-xs text-orange-600 mt-1">Guests departing today</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../../api/axios";

// Generate consistent colors for guests
const generateGuestColor = (guestName) => {
  let hash = 0;
  for (let i = 0; i < guestName.length; i++) {
    hash = guestName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`;
};

const generateGuestTextColor = (guestName) => {
  let hash = 0;
  for (let i = 0; i < guestName.length; i++) {
    hash = guestName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 25%)`;
};

export default function AvailabilityWeek() {
  // Get current week's Monday dynamically
  const getCurrentWeekMonday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = day === 0 ? 6 : day - 1; // Days to subtract to get Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(monday.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${dayOfMonth}`;
  };

  const [weekStart, setWeekStart] = useState(getCurrentWeekMonday());
  const [data, setData] = useState([]);
  const [guestColors, setGuestColors] = useState({});

  // Helper to extract YYYY-MM-DD from any date string (ignores timezone completely)
  const extractDatePart = (dateTimeString) => {
    if (!dateTimeString) return '';
    // Simply take the first 10 characters (YYYY-MM-DD)
    // This works regardless of timezone or format
    return dateTimeString.substring(0, 10);
  };

  // Generate 7 days (Monday to Sunday)
  const getWeekDays = (startDate) => {
    const days = [];
    const [year, month, day] = startDate.split('-').map(Number);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month - 1, day + i);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      days.push(`${y}-${m}-${d}`);
    }
    
    return days;
  };

  const weekDays = getWeekDays(weekStart);

  // FIXED: Simple string comparison - no timezone involvement
  const isDayOccupied = (day, booking) => {
    if (!booking.from || !booking.to) return false;

    // Simple string comparison works because dates are in YYYY-MM-DD format
    // Guest stays on check-in night, leaves on check-out morning
    return day >= booking.from && day < booking.to;
  };

  // Get booking for a specific day (if any)
  // const getBookingForDay = (day, bookings) => {
  //   return bookings.find(booking => isDayOccupied(day, booking));
  // };

  const getBookingForDay = (day, bookings) => {
  // console.log(`Looking for booking on ${day}`);
  // console.log("Available bookings:", bookings.map(b => `${b.guestName}: ${b.from} to ${b.to}`));
  
  const found = bookings.find(booking => {
    const isOccupied = isDayOccupied(day, booking);
    // console.log(`  ${booking.guestName}: ${booking.from}-${booking.to} → ${day}? ${isOccupied}`);
    return isOccupied;
  });
  
  console.log(`Found:`, found);
  return found;
};

  const fetchData = async () => {
    try {
      const res = await api.post("/rooms/weekly-occupancy", {
        weekStart,
        weekEnd: weekDays[6],
      });

      console.log("API Response:", res.data.data);

      // Group bookings by room
      const grouped = {};

      res.data.data.forEach((row) => {
        if (!grouped[row.roomId]) {
          grouped[row.roomId] = {
            roomId: row.roomId,
            roomNumber: row.roomNumber,
            bookings: [],
          };
        }

        if (row.stayId) {
          // FIXED: Extract just the date part - no timezone conversion
          const from = extractDatePart(row.checkinDate);
          const to = extractDatePart(row.checkoutDate);
          
          // console.log(`Booking: ${row.guestName}, From: ${from}, To: ${to}`);
          
          grouped[row.roomId].bookings.push({
            stayId: row.stayId,
            guestName: row.guestName,
            from: from,
            to: to,
          });
        }
      });

      // console.log("Grouped Data:", grouped);
      setData(Object.values(grouped));
      
      // Generate colors for all unique guests
      const colors = {};
      res.data.data.forEach((row) => {
        if (row.guestName && !colors[row.guestName]) {
          colors[row.guestName] = {
            bg: generateGuestColor(row.guestName),
            text: generateGuestTextColor(row.guestName),
          };
        }
      });
      setGuestColors(colors);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekStart]);

  const changeWeek = (offset) => {
    const [year, month, day] = weekStart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + offset * 7);
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    
    setWeekStart(`${y}-${m}-${d}`);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Calculate today's check-ins and check-outs
  const getTodaysCheckins = () => {
    return data.reduce((count, room) => 
      count + room.bookings.filter(b => b.from === todayFormatted).length, 0
    );
  };

  const getTodaysCheckouts = () => {
    return data.reduce((count, room) => 
      count + room.bookings.filter(b => b.to === todayFormatted).length, 0
    );
  };

  // Calculate occupied rooms tonight
  const getOccupiedTonight = () => {
    return data.filter(room => getBookingForDay(todayFormatted, room.bookings)).length;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get day name
  const getDayName = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Get month name
  const getMonthName = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Availability</h2>
        <p className="text-gray-600 mt-1">View room occupancy across the week</p>
      </div>

      {/* Week Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeWeek(-1)}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium text-gray-700 flex items-center gap-2 shadow-sm"
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline">Previous Week</span>
          </button>

          <button
            onClick={() => changeWeek(1)}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium text-gray-700 flex items-center gap-2 shadow-sm"
          >
            <span className="hidden sm:inline">Next Week</span>
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
          <span className="text-indigo-600 font-medium">Week of</span>
          <span className="bg-white px-4 py-1.5 rounded-md border border-indigo-200 text-indigo-800 font-semibold">
            {formatDisplayDate(weekDays[0])} — {formatDisplayDate(weekDays[6])}
          </span>
        </div>
      </div>

      {/* Availability Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border-b border-r border-gray-200 p-4 bg-gray-50 text-left font-semibold text-gray-700 w-32">
                  Room
                </th>

                {weekDays.map((day) => {
                  const isToday = day === todayFormatted;
                  
                  return (
                    <th
                      key={day}
                      className={`
                        border-b border-r border-gray-200 p-4 text-center font-medium min-w-[110px]
                        ${isToday 
                          ? "bg-yellow-50" 
                          : "bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-gray-500">
                          {getDayName(day)}
                        </span>
                        <span className={`
                          text-lg font-semibold mt-0.5
                          ${isToday ? "text-yellow-700" : "text-gray-700"}
                        `}>
                          {day.split("-")[2]}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {getMonthName(day)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((room, roomIndex) => (
                  <tr 
                    key={room.roomId} 
                    className={`
                      ${roomIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      hover:bg-gray-100/50 transition
                    `}
                  >
                    <td className="border-b border-r border-gray-200 p-4 font-medium bg-gray-50/80 align-top">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        <span className="text-gray-800 font-semibold">Room {room.roomNumber}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {room.bookings.length} active booking{room.bookings.length !== 1 ? 's' : ''}
                      </div>
                    </td>

                    {weekDays.map((day) => {
                      console.log(`Rendering day: ${day}`);
                      console.log(`Bookings for room ${room.roomNumber}:`, room.bookings);
                      const booking = getBookingForDay(day, room.bookings);
                      if (day === "2026-02-15") {
                        console.log(`🔴 SUNDAY CHECK:`, {
                          day,
                          booking,
                          allBookings: room.bookings,
                          shouldBeOccupied: room.bookings.some(b => 
                            day >= b.from && day < b.to
                          )
                        });
                      }

                      return (
                        <td
                          key={day}
                          className={`
                            border-b border-r border-gray-200 p-2 align-top transition-all
                            ${booking 
                              ? "cursor-default" 
                              : "bg-green-50 hover:bg-green-100"
                            }
                          `}
                        >
                          {booking ? (
                            <div
                              className="rounded-md p-2.5 text-xs shadow-sm hover:shadow-md transition-all"
                              style={{
                                backgroundColor: guestColors[booking.guestName]?.bg || '#f87171',
                                color: guestColors[booking.guestName]?.text || '#ffffff',
                              }}
                            >
                              <div className="font-medium truncate">
                                {booking.guestName}
                              </div>
                              <div className="flex justify-between items-center mt-1.5 opacity-90 text-[10px]">
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">
                                  {formatDisplayDate(booking.from).split(',')[0]}
                                </span>
                                <span>→</span>
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">
                                  {formatDisplayDate(booking.to).split(',')[0]}
                                </span>
                              </div>
                              {day === booking.from && (
                                <div className="text-[9px] uppercase tracking-wider mt-1.5 font-semibold bg-green-500/30 rounded-full px-2 py-0.5 inline-block">
                                  🟢 Check-in today
                                </div>
                              )}
                              {day === booking.to && (
                                <div className="text-[9px] uppercase tracking-wider mt-1.5 font-semibold bg-orange-500/30 rounded-full px-2 py-0.5 inline-block">
                                  🟠 Check-out today
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full min-h-[80px] flex flex-col items-center justify-center">
                              <span className="text-green-700 font-medium text-sm">Available</span>
                              <span className="text-xs text-green-600 mt-1">●</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={8} 
                    className="p-12 text-center border-b border-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg mb-1">No room data available</p>
                      <p className="text-gray-400 text-sm">Add rooms to view availability</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ background: '#f87171' }}></div>
          <span className="text-sm text-gray-700">Occupied (guest stays overnight)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-700">Today</span>
        </div>
      </div>

      {/* Week Summary */}
      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{data.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Occupied Tonight</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {getOccupiedTonight()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Today's Check-ins</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {getTodaysCheckins()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Today's Check-outs</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {getTodaysCheckouts()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}