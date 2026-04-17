// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import CancelReservationDialog from "./CancelReservationDialog";
// import { allReservations } from "../../api/reservations.api";
// import CheckinDialog from "../../components/reservations/CheckinDialog";
// import { CalendarIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
// import ReservationDetailsDialog from "./ReservationDetailsDialog";

// const ReservationsTable = ({data}) => {
//     const [selected, setSelected] = useState(null);
//     const [checkinDialog, setCheckinDialog] = useState(null);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [reservation, setReservation] = useState(null);
//     const [payments, setPayments] = useState([]);
//     const [status, setStatus] = useState([]);
//     // console.log("ReservationsTable::",data);

//     const reservations = data;

//     const checkinReservation = async (reservation) => {
//         try {
//             const res = await api.post(
//                 `/reservations/${reservation.id}/checkin`
//             );            
//             setCheckinDialog({
//                 reservation,
//                 // stayId: res.data.stay_id,
//                 // assignedRoom: res.data.assigned_room
//                 data : res.data
//             });
//         } catch (error) {
//             alert(error.response?.data?.message || "Check-in failed");
//         }
//     };

//     // Status color mapping
//     const getStatusColor = (status) => {
//         const colors = {
//             'BOOKED': 'bg-blue-100 text-blue-700 border-blue-200',
//             'CONFIRMED': 'bg-green-100 text-green-700 border-green-200',
//             'CANCELLED': 'bg-red-100 text-red-700 border-red-200',
//             'COMPLETED': 'bg-gray-100 text-gray-700 border-gray-200',
//             'NO_SHOW': 'bg-yellow-100 text-yellow-700 border-yellow-200'
//         };
//         return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
//     };

//     // Calculate stats
//     const totalReservations = reservations.length;
//     const bookedCount = reservations.filter(r => r.status === 'BOOKED').length;
//     const cancelledCount = reservations.filter(r => r.status === 'CANCELLED').length;

//     const openReservation = async (id, status) => {
//         const res = await api.get(`/reservations/${id}/details`);
//         setReservation(res.data.reservation);
//         setPayments(res.data.payments);
//         setStatus(status)

//         setDialogOpen(true);
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             {/* Header */}
//             <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//                             <CalendarIcon className="w-5 h-5 text-indigo-600" />
//                         </div>
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-800">All Reservations</h2>
//                             <p className="text-xs text-gray-500 mt-0.5">Manage guest bookings</p>
//                         </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="flex items-center gap-3 text-sm">
//                         <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
//                             <span className="text-gray-600">Total:</span>
//                             <span className="font-semibold text-gray-800 ml-1">{totalReservations}</span>
//                         </div>
//                         <div className="px-3 py-1.5 bg-blue-50 rounded-lg">
//                             <span className="text-blue-600">Booked:</span>
//                             <span className="font-semibold text-blue-700 ml-1">{bookedCount}</span>
//                         </div>
//                         <div className="px-3 py-1.5 bg-red-50 rounded-lg">
//                             <span className="text-red-600">Cancelled:</span>
//                             <span className="font-semibold text-red-700 ml-1">{cancelledCount}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                         <tr>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Guest
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Room Type
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Check-in
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Check-out
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Status
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-100">
//                         {reservations.length === 0 ? (
//                             <tr>
//                                 <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
//                                     <div className="flex flex-col items-center justify-center">
//                                         <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
//                                         <p className="text-gray-500 text-sm mb-1">No reservations found</p>
//                                         <p className="text-gray-400 text-xs">Create a new reservation to get started</p>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ) : (
//                             reservations.map((r, index) => (
//                                 <tr
//                                     key={r.id}
//                                     className={`
//                                         ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
//                                         hover:bg-gray-200 transition cursor-pointer
//                                     `}
//                                     onClick={() => openReservation(r.id, r.status)}
//                                 >
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
//                                                 <span className="text-xs font-medium text-indigo-700">
//                                                     {r.guest_name?.charAt(0) || 'G'}
//                                                 </span>
//                                             </div>
//                                             <span className="font-medium text-gray-800">{r.guest_name}</span>
//                                         </div>
//                                     </td>

