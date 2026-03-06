import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import EditRoomDialog from "../../../components/EditRoomDialog";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formRooms, setFormRooms] = useState([
    { room_number: "", room_type_id: "", floor: "" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    const res = await api.get("rooms/rooms");
    setRooms(res.data.data);
  };

  const fetchRoomTypes = async () => {
    const res = await api.get("rooms/room-types");
    setRoomTypes(res.data.data);
  };

  const handleChange = (index, field, value) => {
    const updated = [...formRooms];
    updated[index][field] = value;
    setFormRooms(updated);
  };

  const addRow = () => {
    setFormRooms([
      ...formRooms,
      { room_number: "", room_type_id: "", floor: "" }
    ]);
  };

  const removeRow = (index) => {
    const updated = formRooms.filter((_, i) => i !== index);
    setFormRooms(updated);
  };

  const createRooms = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("rooms/create-room", { rooms: formRooms });
      alert("Rooms created successfully");
      setFormRooms([{ room_number: "", room_type_id: "", floor: "" }]);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const toggleRoom = async (id) => {
    try {
      await api.patch(`/rooms/${id}/toggle-active`);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // Calculate stats
  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(r => r.is_active === 1).length;
  const totalFloors = [...new Set(rooms.map(r => r.floor).filter(Boolean))].length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
        <p className="text-gray-600 mt-1">Create and manage hotel rooms efficiently</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Rooms</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalRooms}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Rooms</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeRooms}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Room Types</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{roomTypes.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Floors</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalFloors}</p>
        </div>
      </div>

      {/* Create Rooms Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-800">Create New Rooms</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">Add multiple rooms at once using the form below</p>
        </div>

        <form onSubmit={createRooms} className="p-6">
          <div className="space-y-4">
            {formRooms.map((room, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group"
              >
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-700">
                  {index + 1}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pl-4">
                  {/* Room Number */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      placeholder="e.g., 101"
                      value={room.room_number}
                      onChange={(e) => handleChange(index, "room_number", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>

                  {/* Room Type */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Room Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={room.room_type_id}
                      onChange={(e) => handleChange(index, "room_type_id", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                      required
                    >
                      <option value="">Select category</option>
                      {roomTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} (${type.base_price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Floor */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Floor
                    </label>
                    <input
                      placeholder="e.g., 2"
                      value={room.floor}
                      onChange={(e) => handleChange(index, "floor", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-end gap-2">
                    <button
                      type="button"
                      onClick={addRow}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-1"
                      title="Add another room"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-xs">Add</span>
                    </button>

                    {formRooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1"
                        title="Remove this room"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-xs">Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-50"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Rooms...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    Create {formRooms.length} Room{formRooms.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-400 text-center">
              All rooms will be created with default status "Available"
            </p>
          </div>
        </form>
      </div>

      {/* Rooms List Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Rooms List
              </h3>
              <p className="text-xs text-gray-500 mt-1">All rooms in the hotel</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              {rooms.length} rooms
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm mb-1">No rooms found</p>
                      <p className="text-gray-400 text-xs">Create your first room above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map((room, index) => (
                  <tr 
                    key={room.id} 
                    className={`
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      hover:bg-gray-100/50 transition
                      ${room.is_active ? "" : "opacity-60"}
                    `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        <span className="font-medium text-gray-800">
                          Room {room.room_number}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        {room.room_type || 'Standard'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {room.floor ? (
                        <span className="text-gray-600">Floor {room.floor}</span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-xs font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={room.is_active === 1}
                          onChange={() => toggleRoom(room.id)}
                          className="sr-only peer"
                        />
                        <div className={`
                          w-11 h-6 rounded-full transition-colors
                          ${room.is_active === 1 ? 'bg-green-500' : 'bg-gray-300'}
                          peer-focus:ring-2 peer-focus:ring-green-200
                        `}>
                          <span className={`
                            absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                            transition-all duration-200
                            ${room.is_active === 1 ? 'translate-x-5' : 'translate-x-0'}
                          `}></span>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {room.is_active === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table Footer */}
            {rooms.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Showing {rooms.length} rooms</span>
                      <span className="text-gray-400">
                        {rooms.filter(r => r.floor).length} rooms have floor numbers
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      {selectedRoom && (
        <EditRoomDialog
          room={selectedRoom}
          close={() => setSelectedRoom(null)}
          refresh={fetchRooms}
        />
      )}
    </div>
  );
};

export default CreateRooms;