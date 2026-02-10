// import { useEffect, useState } from "react";
// import { getActiveStays, checkoutStay } from "../../api/stays.api";
// import { useNavigate } from "react-router-dom";
// import { formatDateTime } from "../../utils/dateTime";

// export default function ActiveStays() {
//   const [stays, setStays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const fetchStays = async () => {
//     try {
//       setLoading(true);
//       const res = await getActiveStays();
//       setStays(res.stays || []);
//       console.log(res.stays);


//     } catch (err) {
//       console.error(err);
//       setError("Failed to load active stays");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStays();
//   }, []);

//   const handleCheckout = async (stay) => {
//     if (stay.dueAmount > 0) {
//       alert(`Cannot checkout. Pending amount ₹${stay.dueAmount}`);
//       return;
//     }

//     if (!window.confirm("Confirm checkout?")) return;

//     try {
//       await checkoutStay(stay.stayId);
//       fetchStays(); // refresh list
//     } catch (err) {
//       alert("Checkout failed");
//     }
//   };

//   const isOverdue = (checkoutDate) => {
//     const today = new Date().toISOString().split("T")[0];
//     return checkoutDate < today;
//   };

//   if (loading) {
//     return <p className="text-gray-500">Loading active stays...</p>;
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Active Stays</h2>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Room</th>
//               <th className="p-3 text-left">Guest</th>
//               <th className="p-3 text-left">Check-in</th>
//               <th className="p-3 text-left">Check-out</th>
//               <th className="p-3 text-left">Total</th>
//               <th className="p-3 text-left">Paid</th>
//               <th className="p-3 text-left">Due</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {stays.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="p-6 text-center text-gray-500">
//                   No active stays
//                 </td>
//               </tr>
//             ) : (
//               stays.map((stay) => (
//                 <tr
//                   key={stay.stayId}
//                   className={`border-t ${
//                     isOverdue(stay.checkoutDate)
//                       ? "bg-red-50"
//                       : ""
//                   }`}
//                 >
//                   <td className="p-3 font-medium">
//                     {stay.roomNumber}
//                   </td>
//                   <td className="p-3">{stay.guestName}</td>
//                   <td className="p-3">{formatDateTime(stay.checkinDate)}</td>
//                   <td className="p-3">
//                     {stay.checkoutDate}
//                     {isOverdue(stay.checkoutDate) && (
//                       <span className="ml-2 text-xs text-red-600">
//                         (Overdue)
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3">₹{stay.totalAmount}</td>
//                   <td className="p-3">₹{stay.paidAmount}</td>
//                   <td className="p-3 font-semibold text-red-600">
//                     ₹{stay.dueAmount}
//                   </td>
//                   <td className="p-3 space-x-2">
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/dashboard/reception/billing/${stay.stayId}`
//                         )
//                       }
//                       className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
//                     >
//                       Billing
//                     </button>

//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/dashboard/reception/checkout/${stay.stayId}`
//                         )
//                       }
//                     //   disabled={stay.dueAmount > 0}
//                       className={`text-sm px-3 py-1.5 rounded-lg ${
//                         stay.dueAmount > 0
//                           ? "bg-gray-300 text-gray-600"
//                           : "bg-green-600 text-white hover:bg-green-700"
//                       }`}
//                     >
//                       Checkout
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomBoard } from "../../api/stays.api";
import { formatDateTime } from "../../utils/dateTime";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { changeRoom } from "../../api/stays.api";


export default function ActiveStays() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRoomBoard();
      console.log(res);

      setRooms(res.rooms || res); // depends on your response wrapper
    } catch (err) {
      console.error(err);
      setError("Failed to load room board");
    } finally {
      setLoading(false);
    }
  };

  function StayCard({ room, dragging = false }) {
  const {
    setNodeRef,
    listeners,
    attributes,
    isDragging
  } = useDraggable({
    id: room.stayId,
    data: { room }
  });

  if (isDragging && !dragging) return null;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`
        rounded-xl border bg-white p-4
        transition-all duration-200
        ${dragging ? "shadow-2xl scale-105" : "shadow-sm"}
      `}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">
            {room.guestName}
          </p>
          <p className="text-xs text-gray-500">
            Stay ID #{room.stayId}
          </p>
        </div>

        {/* DRAG HANDLE */}
        <div className="flex gap-2">
          <div className="bg-red-400 p-2 rounded-xl text-xs text-white">
            Due: {room.dueAmount}
          </div>
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400"
            title="Drag to change room"
          >
            ⠿
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex justify-between">
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Check-in:</span>{" "}
            {formatDateTime(room.checkinDate)}
          </p>
          <p>
            <span className="font-medium">Checkout:</span>{" "}
            {formatDateTime(room.expectedCheckoutDate)}
          </p>
        </div>

        {/* ACTION BUTTONS */}          
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/reception/billing/${room.stayId}`);
              }}
              className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              Billing
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/reception/checkout/${room.stayId}`);
              }}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                room.dueAmount > 0
                  ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Checkout
            </button>
          </div>
      </div>

      <div className="mt-2 text-xs text-gray-400 italic">
        Drag using the handle to change room
      </div>
    </div>
  );
}



  function RoomDropZone({ room, children }) {
    const disabled = room.roomStatus !== "READY";

    const { setNodeRef, isOver } = useDroppable({
      id: room.roomId,
      disabled,
      data: { room }
    });

    return (
      <div
        ref={setNodeRef}
        className={`
        flex-1 p-4 transition-all duration-200
        ${disabled
            ? "bg-gray-100"
            : isOver
              ? "bg-green-100 ring-2 ring-green-400"
              : "bg-white"
          }
      `}
      >
        {children}
      </div>
    );
  }


  const handleDragStart = ({ active }) => {
    setActiveRoom(active.data.current.room);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveRoom(null);

    if (!over) return;

    const stayRoom = active.data.current.room;
    const targetRoomId = over.id;

    if (stayRoom.roomId === targetRoomId) return;

    if (!window.confirm("Change room for this guest?")) return;

    await changeRoom(stayRoom.stayId, targetRoomId);
    fetchRooms();
  };


  if (loading) {
    return <p className="text-gray-500">Loading rooms…</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Room Board</h2>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <div className="space-y-4">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room.roomId} className="flex border rounded-xl">
                <div className="w-38 bg-gray-100 p-4 border-r">
                  Room {room.roomNumber}
                  <p>{room.roomStatus}</p>
                </div>

                <RoomDropZone room={room}>
                  {room.stayId ? (
                    <StayCard room={room} />
                  ) : (
                    <p className="text-gray-400 italic">Empty room</p>
                  )}
                </RoomDropZone>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeRoom ? (
              <StayCard room={activeRoom} dragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