//                                     <td className="px-4 py-3">
//                                         <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
//                                             {r.room_type}
//                                         </span>
//                                     </td>

//                                     <td className="px-4 py-3 text-gray-600">
//                                         {new Date(r.checkin_date).toLocaleDateString('en-US', {
//                                             month: 'short',
//                                             day: 'numeric'
//                                         })}
//                                     </td>

//                                     <td className="px-4 py-3 text-gray-600">
//                                         {new Date(r.checkout_date).toLocaleDateString('en-US', {
//                                             month: 'short',
//                                             day: 'numeric'
//                                         })}
//                                     </td>

//                                     <td className="px-4 py-3">
//                                         <span className={`
//                                             inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
//                                             ${getStatusColor(r.status)}
//                                         `}>
//                                             <span className={`w-1.5 h-1.5 rounded-full mr-1.5
//                                                 ${r.status === 'BOOKED' ? 'bg-blue-500' : ''}
//                                                 ${r.status === 'CONFIRMED' ? 'bg-green-500' : ''}
//                                                 ${r.status === 'CANCELLED' ? 'bg-red-500' : ''}
//                                                 ${r.status === 'COMPLETED' ? 'bg-gray-500' : ''}
//                                             `}></span>
//                                             {r.status}
//                                         </span>
//                                     </td>

//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center gap-2">
//                                             {r.status === "BOOKED" && (
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         checkinReservation(r);
//                                                     }}
//                                                     className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs font-medium"
//                                                 >
//                                                     <CheckCircleIcon className="w-3.5 h-3.5" />
//                                                     Check-in
//                                                 </button>
//                                             )}
//                                             {r.status == "BOOKED" && (
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         setSelected(r);
//                                                     }}
//                                                     className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium"
//                                                 >
//                                                     <XMarkIcon className="w-3.5 h-3.5" />
//                                                     Cancel
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//                 <ReservationDetailsDialog
//                     open={dialogOpen}
//                     setOpen={setDialogOpen}
//                     reservation={reservation}
//                     payments={payments}
//                     status={status}
//                     reloadReservation={openReservation}
//                 />
//             </div>

//             {/* Dialogs */}
//             {selected && (
//                 <CancelReservationDialog
//                     reservation={selected}
//                     close={() => setSelected(null)}
//                 />
//             )}
//             {checkinDialog && (
//                 <CheckinDialog
//                     data={checkinDialog}
//                     close={() => setCheckinDialog(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ReservationsTable;

import { useState, Fragment } from "react";
import api from "../../api/axios";
import CancelReservationDialog from "./CancelReservationDialog";
import { allReservations } from "../../api/reservations.api";
import CheckinDialog from "../../components/reservations/CheckinDialog";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import ReservationDetailsDialog from "./ReservationDetailsDialog";

