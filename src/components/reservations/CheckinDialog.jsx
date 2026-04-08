// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";

// const CheckinDialog = ({ data, close }) => {
//   const [rooms, setRooms] = useState([]);
//   const [selectedRooms, setSelectedRooms] = useState({});

//   console.log("CheckinDialog::", data);
  

//   useEffect(() => {
//     fetchReadyRooms();
//   }, []);

//   useEffect(() => {
//     if (!data?.result?.stays) return;
//     const initial = {};
//     data.result.stays.forEach((s) => {
//       initial[s.stayId] = s.room_id;
//     });
//     setSelectedRooms(initial);
//   }, [data]);

//   const fetchReadyRooms = async () => {
//     const res = await api.get("/rooms/ready", {
//       params: {
//         room_type_id: data.reservation.room_type_id
//       }
//     });
//     setRooms(res.data.data);
//   };

//   const updateRoom = (stayId, roomId) => {
//     setSelectedRooms((prev) => ({
//       ...prev,
//       [stayId]: Number(roomId)
//     }));
//   };
//   const confirmCheckin = async () => {
//     try {
//       for (const stayId in selectedRooms) {
//         await api.post(`/stays/${stayId}/change-room`, {
//           newRoomId: selectedRooms[stayId]
//         });

//       }
//       alert("Guest checked in successfully");
//       close();
//     } catch (error) {
//       alert(error.response?.data?.message || "Check-in failed");
//     }

//   };


//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-6 w-105 space-y-4">
//         <h2 className="text-lg font-semibold">
//           Confirm Check-in
//         </h2>
//         <div className="space-y-1 text-sm">
//           <p>
//             Guest: <b>{data.reservation.guest_name}</b>
//           </p>
//           <p>
//             Room Type: {data.reservation.room_type}
//           </p>
//           <p>
//             Check-in: {data.reservation.checkin_date}
//           </p>
//           <p>
//             Checkout: {data.reservation.checkout_date}
//           </p>
//         </div>
//         <div className="space-y-3">
//           <p className="text-sm font-medium">
//             Assign Rooms
//           </p>
//           {data.stays.map((stay, index) => (
//             <div key={stay.stayId}>
//               <label className="text-sm">
//                 Room {index + 1}
//               </label>

//               <select
//                 value={selectedRooms[stay.stayId] || ""}
//                 onChange={(e) =>
//                   updateRoom(stay.stayId, e.target.value)
//                 }
//                 className="border p-2 rounded w-full"
//               >

//                 {rooms.map((r) => (

//                   <option key={r.id} value={r.id}>
//                     {r.room_number}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-end gap-3 pt-2">
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

const CheckinDialog = ({ data, close }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});

  const stays = data?.data?.result?.stays || [];
  const reservation = data?.reservation;

  useEffect(() => {
    fetchReadyRooms();
  }, []);

  useEffect(() => {
    if (!stays.length || !rooms.length) return;

    const initial = {};
    stays.forEach((s) => {
      // match by room_number (since room_id not coming)
      const matchedRoom = rooms.find(
        (r) => r.room_number === s.room_number
      );

      initial[s.stayId] = matchedRoom?.id || "";
    });

    setSelectedRooms(initial);
  }, [stays, rooms]);

  const fetchReadyRooms = async () => {
    const res = await api.get("/rooms/ready", {
      params: {
        room_type_id: data.reservation.room_type_id,
      },
    });
    setRooms(res.data.data);
  };

  const updateRoom = (stayId, roomId) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [stayId]: Number(roomId),
    }));
  };

  const confirmCheckin = async () => {
    try {
      const values = Object.values(selectedRooms);

      // prevent duplicate rooms
      const hasDuplicate = new Set(values).size !== values.length;
      if (hasDuplicate) {
        alert("Same room selected multiple times");
        return;
      }

      // ensure all selected
      if (values.includes("") || values.includes(undefined)) {
        alert("Please select all rooms");
        return;
      }

      // run all requests together
      await Promise.all(
        Object.entries(selectedRooms).map(([stayId, roomId]) =>
          api.post(`/stays/${stayId}/change-room`, {
            newRoomId: roomId,
          })
        )
      );

      alert("Guest checked in successfully");
      close();
    } catch (error) {
      alert(error.response?.data?.message || "Check-in failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-105 space-y-4">
        <h2 className="text-lg font-semibold">
          Confirm Check-in
        </h2>

        <div className="space-y-1 text-sm">
          <p>Guest: <b>{reservation?.guest_name}</b></p>
          <p>Room Type: {reservation?.room_type}</p>
          <p>Check-in: {reservation?.checkin_date}</p>
          <p>Checkout: {reservation?.checkout_date}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Assign Rooms</p>

          {stays.map((stay, index) => (
            <div key={stay.stayId}>
              <label className="text-sm">
                Room {index + 1}
              </label>

              <select
                value={selectedRooms[stay.stayId] || ""}
                onChange={(e) =>
                  updateRoom(stay.stayId, e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="">Select Room</option>

                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.room_number}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={confirmCheckin}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Check-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckinDialog;