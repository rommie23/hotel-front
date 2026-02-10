import { useState } from "react";
import { getAvailableRooms } from "../../api/rooms.api";
import { checkInGuest } from "../../api/stays.api";

export default function CheckIn() {
    // Guest
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");


    // Stay
    const [checkinDate, setCheckinDate] = useState("");
    const [checkoutDate, setCheckoutDate] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");

    // Rooms
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");

    // UI
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchRooms = async () => {
        if (!checkinDate || !checkoutDate) {
            setError("Select check-in and check-out dates");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const res = await getAvailableRooms(checkinDate, checkoutDate);
            setRooms(res.rooms || []);
        } catch (err) {
            setError("Failed to fetch available rooms");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!name || !phone || !roomId) {
            setError("Guest name, phone and room are required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const payload = {
                guest: { full_name: name, phone, email, id_type: idType, id_number: idNumber },
                roomId,
                from: checkinDate,
                to: checkoutDate,
                payment: advanceAmount ? Number(advanceAmount) : 0,
            };

            const res = await checkInGuest(payload);

            setMessage(
                `Check-in successful. Stay ID: ${res.stayId}. Due: ₹${res.dueAmount}`
            );

            // reset form (optional)
            setName("");
            setPhone("");
            setEmail("");
            setRoomId("");
            setRooms([]);
            setAdvanceAmount("");

        } catch (err) {
            console.error(err);
            setError("Check-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Guest Check-In</h2>

            {/* Guest Details */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h3 className="font-semibold mb-4">Guest Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="border px-3 py-2 rounded-lg"
                        placeholder="Guest Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="border px-3 py-2 rounded-lg"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="border px-3 py-2 rounded-lg"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <select
                        className="border px-3 py-2 rounded-lg"
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                    >
                        <option value="">Select ID Type</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="AADHAAR">Aadhaar</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input
                        className="border px-3 py-2 rounded-lg"
                        placeholder="ID Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                    />
                </div>
            </div>

            {/* Stay Dates */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h3 className="font-semibold mb-4">Stay Details</h3>

                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm mb-1">Check-in</label>
                        <input
                            type="date"
                            className="border px-3 py-2 rounded-lg"
                            value={checkinDate}
                            onChange={(e) => setCheckinDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Check-out</label>
                        <input
                            type="date"
                            className="border px-3 py-2 rounded-lg"
                            value={checkoutDate}
                            onChange={(e) => setCheckoutDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={fetchRooms}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Check Availability
                    </button>
                </div>
            </div>

            {/* Room Selection */}
            {rooms.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow mb-6">
                    <h3 className="font-semibold mb-4">Select Room</h3>

                    <select
                        className="border px-3 py-2 rounded-lg w-full"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    >
                        <option value="">Select room</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                Room {room.room_number} – ₹{room.base_price}/night
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Payment */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h3 className="font-semibold mb-4">Advance Payment (Optional)</h3>
                <input
                    type="number"
                    className="border px-3 py-2 rounded-lg"
                    placeholder="Amount"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                />
            </div>

            {/* Messages */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-600 mb-4">{message}</p>}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
                {loading ? "Processing..." : "Confirm Check-In"}
            </button>
        </div>
    );
}