const ReservationsTable = ({ data }) => {
  const [selected, setSelected] = useState(null);
  const [checkinDialog, setCheckinDialog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState([]);

  // Expand/collapse state for grouped reservations
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigate = useNavigate();
  const reservations = data || [];

  // ===== GROUPING LOGIC: Group by guest_phone + checkin_date + room_type_id =====
  const groupedReservations = reservations.reduce((acc, res) => {
    // Create a unique key for grouping multi-room bookings
    const groupKey = `${res.guest_phone}|${res.checkin_date}|${res.room_type_id}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        key: groupKey,
        guest_name: res.guest_name,
        guest_phone: res.guest_phone,
        checkin_date: res.checkin_date,
        checkout_date: res.checkout_date,
        room_type: res.room_type,
        total_rooms: 0,
        total_amount: 0,
        total_paid: 0,
        reservations: []
      };
    }

    const group = acc[groupKey];
    group.total_rooms += 1;
    group.total_amount += parseFloat(res.total_amount || 0);
    group.total_paid += parseFloat(res.paid_amount || 0); // assuming API returns paid_amount
    group.reservations.push(res);

    return acc;
  }, {});

  const groups = Object.values(groupedReservations);

  // ===== TOGGLE GROUP EXPANSION =====
  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // ===== CHECK-IN HANDLER (per reservation) =====
  const checkinReservation = async (reservation) => {
    try {
      const res = await api.post(`/reservations/${reservation.id}/checkin`);
      setCheckinDialog({
        reservation,
        data: res.data
      });
    } catch (error) {
      alert(error.response?.data?.message || "Check-in failed");
    }
  };

  // ===== STATUS COLOR MAPPING =====
  const getStatusColor = (status) => {
    const colors = {
      'BOOKED': 'bg-blue-100 text-blue-700 border-blue-200',
      'CONFIRMED': 'bg-green-100 text-green-700 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-700 border-red-200',
      'COMPLETED': 'bg-gray-100 text-gray-700 border-gray-200',
      'NO_SHOW': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'CHECKED_IN': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // ===== CALCULATE STATS =====
  const totalReservations = reservations.length;
  const bookedCount = reservations.filter(r => r.status === 'BOOKED').length;
  const cancelledCount = reservations.filter(r => r.status === 'CANCELLED').length;
  const checkedInCount = reservations.filter(r => r.status === 'CHECKED_IN').length;

  // ===== OPEN RESERVATION DETAILS =====
  const openReservation = async (id, status) => {
    const res = await api.get(`/reservations/${id}/details`);
    setReservation(res.data.reservation);
    setPayments(res.data.payments);
    setStatus(status);
    setDialogOpen(true);
  };

  // ===== FORMAT CURRENCY =====
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCheckInRedirect = (reservation) => {
    navigate(`/dashboard/reception/checkin?reservationId=${reservation.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">All Reservations</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage guest bookings</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 text-sm">
            <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-gray-800 ml-1">{totalReservations}</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 rounded-lg">
              <span className="text-blue-600">Booked:</span>
              <span className="font-semibold text-blue-700 ml-1">{bookedCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-purple-50 rounded-lg">
              <span className="text-purple-600">Checked-in:</span>
              <span className="font-semibold text-purple-700 ml-1">{checkedInCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-red-50 rounded-lg">
              <span className="text-red-600">Cancelled:</span>
              <span className="font-semibold text-red-700 ml-1">{cancelledCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest / Booking
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {groups.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-1">No reservations found</p>
                    <p className="text-gray-400 text-xs">Create a new reservation to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const isExpanded = expandedGroups[group.key];
                const isMultiRoom = group.total_rooms > 1;
                const paidPercent = group.total_amount > 0
                  ? Math.round((group.total_paid / group.total_amount) * 100)
                  : 0;

                return (
                  <Fragment key={group.key}>
                    {/* GROUP HEADER ROW */}
                    <tr
                      className={`
                        bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition
                        ${isMultiRoom ? 'border-b-2 border-indigo-100' : ''}
                      `}
                      onClick={() => isMultiRoom && toggleGroup(group.key)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isMultiRoom && (
                            <span className="text-gray-400">
                              {isExpanded ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              )}
                            </span>
                          )}
                          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-700">
                              {group.guest_name?.charAt(0) || 'G'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{group.guest_name}</span>
                            {isMultiRoom && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                <UsersIcon className="w-3 h-3 mr-1" />
                                {group.total_rooms} rooms
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {group.room_type}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        <div className="text-xs">
                          <div>{new Date(group.checkin_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</div>
                          <div className="text-gray-400">→</div>
                          <div>{new Date(group.checkout_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                          <div className="text-xs">
                            <div className="font-medium text-gray-800">
                              {formatCurrency(group.total_paid)} / {formatCurrency(group.total_amount)}
                            </div>
                            {group.total_amount > 0 && (
                              <div className="text-gray-500">
                                {paidPercent}% paid
                                {paidPercent < 100 && group.total_paid > 0 && (
                                  <span className="ml-1 text-amber-600">• Balance: {formatCurrency(group.total_amount - group.total_paid)}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {group.reservations.every(r => r.status === 'CHECKED_IN') ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-100 text-purple-700 border-purple-200">
                              <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-500"></span>
                              All Checked-in
                            </span>
                          ) : group.reservations.some(r => r.status === 'BOOKED') ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-blue-500"></span>
                              {group.reservations.filter(r => r.status === 'BOOKED').length} pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                              <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-gray-500"></span>
                              Completed
                            </span>
                          )}

                          {/* Amber warning badge */}
                          {group.reservations.some(r => r.status === 'BOOKED') && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-medium border border-amber-200 animate-pulse">
                              ⚠️ {group.reservations.filter(r => r.status === 'BOOKED').length} room(s) pending check-in
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {/* No actions on group header - click to expand */}
                        {isMultiRoom && (
                          <span className="text-xs text-indigo-600 font-medium">
                            {isExpanded ? 'Hide rooms' : 'Show rooms'}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* INDIVIDUAL RESERVATION ROWS (shown when expanded or if single room) */}
                    {(isExpanded || !isMultiRoom) && group.reservations.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={`
                          ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                          hover:bg-gray-100 transition cursor-pointer
                          ${isMultiRoom ? 'pl-8' : ''}
                        `}
                        onClick={() => openReservation(r.id, r.status)}
                        style={isMultiRoom ? { paddingLeft: '2rem' } : {}}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isMultiRoom && (
                              <span className="text-xs text-gray-400 w-4">#{idx + 1}</span>
                            )}
                            <span className="text-sm text-gray-600">
                              {r.guest_name}
                              {r.room_number && (
                                <span className="ml-1 text-gray-400">• Room {r.room_number}</span>
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                            {r.room_type}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {new Date(r.checkin_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <span className="font-medium text-gray-800">
                              {formatCurrency(r.paid_amount || 0)} / {formatCurrency(r.total_amount)}
                            </span>
                            {r.paid_amount > 0 && r.total_amount > r.paid_amount && (
                              <div className="text-amber-600">
                                Due: {formatCurrency(r.total_amount - r.paid_amount)}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`
                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                            ${getStatusColor(r.status)}
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5
                              ${r.status === 'BOOKED' ? 'bg-blue-500' : ''}
                              ${r.status === 'CHECKED_IN' ? 'bg-purple-500' : ''}
                              ${r.status === 'CANCELLED' ? 'bg-red-500' : ''}
                              ${r.status === 'COMPLETED' ? 'bg-gray-500' : ''}
                            `}></span>
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {r.status === "BOOKED" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckInRedirect(r);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs font-medium"
                                >
                                  <CheckCircleIcon className="w-3.5 h-3.5" />
                                  Check-in
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected(r);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium"
                                  title="Cancel this room"
                                >
                                  <XMarkIcon className="w-3.5 h-3.5" />
                                  Cancel
                                </button>
                              </>
                            )}
                            {r.status === "CHECKED_IN" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReservation(r.id, r.status);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-xs font-medium"
                              >
                                View Folio
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>

        {/* Dialogs */}
        <ReservationDetailsDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          reservation={reservation}
          payments={payments}
          status={status}
          reloadReservation={openReservation}
        />
      </div>

      {/* Cancel Dialog */}
      {selected && (
        <CancelReservationDialog
          reservation={selected}
          close={() => setSelected(null)}
        />
      )}

      {/* Check-in Dialog */}
      {checkinDialog && (
        <CheckinDialog
          data={checkinDialog}
          close={() => setCheckinDialog(null)}
        />
      )}
    </div>
  );
};

export default ReservationsTable;