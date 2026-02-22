import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomBoard, changeRoom } from "../../api/stays.api";
import { formatHotelDate, formatHotelDateTime } from "../../utils/dateTime";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";

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
      setRooms(res.rooms || res);
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
          rounded-xl border border-gray-200 bg-white p-4
          transition-all duration-200
          ${dragging 
            ? "shadow-2xl scale-105 ring-2 ring-indigo-400" 
            : "shadow-sm hover:shadow-md"
          }
        `}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-gray-800 text-lg">
              {room.guestName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Stay ID #{room.stayId}
            </p>
          </div>

          {/* Status Badge & Drag Handle */}
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium">
              Due: ₹{room.dueAmount}
            </span>
            <div
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition"
              title="Drag to change room"
            >
              <span className="text-gray-500 text-xl leading-none">⋮⋮</span>
            </div>
          </div>
        </div>

        {/* Stay Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-xs text-gray-400">Check-in:</p>{" "}
              <span className="text-gray-600">{formatHotelDateTime(room.checkinDate, room.hotelTimezone)}</span>
            </div>
            <div>
              <p className="font-medium text-xs text-gray-400">Expected Checkout:</p>{" "}
              <span className="text-gray-600">{formatHotelDate(room.expectedCheckoutDate)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/reception/billing/${room.stayId}`);
              }}
              className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Billing
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/reception/checkout/${room.stayId}`);
              }}
              className={`
                text-sm px-4 py-1.5 rounded-lg transition font-medium
                ${room.dueAmount > 0
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-green-600 text-white hover:bg-green-700"
                }
              `}
            >
              Checkout
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-gray-400 italic border-t border-gray-100 pt-2 mt-1">
          Drag using handle at top right to change room
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
          flex-1 p-4 transition-all duration-200 min-h-40
          ${disabled
            ? "bg-gray-50 border border-dashed border-gray-200"
            : isOver
              ? "bg-green-50 ring-2 ring-green-400 ring-inset"
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

    if (!window.confirm("Are you sure you want to change room for this guest?")) return;

    try {
      await changeRoom(stayRoom.stayId, targetRoomId);
      fetchRooms();
    } catch (err) {
      console.error(err);
      setError("Failed to change room. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading room board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Room Board</h2>
        <p className="text-gray-600 mt-1">Drag and drop guests to change rooms</p>
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

      {/* Room Board */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {rooms.map(room => (
            <div 
              key={room.roomId} 
              className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
            >
              {/* Room Sidebar */}
              <div className="w-40 bg-linear-to-b from-gray-50 to-white p-4 border-r border-gray-200 flex flex-col">
                <span className="font-semibold text-gray-800 text-lg">
                  Room {room.roomNumber}
                </span>
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 w-fit
                  ${room.roomStatus === "READY" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                  }
                `}>
                  {room.roomStatus}
                </span>
              </div>

              {/* Room Content */}
              <RoomDropZone room={room}>
                {room.stayId ? (
                  <StayCard room={room} />
                ) : (
                  <div className="h-full flex items-center justify-center min-h-35">
                    <p className="text-gray-400 italic text-sm">✨ Empty room • {`${room.roomStatus}`.charAt(0).toUpperCase() + `${room.roomStatus}`.slice(1).toLowerCase(  )} for check-in</p>
                  </div>
                )}
              </RoomDropZone>
            </div>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeRoom ? (
            <div className="transform rotate-3 shadow-2xl">
              <StayCard room={activeRoom} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {rooms.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">No rooms available</p>
          <p className="text-gray-400 text-sm mt-1">Add rooms to get started</p>
        </div>
      )}
    </div>
  );
}