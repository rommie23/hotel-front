import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { getRoomTypes } from "../api/rooms.api";

const EditRoomDialog = ({ room, close, refresh }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({
    room_number: room.room_number,
    room_type_id: room.room_type_id,
    floor: room.floor || ""
  });

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const loadRoomTypes = async () => {
    try {
      const data = await getRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/rooms/rooms/${room.id}`, form);
      refresh();
      close();
      alert("Room updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Edit Room</h3>
              <p className="text-xs text-gray-500 mt-0.5">Room #{room.room_number}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Room Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </span>
              <input
                value={form.room_number}
                onChange={(e) => handleChange("room_number", e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="e.g., 101"
              />
            </div>
          </div>

          {/* Room Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Room Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.room_type_id}
              onChange={(e) => handleChange("room_type_id", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
            >
              <option value="">Select room type</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Floor
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 5-7-5m14 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9l7-5 7 5z" />
                </svg>
              </span>
              <input
                value={form.floor}
                onChange={(e) => handleChange("floor", e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="e.g., 2"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Optional</p>
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
            onClick={handleUpdate}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition"
          >
            Update Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomDialog;