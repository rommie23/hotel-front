// import { Dialog } from "@headlessui/react";
// import { useState } from "react";
// import api from "../../api/axios";

// export default function ReservationDetailsDialog({
//     open,
//     setOpen,
//     reservation,
//     payments,
//     reloadReservation
// }) {

//     const [amount, setAmount] = useState("");
//     const [mode, setMode] = useState("CASH");

//     const addPayment = async () => {
//         try {
//             const paymentAmount = Number(amount);
//             if (!paymentAmount || paymentAmount <= 0) {
//                 alert("Enter valid amount");
//                 return;
//             }
//             const remaining = reservation.total_amount - reservation.paid_amount;
//             if (paymentAmount > remaining) {
//                 alert("Payment cannot exceed remaining balance");
//                 return;
//             }
//             await api.post(`/reservations/${reservation.id}/payments`, {
//                 amount: paymentAmount,
//                 payment_mode: mode
//             });
//             setAmount("");
//             // reload reservation details
//             await reloadReservation(reservation.id);
//         } catch (err) {
//             alert(err.response?.data?.message || "Payment failed");
//         }
//     };

//     if (!reservation) return null;

//     return (
//         <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">

//             <div className="fixed inset-0 bg-black/30" />

//             <div className="fixed inset-0 flex items-center justify-center p-4">

//                 <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-2xl">

//                     <Dialog.Title className="text-xl font-semibold mb-4">
//                         Reservation #{reservation.id}
//                     </Dialog.Title>

//                     {/* Guest */}
//                     <div className="mb-4">
//                         <h3 className="font-semibold">Guest</h3>
//                         <p>{reservation.guest_name}</p>
//                         <p>{reservation.guest_phone}</p>
//                     </div>

//                     {/* Stay */}
//                     <div className="mb-4">
//                         <h3 className="font-semibold">Stay</h3>
//                         <p>Room Type: {reservation.room_type}</p>
//                         <p>Check-in: {reservation.checkin_date}</p>
//                         <p>Check-out: {reservation.checkout_date}</p>
//                         <p>Nights: {reservation.total_nights}</p>
//                     </div>

//                     {/* Financial */}
//                     <div className="mb-4">
//                         <h3 className="font-semibold">Financial</h3>
//                         <p>Total: ₹{reservation.total_amount}</p>
//                         <p>Paid: ₹{reservation.paid_amount}</p>
//                         <p>Due: ₹{reservation.due_amount}</p>
//                     </div>

//                     {/* Payments */}
//                     <div className="mb-4">
//                         <h3 className="font-semibold mb-2">Payments</h3>

//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b">
//                                     <th>Date</th>
//                                     <th>Mode</th>
//                                     <th>Amount</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {payments.map(p => (
//                                     <tr key={p.id}>
//                                         <td>{new Date(p.received_at).toLocaleDateString()}</td>
//                                         <td>{p.payment_mode}</td>
//                                         <td>₹{p.amount}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Add Payment */}
//                     <div className="flex gap-2">

//                         <input
//                             type="number"
//                             placeholder="Amount"
//                             className="border p-2 rounded w-full"
//                             value={amount}
//                             onChange={(e) => setAmount(e.target.value)}
//                         />

//                         <select
//                             className="border p-2 rounded"
//                             value={mode}
//                             onChange={(e) => setMode(e.target.value)}
//                         >
//                             <option value="CASH">Cash</option>
//                             <option value="CARD">Card</option>
//                             <option value="Bank Transfer">Bank Transfer</option>
//                         </select>

//                         <button
//                             disabled={!amount}
//                             onClick={addPayment}
//                             className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
//                         >
//                             Add Payment
//                         </button>

//                     </div>

//                 </Dialog.Panel>
//             </div>

//         </Dialog>
//     );
// }

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import api from "../../api/axios";
import {
    XMarkIcon,
    UserIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    BanknotesIcon
} from "@heroicons/react/24/outline";

