import { useEffect, useState } from "react";
import api from "../../api/axios";
import CancelReservationDialog from "./CancelReservationDialog";
import { allReservations } from "../../api/reservations.api";
import CheckinDialog from "../../components/reservations/CheckinDialog";
import { CalendarIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ReservationDetailsDialog from "./ReservationDetailsDialog";

const ReservationsTable = () => {
    const [reservations, setReservations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [checkinDialog, setCheckinDialog] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [payments, setPayments] = useState([]);
    const [status, setStatus] = useState([]);


    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const res = await allReservations();
        setReservations(res);
    };

    const checkinReservation = async (reservation) => {
        try {
            const res = await api.post(
                `/reservations/${reservation.id}/checkin`
            );
            setCheckinDialog({
                reservation,
                stayId: res.data.stay_id,
                assignedRoom: res.data.assigned_room
            });
        } catch (error) {
            alert(error.response?.data?.message || "Check-in failed");
        }
    };

    // Status color mapping
    const getStatusColor = (status) => {
        const colors = {
            'BOOKED': 'bg-blue-100 text-blue-700 border-blue-200',
            'CONFIRMED': 'bg-green-100 text-green-700 border-green-200',
            'CANCELLED': 'bg-red-100 text-red-700 border-red-200',
            'COMPLETED': 'bg-gray-100 text-gray-700 border-gray-200',
            'NO_SHOW': 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Calculate stats
    const totalReservations = reservations.length;
    const bookedCount = reservations.filter(r => r.status === 'BOOKED').length;
    const cancelledCount = reservations.filter(r => r.status === 'CANCELLED').length;

    const openReservation = async (id, status) => {
        const res = await api.get(`/reservations/${id}/details`);
        setReservation(res.data.reservation);
        setPayments(res.data.payments);
        setStatus(status)

        setDialogOpen(true);
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
                                Guest
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Room Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check-in
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check-out
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
                        {reservations.length === 0 ? (
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
                            reservations.map((r, index) => (
                                <tr
                                    key={r.id}
                                    className={`
                                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                                        hover:bg-gray-200 transition cursor-pointer
                                    `}
                                    onClick={() => openReservation(r.id, r.status)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-indigo-700">
                                                    {r.guest_name?.charAt(0) || 'G'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">{r.guest_name}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                            {r.room_type}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(r.checkin_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>

                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(r.checkout_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${getStatusColor(r.status)}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5
                                                ${r.status === 'BOOKED' ? 'bg-blue-500' : ''}
                                                ${r.status === 'CONFIRMED' ? 'bg-green-500' : ''}
                                                ${r.status === 'CANCELLED' ? 'bg-red-500' : ''}
                                                ${r.status === 'COMPLETED' ? 'bg-gray-500' : ''}
                                            `}></span>
                                            {r.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {r.status === "BOOKED" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        checkinReservation(r);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs font-medium"
                                                >
                                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                                    Check-in
                                                </button>
                                            )}
                                            {r.status == "BOOKED" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelected(r);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium"
                                                >
                                                    <XMarkIcon className="w-3.5 h-3.5" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <ReservationDetailsDialog
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    reservation={reservation}
                    payments={payments}
                    status={status}
                    reloadReservation={openReservation}
                />
            </div>

            {/* Dialogs */}
            {selected && (
                <CancelReservationDialog
                    reservation={selected}
                    close={() => setSelected(null)}
                    refresh={fetchReservations}
                />
            )}
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