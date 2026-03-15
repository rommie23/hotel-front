// import React from "react";
// import api from "../../api/axios";

// const CancelReservationDialog = ({
//   reservation,
//   close,
//   refresh
// }) => {

//   const cancelReservation = async () => {
//     await api.post(
//       `/reservations/${reservation.id}/cancel`
//     );
//     refresh();
//     close();
//   };
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl space-y-4">
//         <h2 className="text-lg font-semibold">
//           Cancel Reservation
//         </h2>
//         <p>
//           Cancel reservation for
//           <strong> {reservation.guest_name}</strong> ?
//         </p>
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={close}
//             className="border px-4 py-2 rounded"
//           >
//             No
//           </button>
//           <button
//             onClick={cancelReservation}
//             className="bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Cancel Reservation
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancelReservationDialog;

import React from "react";
import api from "../../api/axios";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const CancelReservationDialog = ({ reservation, close, refresh }) => {
    const cancelReservation = async () => {
        await api.post(`/reservations/${reservation.id}/cancel`);
        refresh();
        close();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-linear-to-r from-red-50 to-orange-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Cancel Reservation</h2>
                            <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-sm font-medium text-amber-700">
                                    {reservation.guest_name?.charAt(0) || 'G'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{reservation.guest_name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {reservation.room_type} • {new Date(reservation.checkin_date).toLocaleDateString()} - {new Date(reservation.checkout_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700">
                        Are you sure you want to cancel this reservation?
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        This will mark the reservation as cancelled and free up the room.
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={close}
                        className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={cancelReservation}
                        className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition flex items-center gap-2"
                    >
                        <XMarkIcon className="w-4 h-4" />
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelReservationDialog;