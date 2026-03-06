import { useEffect, useState } from "react";
import api from "../../api/axios";
import { startCleaning } from "../../api/housekeeping.api";

export default function CleaningBoard() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checklist, setChecklist] = useState({});

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const res = await api.get("/housekeeping/pending");
            const roomData = res.data.rooms || res.data;
            console.log(roomData);
            setRooms(roomData);

            const newChecklist = {};
            for (const room of roomData) {
                newChecklist[room.log_id] = {
                    bed_cleaned: false,
                    washroom_cleaned: false,
                    towels_replaced: false,
                    trash_removed: false,
                    final_check: false
                };
            }
            setChecklist(newChecklist);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCleaning = async (room) => {
        try {
            await startCleaning(room.log_id);
            setRooms(prev =>
                prev.map(r =>
                    r.log_id === room.log_id
                        ? { ...r, status: "IN_PROGRESS" }
                        : r
                )
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to start cleaning"
            );
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const toggleCheckbox = (logId, field) => {
        setChecklist(prev => ({
            ...prev,
            [logId]: {
                ...prev[logId],
                [field]: !prev[logId]?.[field]
            }
        }));
    };

    const markCleaned = async (room) => {
        try {
            const checklistState = checklist[room.log_id];
            console.log("Sending:", checklistState);
            await api.post(
                `/housekeeping/${room.log_id}/complete`,
                checklistState
            );
            await fetchRooms();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to complete cleaning"
            );
        }
    };

    // Calculate summary stats
    const pendingCount = rooms.filter(r => r.status === "PENDING").length;
    const inProgressCount = rooms.filter(r => r.status === "IN_PROGRESS").length;
    const completedCount = rooms.filter(r => r.status === "COMPLETED").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600">Loading cleaning tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Housekeeping Tasks</h1>
                <p className="text-gray-600 mt-1">Manage and track room cleaning activities</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Rooms</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{rooms.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Need cleaning</p>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Not started</p>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Being cleaned</p>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{completedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Ready for guests</p>
                </div>
            </div>

            {/* Tasks Grid */}
            <div className="space-y-4">
                {rooms.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-1">No cleaning tasks found</p>
                        <p className="text-gray-400 text-sm">All rooms are clean and ready for guests</p>
                    </div>
                ) : (
                    rooms.map(room => {
                        const roomChecklist = checklist[room.log_id];
                        if (!roomChecklist) return null;
                        
                        const allChecked = roomChecklist.bed_cleaned && 
                                          roomChecklist.washroom_cleaned && 
                                          roomChecklist.towels_replaced && 
                                          roomChecklist.trash_removed && 
                                          roomChecklist.final_check;
                        
                        const progressCount = Object.values(roomChecklist).filter(Boolean).length;
                        const progressPercent = (progressCount / 5) * 100;

                        return (
                            <div
                                key={room.room_id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                {/* Room Header */}
                                <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800">
                                                    Room {room.room_number}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`
                                                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                                        ${room.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                                                        ${room.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : ""}
                                                        ${room.status === "COMPLETED" ? "bg-green-100 text-green-800" : ""}
                                                    `}>
                                                        {room.status === "PENDING" && "⏳ "}
                                                        {room.status === "IN_PROGRESS" && "🔄 "}
                                                        {room.status === "COMPLETED" && "✅ "}
                                                        {room.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div>
                                            {room.status === "PENDING" && (
                                                <button
                                                    onClick={() => handleStartCleaning(room)}
                                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Start Cleaning
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="p-6">
                                    {/* Guest Info */}
                                    {(room.guestName || room.checkoutAt) && (
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                Previous Stay Info
                                            </h3>
                                            {room.guestName && (
                                                <div className="flex items-center gap-2 text-sm mb-1">
                                                    <span className="text-gray-400">Guest:</span>
                                                    <span className="font-medium text-gray-800">{room.guestName}</span>
                                                </div>
                                            )}
                                            {room.checkoutAt && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">Checked out:</span>
                                                    <span className="text-gray-600">
                                                        {new Date(room.checkoutAt).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress Bar (for in progress) */}
                                    {room.status === "IN_PROGRESS" && (
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span className="text-gray-600">Cleaning Progress</span>
                                                <span className="font-medium text-indigo-600">{progressCount}/5 tasks</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Checklist */}
                                    {room.status === "IN_PROGRESS" && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className={`
                                                    p-4 rounded-lg border transition
                                                    ${roomChecklist.bed_cleaned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                                                `}>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={roomChecklist.bed_cleaned}
                                                            onChange={() => toggleCheckbox(room.log_id, "bed_cleaned")}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className={`text-sm font-medium ${roomChecklist.bed_cleaned ? 'text-green-700' : 'text-gray-700'}`}>
                                                            🛏️ Bed cleaned
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className={`
                                                    p-4 rounded-lg border transition
                                                    ${roomChecklist.washroom_cleaned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                                                `}>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={roomChecklist.washroom_cleaned}
                                                            onChange={() => toggleCheckbox(room.log_id, "washroom_cleaned")}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className={`text-sm font-medium ${roomChecklist.washroom_cleaned ? 'text-green-700' : 'text-gray-700'}`}>
                                                            🚽 Washroom cleaned
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className={`
                                                    p-4 rounded-lg border transition
                                                    ${roomChecklist.towels_replaced ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                                                `}>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={roomChecklist.towels_replaced}
                                                            onChange={() => toggleCheckbox(room.log_id, "towels_replaced")}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className={`text-sm font-medium ${roomChecklist.towels_replaced ? 'text-green-700' : 'text-gray-700'}`}>
                                                            🧺 Towels replaced
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className={`
                                                    p-4 rounded-lg border transition
                                                    ${roomChecklist.trash_removed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                                                `}>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={roomChecklist.trash_removed}
                                                            onChange={() => toggleCheckbox(room.log_id, "trash_removed")}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className={`text-sm font-medium ${roomChecklist.trash_removed ? 'text-green-700' : 'text-gray-700'}`}>
                                                            🗑️ Trash removed
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className={`
                                                    p-4 rounded-lg border transition col-span-1 md:col-span-2
                                                    ${roomChecklist.final_check ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                                                `}>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={roomChecklist.final_check}
                                                            onChange={() => toggleCheckbox(room.log_id, "final_check")}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className={`text-sm font-semibold ${roomChecklist.final_check ? 'text-green-700' : 'text-gray-700'}`}>
                                                            ✅ Final inspection complete
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => markCleaned(room)}
                                                disabled={!roomChecklist.final_check || !allChecked}
                                                className={`
                                                    w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2
                                                    ${roomChecklist.final_check && allChecked
                                                        ? "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200"
                                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    }
                                                `}
                                            >
                                                {roomChecklist.final_check && allChecked ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Mark as Cleaned
                                                    </>
                                                ) : (
                                                    "Complete all tasks first"
                                                )}
                                            </button>
                                        </>
                                    )}

                                    {/* Completed State */}
                                    {room.status === "COMPLETED" && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                            <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-green-700 mb-1">Room Cleaned</h3>
                                            <p className="text-sm text-green-600">Ready for next guest</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}