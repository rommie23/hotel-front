import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import EditRoomDialog from "./EditRoomDialog";

const RoomsTable = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        const res = await axios.get("/rooms/rooms");
        setRooms(res.data.data);
    };

    const toggleRoom = async (id) => {
        await axios.patch(`/rooms/${id}/toggle-active`);
        fetchRooms();
    };

    // Status color mapping
    const getStatusColor = (status) => {
        const colors = {
            'available': 'bg-green-100 text-green-700 border-green-200',
            'occupied': 'bg-red-100 text-red-700 border-red-200',
            'maintenance': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'cleaning': 'bg-blue-100 text-blue-700 border-blue-200',
            'reserved': 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Calculate stats
    const totalRooms = rooms.length;
    const activeRooms = rooms.filter(r => r.is_active === 1).length;
    const availableRooms = rooms.filter(r => r.status?.toLowerCase() === 'available').length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with stats */}
            <div className="px-6 py-5 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">All Rooms</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Manage room settings and availability</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold text-gray-800 ml-1">{totalRooms}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-green-50 rounded-lg">
                            <span className="text-green-600">Active:</span>
                            <span className="font-semibold text-green-700 ml-1">{activeRooms}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-blue-50 rounded-lg">
                            <span className="text-blue-600">Available:</span>
                            <span className="font-semibold text-blue-700 ml-1">{availableRooms}</span>
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
                                Room
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Floor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Active
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {rooms.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm mb-1">No rooms found</p>
                                        <p className="text-gray-400 text-xs">Add rooms to get started</p>
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
                                            ${room.is_active ? "" : "opacity-40"}
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
                                            {room.room_type || '-'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="text-gray-600">
                                            {room.floor ? `Floor ${room.floor}` : '-'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${getStatusColor(room.status)}
                                        `}>
                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5
                                                ${room.status?.toLowerCase() === 'available' ? 'bg-green-500' : ''}
                                                ${room.status?.toLowerCase() === 'occupied' ? 'bg-red-500' : ''}
                                                ${room.status?.toLowerCase() === 'maintenance' ? 'bg-yellow-500' : ''}
                                                ${room.status?.toLowerCase() === 'cleaning' ? 'bg-blue-500' : ''}
                                                ${room.status?.toLowerCase() === 'reserved' ? 'bg-purple-500' : ''}
                                            "></span>
                                            {room.status || 'unknown'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedRoom(room)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-xs font-medium group"
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

                    {/* Table Footer with Summary */}
                    {rooms.length > 0 && (
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-xs text-gray-500">
                                    <div className="flex items-center justify-between">
                                        <span>Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}</span>
                                        <span className="text-gray-400">
                                            Last updated: {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
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

export default RoomsTable;