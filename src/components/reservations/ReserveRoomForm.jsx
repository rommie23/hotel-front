import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getRoomTypes } from "../../api/rooms.api";
import { CalendarIcon, UserIcon, PhoneIcon, EnvelopeIcon, HomeIcon, TagIcon } from "@heroicons/react/24/outline";

const ReserveRoomForm = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentAmount, setPaymentAmount] = useState(0);

    const [form, setForm] = useState({
        guest_name: "",
        guest_phone: "",
        guest_email: "",
        room_type_id: "",
        rooms_count: 1,
        checkin_date: "",
        checkout_date: "",
        price_per_night: ""
    });

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        const res = await getRoomTypes();
        setRoomTypes(res);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "room_type_id") {
            const selected = roomTypes.find(
                (t) => t.id == value
            );
            setForm({
                ...form,
                room_type_id: value,
                price_per_night: selected?.base_price || ""
            });
            return;
        }
        setForm({
            ...form,
            [name]: value
        });
    };

    const calculateNights = () => {
        if (!form.checkin_date || !form.checkout_date) return 0;
        const start = new Date(form.checkin_date);
        const end = new Date(form.checkout_date);
        const diff = (end - start) / (1000 * 60 * 60 * 24);
        return diff > 0 ? diff : 0;
    };

    const nights = calculateNights();
    const subtotal = nights * (form.rooms_count || 1) * (form.price_per_night || 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = subtotal - discountAmount;

    const checkAvailability = async () => {
        try {
            const res = await api.get(
                "/reservations/availability",
                {
                    params: {
                        room_type_id: form.room_type_id,
                        checkin_date: form.checkin_date,
                        checkout_date: form.checkout_date
                    }
                }
            );
            setAvailableRooms(res.data.data.available_rooms);
        } catch (error) {
            alert(error.response?.data?.message || "Availability error");
        }
    };

    const createReservation = async (e) => {
        e.preventDefault();
        try {
            await api.post("/reservations/reserve-rooms", {
                ...form,
                discount_percent: discountPercent,
                discount_amount: discountAmount,
                total_amount: finalTotal,
                paymentAmount,
                paymentMode
            });

            alert("Reservation created");

            setForm({
                guest_name: "",
                guest_phone: "",
                guest_email: "",
                room_type_id: "",
                rooms_count: 1,
                checkin_date: "",
                checkout_date: "",
                price_per_night: ""
            });

            setDiscountPercent(0);
            setAvailableRooms("");
            setPaymentAmount(0)
            setPaymentMode("")
        } catch (error) {
            alert(error.response?.data?.message || "Reservation failed");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Reserve Room</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Create a new room reservation</p>
                    </div>
                </div>
            </div>

            <form onSubmit={createReservation} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Guest Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>
                            Guest Information
                        </h3>

                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <UserIcon className="w-4 h-4" />
                            </span>
                            <input
                                name="guest_name"
                                placeholder="Guest Name"
                                value={form.guest_name}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <PhoneIcon className="w-4 h-4" />
                            </span>
                            <input
                                name="guest_phone"
                                placeholder="Phone Number"
                                value={form.guest_phone}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <EnvelopeIcon className="w-4 h-4" />
                            </span>
                            <input
                                name="guest_email"
                                placeholder="Email Address"
                                value={form.guest_email}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Room Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>
                            Room Details
                        </h3>

                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <TagIcon className="w-4 h-4" />
                            </span>
                            <select
                                name="room_type_id"
                                value={form.room_type_id}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                            >
                                <option value="">Select Room Category</option>
                                {roomTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} - ${type.base_price}/night
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <CalendarIcon className="w-4 h-4" />
                                </span>
                                <input
                                    type="date"
                                    name="checkin_date"
                                    value={form.checkin_date}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <CalendarIcon className="w-4 h-4" />
                                </span>
                                <input
                                    type="date"
                                    name="checkout_date"
                                    value={form.checkout_date}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={checkAvailability}
                            className="w-full px-4 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition"
                        >
                            Check Availability
                        </button>

                        {availableRooms !== null && (
                            <div className={`p-3 rounded-lg text-sm ${availableRooms > 0
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {availableRooms > 0 ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        {availableRooms} room{availableRooms !== 1 ? 's' : ''} available
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                        No rooms available for selected dates
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Room Configuration</h3>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Number of Rooms</label>
                                <input
                                    name="rooms_count"
                                    type="number"
                                    min="1"
                                    value={form.rooms_count}
                                    onChange={handleChange}
                                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Price per Night</label>
                                <div className="relative w-48">
                                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                                    <input
                                        name="price_per_night"
                                        type="number"
                                        value={form.price_per_night}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Price Summary</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nights:</span>
                                    <span className="font-medium">{nights}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rooms:</span>
                                    <span className="font-medium">{form.rooms_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">Discount:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={discountPercent}
                                            onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-right"
                                            min="0"
                                            max="100"
                                        />
                                        <span>%</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-2 font-semibold">
                                    <span>Total:</span>
                                    <span className="text-lg text-green-600">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
                    <div className="w-full sm:w-48">
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                        >
                            <option value="0">Payment Mode</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Amount"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={!availableRooms || availableRooms < form.rooms_count}
                        className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-50"
                    >
                        Create Reservation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReserveRoomForm;