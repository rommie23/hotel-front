import { useEffect, useState } from "react";
import { getAvailableRooms, getPaymentMethods } from "../../api/rooms.api";
import { checkInGuest } from "../../api/stays.api";

export default function CheckIn() {
    // Guest Details State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");

    // Stay Details State
    const [checkinDate, setCheckinDate] = useState("");
    const [checkoutDate, setCheckoutDate] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Rooms State
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [modes, setModes] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // File Upload State
    const [photo, setPhoto] = useState(null);

    const fetchRooms = async () => {
        if (!checkinDate || !checkoutDate) {
            setError("Please select both check-in and check-out dates");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const res = await getAvailableRooms(checkinDate, checkoutDate);
            setRooms(res.rooms || []);
        } catch (err) {
            setError("Failed to fetch available rooms. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const selectedRoom = rooms.find(r => r.id == roomId);
    const nights =
        (new Date(checkoutDate) - new Date(checkinDate)) /
        (1000 * 60 * 60 * 24);

    const subtotal = (selectedRoom?.base_price || 0) * nights;

    const fetchPaymentModes = async () => {
        const res = await getPaymentMethods();
        setModes(res.filter(m => m.is_active));
    }

    useEffect(() => {
        fetchPaymentModes();
    }, [])


    // 🔁 Sync percent → amount
    const handlePercentChange = (value) => {
        const percent = Math.min(100, Math.max(0, value));
        setDiscountPercent(percent);

        const amount = (subtotal * percent) / 100;
        setDiscountAmount(Number(amount.toFixed(2)));
    };

    // 🔁 Sync amount → percent
    const handleAmountChange = (value) => {
        const amount = Math.max(0, value);
        setDiscountAmount(amount);

        if (subtotal > 0) {
            const percent = (amount / subtotal) * 100;
            setDiscountPercent(Number(percent.toFixed(2)));
        }
    };

    const finalTotal = subtotal - discountAmount;

    const handleSubmit = async () => {
        if (!name || !phone || !roomId) {
            setError("Guest name, phone number, and room are required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            // Guest fields
            formData.append("full_name", name);
            formData.append("phone", phone);
            formData.append("email", email);
            formData.append("id_type", idType);
            formData.append("id_number", idNumber);

            // Stay fields
            formData.append("roomId", roomId);
            formData.append("from", checkinDate);
            formData.append("to", checkoutDate);
            formData.append("payment", advanceAmount || 0);
            formData.append("paymentMode", paymentMode || '');
            formData.append("discount_amount", discountAmount || 0);

            // Guest photo (optional)
            if (photo) {
                formData.append("photo", photo);
            }

            const res = await checkInGuest(formData);
            // console.log(res);

            setMessage(
                `Check-in successful! Stay ID: ${res.data.stayId} | Due: ₹${res.data.summary.dueAmount}`
            );

            // Reset form
            setName("");
            setPhone("");
            setEmail("");
            setIdType("");
            setIdNumber("");
            setRoomId("");
            setAdvanceAmount("");
            setPaymentMode("");
            setPhoto(null);
            setRooms([]);
            setCheckinDate("");
            setCheckoutDate("");

        } catch (err) {
            console.error(err);
            setError("Check-in failed. Please verify all details and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Guest Check-In</h2>
                <p className="text-gray-600 mt-1">Complete the form to check in a new guest</p>
            </div>

            {/* Guest Details Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Guest Details</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter guest name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter email (optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Type
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                value={idType}
                                onChange={(e) => setIdType(e.target.value)}
                            >
                                <option value="">Select ID type</option>
                                <option value="PASSPORT">Passport</option>
                                <option value="AADHAAR">Aadhaar</option>
                                <option value="DRIVING_LICENSE">Driving License</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Number
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter ID number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Photo
                            </label>
                            <div className="flex items-center">
                                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg transition flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Upload photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </label>
                                {photo && (
                                    <span className="ml-3 text-sm text-gray-600 truncate max-w-45">
                                        {photo.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stay Details Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Stay Details</h3>
                </div>

                <div className="p-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Check-in Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                value={checkinDate}
                                onChange={(e) => setCheckinDate(e.target.value)}
                            />
                        </div>

                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Check-out Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                value={checkoutDate}
                                onChange={(e) => setCheckoutDate(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={fetchRooms}
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Checking..." : "Check Availability"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Room Selection Section */}
            {rooms.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 animate-fadeIn">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Select Room</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    <div className="p-6">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        >
                            <option value="">Choose a room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.room_number} — ₹{room.base_price}/night
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Payment Section */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Advance Payment</h3>
                    <p className="text-sm text-gray-600 mt-1">Optional, can be completed later</p>
                </div>

                <div className="p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full sm:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <option value="0">Payment Mode</option>
                                {Array.isArray(modes) && modes.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-50">
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Amount"
                                    value={advanceAmount}
                                    onChange={(e) => setAdvanceAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">

                <h3 className="font-semibold text-gray-800">
                    Checkout Summary
                </h3>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Discount:</span>

                        <div className="flex gap-2 items-center">

                            {/* Amount */}
                            <input
                                type="number"
                                value={discountAmount}
                                onChange={(e) =>
                                    handleAmountChange(Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                            />
                            <span>$</span>

                            {/* Percent */}
                            <input
                                type="number"
                                value={discountPercent}
                                onChange={(e) =>
                                    handlePercentChange(Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 border rounded text-right"
                            />
                            <span>%</span>

                        </div>
                    </div>

                    <div className="flex justify-between font-semibold text-green-600 text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-3">

                    <h4 className="text-sm font-medium text-gray-700">
                        Add Payment
                    </h4>

                    <div className="flex gap-3">

                        {/* Amount */}
                        <input
                            type="number"
                            placeholder="Amount"
                            value={advanceAmount}
                            onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                            className="flex-1 px-3 py-2 border rounded"
                        />

                        {/* Mode */}
                        <select
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded"
                        >
                            <option value="">Select mode</option>
                            {modes.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        {error}
                    </p>
                </div>
            )}

            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        {message}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Processing...
                        </>
                    ) : (
                        "Confirm Check-In"
                    )}
                </button>
            </div>
        </div>
    );
}