export default function ReservationDetailsDialog({
    open,
    setOpen,
    reservation,
    payments,
    reloadReservation,
    status
}) {
    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("CASH");    

    const addPayment = async () => {
        try {
            const paymentAmount = Number(amount);
            if (!paymentAmount || paymentAmount <= 0) {
                alert("Enter valid amount");
                return;
            }
            const remaining = reservation.total_amount - reservation.paid_amount;
            if (paymentAmount > remaining) {
                alert("Payment cannot exceed remaining balance");
                return;
            }
            await api.post(`/reservations/${reservation.id}/payments`, {
                amount: paymentAmount,
                payment_mode: mode
            });
            setAmount("");
            await reloadReservation(reservation.id);
        } catch (err) {
            alert(err.response?.data?.message || "Payment failed");
        }
    };

    if (!reservation) return null;

    // Payment mode badge colors
    const getPaymentModeColor = (mode) => {
        const colors = {
            'CASH': 'bg-green-100 text-green-700',
            'CARD': 'bg-blue-100 text-blue-700',
            'Bank Transfer': 'bg-purple-100 text-purple-700'
        };
        return colors[mode] || 'bg-gray-100 text-gray-700';
    };

    const remainingAmount = reservation.total_amount - reservation.paid_amount;

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <Dialog.Title className="text-lg font-semibold text-gray-800">
                                    Reservation Details
                                </Dialog.Title>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    ID: #{reservation.id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-white/50 rounded-lg transition"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Guest Information Card */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                                <UserIcon className="w-4 h-4 text-indigo-500" />
                                Guest Information
                            </h3>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-sm font-medium text-indigo-700">
                                        {reservation.guest_name?.charAt(0) || 'G'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{reservation.guest_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{reservation.guest_phone}</p>
                                    {reservation.guest_email && (
                                        <p className="text-sm text-gray-500">{reservation.guest_email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stay Details Card */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                                Stay Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Room Type</p>
                                    <p className="font-medium text-gray-800">{reservation.room_type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Nights</p>
                                    <p className="font-medium text-gray-800">{reservation.total_nights}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Check-in</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(reservation.checkin_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Check-out</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(reservation.checkout_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-linear-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                                <CurrencyDollarIcon className="w-4 h-4 text-indigo-500" />
                                Financial Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="text-lg font-bold text-gray-800">₹{reservation.total_amount}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">Paid</p>
                                    <p className="text-lg font-bold text-green-600">₹{reservation.paid_amount}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">Due</p>
                                    <p className={`text-lg font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                        ₹{reservation.due_amount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payments History */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                                <CreditCardIcon className="w-4 h-4 text-indigo-500" />
                                Payment History
                            </h3>

                            {payments.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No payments recorded yet
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 rounded-lg">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Mode</th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {payments.map(p => (
                                                <tr key={p.id} className="hover:bg-gray-100/50">
                                                    <td className="px-3 py-2 text-gray-600">
                                                        {new Date(p.received_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentModeColor(p.payment_mode)}`}>
                                                            {p.payment_mode}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-medium text-green-600">
                                                        ₹{p.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t border-gray-200">
                                            <tr>
                                                <td colSpan="2" className="px-3 py-2 text-sm font-medium text-gray-700">
                                                    Total Paid
                                                </td>
                                                <td className="px-3 py-2 text-right font-bold text-green-600">
                                                    ₹{payments.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Add Payment Section */}
                        {remainingAmount > 0 && status != "CHECKED_IN" && (
                            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                                    <BanknotesIcon className="w-4 h-4 text-blue-500" />
                                    Add Payment
                                </h3>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                min="1"
                                                max={remainingAmount}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1.5">
                                            Max: ₹{remainingAmount}
                                        </p>
                                    </div>

                                    <select
                                        className="w-full sm:w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value)}
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>

                                    <button
                                        disabled={!amount || Number(amount) <= 0 || Number(amount) > remainingAmount}
                                        onClick={addPayment}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Payment
                                    </button>
                                </div>

                                {/* Quick amount suggestions */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <p className="text-xs text-gray-500 w-full">Quick select:</p>
                                    {[500, 1000, 2000, 5000].map(suggested => (
                                        suggested <= remainingAmount && (
                                            <button
                                                key={suggested}
                                                onClick={() => setAmount(suggested.toString())}
                                                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                ₹{suggested}
                                            </button>
                                        )
                                    ))}
                                    <button
                                        onClick={() => setAmount(remainingAmount.toString())}
                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition"
                                    >
                                        Full Due
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Fully Paid Message */}
                        {remainingAmount === 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-700 font-medium">Fully Paid</p>
                                <p className="text-xs text-green-600 mt-1">No due amount remaining</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}