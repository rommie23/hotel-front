// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";

// const CheckinDialog = ({ data, close }) => {

//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(
//     data.assignedRoom.id
//   );

//   useEffect(() => {
//     fetchReadyRooms();
//   }, []);

//   const fetchReadyRooms = async () => {
//       console.log("fetchReadyRooms::::",data)
//     const res = await api.get("/rooms/ready", {
//       params: {
//         room_type_id: data.reservation.room_type_id
//       }
//     });
//     console.log(res);
//     setRooms(res.data.data);
//   };

//   const confirmCheckin = async () => {
//     await api.post(`/stays/${data.stayId}/change-room`, {
//       newRoomId: selectedRoom
//     });
//     alert("Guest checked in");
//     close();

//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

//       <div className="bg-white rounded-xl p-6 w-96 space-y-4">

//         <h2 className="text-lg font-semibold">
//           Confirm Check-in
//         </h2>

//         <div>
//           <p>Guest: <b>{data.reservation.guest_name}</b></p>
//           <p>Room Type: {data.reservation.room_type}</p>
//           <p>Check-in: {data.reservation.checkin_date}</p>
//           <p>Checkout: {data.reservation.checkout_date}</p>
//         </div>

//         <div>
//           <label className="text-sm">Assigned Room</label>

//           <select
//             value={selectedRoom}
//             onChange={(e) =>
//               setSelectedRoom(e.target.value)
//             }
//             className="border p-2 rounded w-full"
//           >

//             {rooms.map((r) => (

//               <option key={r.id} value={r.id}>
//                 {r.room_number}
//               </option>

//             ))}

//           </select>
//         </div>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={close}
//             className="border px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={confirmCheckin}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Confirm Check-in
//           </button>
//         </div>
//       </div>
//     </div>
//   );

// };

// export default CheckinDialog;


import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircleIcon, HomeIcon } from "@heroicons/react/24/outline";

const CheckinDialog = ({ data, close }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(data.assignedRoom.id);

    useEffect(() => {
        fetchReadyRooms();
    }, []);

    const fetchReadyRooms = async () => {
        const res = await api.get("/rooms/ready", {
            params: {
                room_type_id: data.reservation.room_type_id
            }
        });
        setRooms(res.data.data);
    };

    const confirmCheckin = async () => {
        await api.post(`/stays/${data.stayId}/change-room`, {
            newRoomId: selectedRoom
        });
        alert("Guest checked in");
        close();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Confirm Check-in</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Assign room and complete check-in</p>
                        </div>
                    </div>
                </div>

                {/* Guest Info */}
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-3">Guest Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-medium text-gray-800">{data.reservation.guest_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Room Type:</span>
                                <span className="text-sm font-medium text-gray-800">{data.reservation.room_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Check-in:</span>
                                <span className="text-sm font-medium text-gray-800">
                                    {new Date(data.reservation.checkin_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Check-out:</span>
                                <span className="text-sm font-medium text-gray-800">
                                    {new Date(data.reservation.checkout_date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Room Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Assigned Room <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <HomeIcon className="w-4 h-4" />
                            </span>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white"
                            >
                                {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        Room {r.room_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={close}
                        className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmCheckin}
                        className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition flex items-center gap-2"
                    >
                        <CheckCircleIcon className="w-4 h-4" />
                        Confirm Check-in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckinDialog;