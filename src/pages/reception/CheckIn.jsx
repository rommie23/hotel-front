// import { useEffect, useState } from "react";
// import { getAvailableRooms, getPaymentMethods } from "../../api/rooms.api";
// import { checkInGuest } from "../../api/stays.api";

// export default function CheckIn() {
//     // Guest Details State
//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [email, setEmail] = useState("");
//     const [idType, setIdType] = useState("");
//     const [idNumber, setIdNumber] = useState("");

//     // Stay Details State
//     const [checkinDate, setCheckinDate] = useState("");
//     const [checkoutDate, setCheckoutDate] = useState("");
//     const [advanceAmount, setAdvanceAmount] = useState("");
//     const [paymentMode, setPaymentMode] = useState("");
//     const [discountPercent, setDiscountPercent] = useState(0);
//     const [discountAmount, setDiscountAmount] = useState(0);

//     // Rooms State
//     const [rooms, setRooms] = useState([]);
//     const [roomId, setRoomId] = useState("");
//     const [modes, setModes] = useState([]);

//     // UI State
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     // File Upload State
//     const [photo, setPhoto] = useState(null);

//     const fetchRooms = async () => {
//         if (!checkinDate || !checkoutDate) {
//             setError("Please select both check-in and check-out dates");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");
//             const res = await getAvailableRooms(checkinDate, checkoutDate);
//             setRooms(res.rooms || []);
//         } catch (err) {
//             setError("Failed to fetch available rooms. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const selectedRoom = rooms.find(r => r.id == roomId);
//     const nights =
//         (new Date(checkoutDate) - new Date(checkinDate)) /
//         (1000 * 60 * 60 * 24);

//     const subtotal = (selectedRoom?.base_price || 0) * nights;

//     const fetchPaymentModes = async () => {
//         const res = await getPaymentMethods();
//         setModes(res.filter(m => m.is_active));
//     }

//     useEffect(() => {
//         fetchPaymentModes();
//     }, [])


//     // 🔁 Sync percent → amount
//     const handlePercentChange = (value) => {
//         const percent = Math.min(100, Math.max(0, value));
//         setDiscountPercent(percent);

//         const amount = (subtotal * percent) / 100;
//         setDiscountAmount(Number(amount.toFixed(2)));
//     };

//     // 🔁 Sync amount → percent
//     const handleAmountChange = (value) => {
//         const amount = Math.max(0, value);
//         setDiscountAmount(amount);

//         if (subtotal > 0) {
//             const percent = (amount / subtotal) * 100;
//             setDiscountPercent(Number(percent.toFixed(2)));
//         }
//     };

//     const finalTotal = subtotal - discountAmount;

//     const handleSubmit = async () => {
//         if (!name || !phone || !roomId) {
//             setError("Guest name, phone number, and room are required");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");
//             setMessage("");

//             const formData = new FormData();

//             // Guest fields
//             formData.append("full_name", name);
//             formData.append("phone", phone);
//             formData.append("email", email);
//             formData.append("id_type", idType);
//             formData.append("id_number", idNumber);

//             // Stay fields
//             formData.append("roomId", roomId);
//             formData.append("from", checkinDate);
//             formData.append("to", checkoutDate);
//             formData.append("payment", advanceAmount || 0);
//             formData.append("paymentMode", paymentMode || '');
//             formData.append("discount_amount", discountAmount || 0);

//             // Guest photo (optional)
//             if (photo) {
//                 formData.append("photo", photo);
//             }

//             const res = await checkInGuest(formData);
//             // console.log(res);

//             setMessage(
//                 `Check-in successful! Stay ID: ${res.data.stayId} | Due: ₹${res.data.summary.dueAmount}`
//             );

//             // Reset form
//             setName("");
//             setPhone("");
//             setEmail("");
//             setIdType("");
//             setIdNumber("");
//             setRoomId("");
//             setAdvanceAmount("");
//             setPaymentMode("");
//             setPhoto(null);
//             setRooms([]);
//             setCheckinDate("");
//             setCheckoutDate("");

//         } catch (err) {
//             console.error(err);
//             setError("Check-in failed. Please verify all details and try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-6xl mx-auto">
//             {/* Page Header */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800">Guest Check-In</h2>
//                 <p className="text-gray-600 mt-1">Complete the form to check in a new guest</p>
//             </div>

//             {/* Guest Details Section */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
//                 <div className="p-6 border-b border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800">Guest Details</h3>
//                 </div>

//                 <div className="p-6 space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Full Name <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 placeholder="Enter guest name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Phone Number <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="tel"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 placeholder="Enter phone number"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email Address
//                             </label>
//                             <input
//                                 type="email"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 placeholder="Enter email (optional)"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 ID Type
//                             </label>
//                             <select
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                                 value={idType}
//                                 onChange={(e) => setIdType(e.target.value)}
//                             >
//                                 <option value="">Select ID type</option>
//                                 <option value="PASSPORT">Passport</option>
//                                 <option value="AADHAAR">Aadhaar</option>
//                                 <option value="DRIVING_LICENSE">Driving License</option>
//                                 <option value="OTHER">Other</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 ID Number
//                             </label>
//                             <input
//                                 type="text"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 placeholder="Enter ID number"
//                                 value={idNumber}
//                                 onChange={(e) => setIdNumber(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 ID Photo
//                             </label>
//                             <div className="flex items-center">
//                                 <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg transition flex items-center gap-2">
//                                     <span className="text-sm text-gray-700">Upload photo</span>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         className="hidden"
//                                         onChange={(e) => setPhoto(e.target.files[0])}
//                                     />
//                                 </label>
//                                 {photo && (
//                                     <span className="ml-3 text-sm text-gray-600 truncate max-w-45">
//                                         {photo.name}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Stay Details Section */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
//                 <div className="p-6 border-b border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800">Stay Details</h3>
//                 </div>

//                 <div className="p-6">
//                     <div className="flex flex-wrap items-end gap-4">
//                         <div className="w-full sm:w-auto">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Check-in Date <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="date"
//                                 className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 value={checkinDate}
//                                 onChange={(e) => setCheckinDate(e.target.value)}
//                             />
//                         </div>

//                         <div className="w-full sm:w-auto">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Check-out Date <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="date"
//                                 className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                 value={checkoutDate}
//                                 onChange={(e) => setCheckoutDate(e.target.value)}
//                             />
//                         </div>

//                         <button
//                             onClick={fetchRooms}
//                             disabled={loading}
//                             className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? "Checking..." : "Check Availability"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Room Selection Section */}
//             {rooms.length > 0 && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 animate-fadeIn">
//                     <div className="p-6 border-b border-gray-100">
//                         <h3 className="text-lg font-semibold text-gray-800">Select Room</h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                             {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
//                         </p>
//                     </div>

//                     <div className="p-6">
//                         <select
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                             value={roomId}
//                             onChange={(e) => setRoomId(e.target.value)}
//                         >
//                             <option value="">Choose a room</option>
//                             {rooms.map((room) => (
//                                 <option key={room.id} value={room.id}>
//                                     Room {room.room_number} — ₹{room.base_price}/night
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             )}

//             {/* Payment Section */}
//             {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
//                 <div className="p-6 border-b border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800">Advance Payment</h3>
//                     <p className="text-sm text-gray-600 mt-1">Optional, can be completed later</p>
//                 </div>

//                 <div className="p-6">
//                     <div className="flex flex-wrap items-center gap-4">
//                         <div className="w-full sm:w-48">
//                             <select
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                                 value={paymentMode}
//                                 onChange={(e) => setPaymentMode(e.target.value)}
//                             >
//                                 <option value="0">Payment Mode</option>
//                                 {Array.isArray(modes) && modes.map((m) => (
//                                     <option key={m.id} value={m.id}>
//                                         {m.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="flex-1 min-w-50">
//                             <div className="relative">
//                                 <span className="absolute left-3 top-2 text-gray-500">$</span>
//                                 <input
//                                     type="number"
//                                     className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                     placeholder="Amount"
//                                     value={advanceAmount}
//                                     onChange={(e) => setAdvanceAmount(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">

//                 <h3 className="font-semibold text-gray-800">
//                     Checkout Summary
//                 </h3>

//                 {/* Summary */}
//                 <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
//                     <div className="flex justify-between">
//                         <span>Subtotal:</span>
//                         <span>${subtotal.toFixed(2)}</span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                         <span>Discount:</span>

//                         <div className="flex gap-2 items-center">

//                             {/* Amount */}
//                             <input
//                                 type="number"
//                                 value={discountAmount}
//                                 onChange={(e) =>
//                                     handleAmountChange(Number(e.target.value))
//                                 }
//                                 className="w-20 px-2 py-1 border rounded text-right"
//                             />
//                             <span>$</span>

//                             {/* Percent */}
//                             <input
//                                 type="number"
//                                 value={discountPercent}
//                                 onChange={(e) =>
//                                     handlePercentChange(Number(e.target.value))
//                                 }
//                                 className="w-16 px-2 py-1 border rounded text-right"
//                             />
//                             <span>%</span>

//                         </div>
//                     </div>

//                     <div className="flex justify-between font-semibold text-green-600 text-lg border-t pt-2">
//                         <span>Total:</span>
//                         <span>${finalTotal.toFixed(2)}</span>
//                     </div>
//                 </div>

//                 {/* Payment Section */}
//                 <div className="space-y-3">

//                     <h4 className="text-sm font-medium text-gray-700">
//                         Add Payment
//                     </h4>

//                     <div className="flex gap-3">

//                         {/* Amount */}
//                         <input
//                             type="number"
//                             placeholder="Amount"
//                             value={advanceAmount}
//                             onChange={(e) => setAdvanceAmount(Number(e.target.value))}
//                             className="flex-1 px-3 py-2 border rounded"
//                         />

//                         {/* Mode */}
//                         <select
//                             value={paymentMode}
//                             onChange={(e) => setPaymentMode(e.target.value)}
//                             className="flex-1 px-3 py-2 border rounded"
//                         >
//                             <option value="">Select mode</option>
//                             {modes.map((m) => (
//                                 <option key={m.id} value={m.id}>
//                                     {m.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Status Messages */}
//             {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-red-600 text-sm flex items-center gap-2">
//                         <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
//                         {error}
//                     </p>
//                 </div>
//             )}

//             {message && (
//                 <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                     <p className="text-green-700 text-sm flex items-center gap-2">
//                         <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full"></span>
//                         {message}
//                     </p>
//                 </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex justify-end">
//                 <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                     {loading ? (
//                         <>
//                             <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                             Processing...
//                         </>
//                     ) : (
//                         "Confirm Check-In"
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// }




// pages/CheckIn.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios"; // adjust path
import { getAvailableRooms, getPaymentMethods } from "../../api/rooms.api";
import { checkInGuest } from "../../api/stays.api";

export default function CheckIn() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  // ===== GUEST STATE =====
  const [primaryGuest, setPrimaryGuest] = useState({
    full_name: "", phone: "", email: "",
    id_type: "", id_number: "",
    street: "", city: "", province: ""
  });
  const [additionalGuests, setAdditionalGuests] = useState([]);
  const [primaryIdFile, setPrimaryIdFile] = useState(null);
  const [additionalIdFiles, setAdditionalIdFiles] = useState({});

  // ===== STAY & ROOM STATE =====
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentModes, setPaymentModes] = useState([]);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // ===== UI STATE =====
  const [loading, setLoading] = useState(false);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ===== LOAD PAYMENT MODES =====
  useEffect(() => {
    getPaymentMethods().then(res =>
      setPaymentModes(res.filter(m => m.is_active))
    ).catch(() => { });
  }, []);

  // ===== FETCH RESERVATION (if ID provided) =====
  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async () => {
      setLoadingReservation(true);
      try {
        const res = await api.get(`/reservations/${reservationId}/details`);
        const r = res.data.reservation;

        // ✅ Helper to safely extract YYYY-MM-DD
        const toDateOnly = (isoStr) => isoStr ? isoStr.split('T')[0] : '';

        setPrimaryGuest({
          full_name: r.guest_name || "",
          phone: r.guest_phone || "",
          email: r.guest_email || "",
          id_type: "", id_number: ""
        });

        // ✅ Apply formatting here
        setCheckinDate(toDateOnly(r.checkin_date));
        setCheckoutDate(toDateOnly(r.checkout_date));

        // Fetch available rooms...
        const roomsRes = await getAvailableRooms(toDateOnly(r.checkin_date), toDateOnly(r.checkout_date));
        setAvailableRooms((roomsRes.rooms || []).filter(room => room.room_type_id === r.room_type_id));
        if (r.paid_amount > 0) setAdvanceAmount(r.paid_amount.toString());
      } catch (err) {
        setError("Failed to load reservation details");
      } finally {
        setLoadingReservation(false);
      }
    };
    fetchReservation();
  }, [reservationId]);

  // ===== WALK-IN ROOM FETCH =====
  const handleFetchRooms = async () => {
    if (!checkinDate || !checkoutDate) return setError("Select dates first");
    setLoading(true);
    try {
      const res = await getAvailableRooms(checkinDate, checkoutDate);
      setAvailableRooms(res.rooms || []);
    } catch (err) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // ===== PRICING =====
  const nights = checkinDate && checkoutDate
    ? Math.max(1, Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const basePrice = selectedRoom?.base_price || 0;
  const subtotal = basePrice * nights;
  const total = Math.max(0, subtotal - discountAmount);

  // ===== ADD/REMOVE ADDITIONAL GUESTS =====
  const addGuest = () => setAdditionalGuests([...additionalGuests, { full_name: "" }]);
  const removeGuest = (idx) => {
    const updated = [...additionalGuests];
    updated.splice(idx, 1);
    setAdditionalGuests(updated);
    const newFiles = { ...additionalIdFiles };
    delete newFiles[idx];
    setAdditionalIdFiles(newFiles);
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    // 1. VALIDATION
    if (!primaryGuest.full_name?.trim() || !primaryGuest.phone?.trim()) {
      return setError("Primary guest name and phone are required");
    }
    if (!selectedRoom?.id) {
      return setError("Please select a room for this stay");
    }
    if (!checkinDate || !checkoutDate) {
      return setError("Check-in and check-out dates are required");
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      // 2. PRIMARY GUEST FIELDS
      formData.append("guest[full_name]", primaryGuest.full_name.trim());
      formData.append("guest[phone]", primaryGuest.phone.trim());
      formData.append("guest[email]", primaryGuest.email?.trim() || "");
      formData.append("guest[street]", primaryGuest.street?.trim() || "");
      formData.append("guest[city]", primaryGuest.city?.trim() || "");
      formData.append("guest[province]", primaryGuest.province || "");
      formData.append("guest[id_type]", primaryGuest.id_type || "");
      formData.append("guest[id_number]", primaryGuest.id_number?.trim() || "");

      // 3. ADDITIONAL GUESTS FIELDS
      additionalGuests.forEach((g, i) => {
        if (!g.full_name?.trim()) return; // Skip blank entries
        formData.append(`additionalGuests[${i}][full_name]`, g.full_name.trim());
        formData.append(`additionalGuests[${i}][phone]`, g.phone?.trim() || primaryGuest.phone);
        formData.append(`additionalGuests[${i}][id_type]`, g.id_type || "");
        formData.append(`additionalGuests[${i}][id_number]`, g.id_number?.trim() || "");
      });

      // 4. ID FILES (CRITICAL ORDER: Primary first, then additional)
      if (primaryIdFile) {
        formData.append("guestIdFiles", primaryIdFile);
      }
      additionalGuests.forEach((_, i) => {
        if (additionalIdFiles[i]) {
          formData.append("guestIdFiles", additionalIdFiles[i]);
        }
      });

      // 5. STAY & PAYMENT DETAILS
      formData.append("roomId", selectedRoom.id);
      if (reservationId) formData.append("reservationId", reservationId);
      formData.append("from", checkinDate);
      formData.append("to", checkoutDate);
      formData.append("payment", advanceAmount?.toString() || "0");
      formData.append("paymentMode", paymentMode || "");
      formData.append("discount_amount", discountAmount?.toString() || "0");

      // 6. API CALL
      const res = await checkInGuest(formData);

      // 7. SUCCESS HANDLING
      setMessage(`✓ Checked in ${primaryGuest.full_name} to Room ${selectedRoom.room_number} | Due: $${res.data.summary.dueAmount.toFixed(2)}`);

      setTimeout(() => {
        if (reservationId) {
          // Multi-room flow: Reset form for next room check-in
          setSelectedRoom(null);
          setPrimaryGuest({ full_name: "", phone: "", email: "", id_type: "", id_number: "", street: "", city: "", province: "" });
          setAdditionalGuests([]);
          setPrimaryIdFile(null);
          setAdditionalIdFiles({});
          setAdvanceAmount("");
          setPaymentMode("");
          setDiscountAmount(0);
          // Optionally call parent refresh function here
        } else {
          // Walk-in flow: Redirect to Active Stays
          navigate("/dashboard/active-stays");
        }
      }, 2500);

    } catch (err) {
      console.error("Check-in error:", err);
      setError(err.response?.data?.message || "Check-in failed. Please verify details.");
    } finally {
      setLoading(false);
    }
  };

  // ===== IS RESERVATION MODE? =====
  const isReservationMode = !!reservationId;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isReservationMode ? "Reservation Check-In" : "Direct Check-In"}
        </h2>
        <p className="text-gray-600 mt-1">
          {isReservationMode ? "Confirm guest details and assign a room" : "Check in a walk-in guest"}
        </p>
        {isReservationMode && (
          <span className="inline-flex items-center px-2.5 py-1 mt-2 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            🔗 Linked to Reservation #{reservationId}
          </span>
        )}
      </div>

      {loadingReservation && (
        <div className="flex justify-center py-8">
          <span className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      {!loadingReservation && (
        <>
          {/* Primary Guest */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Primary Guest Details</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Row 1: Core Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter full name"
                    value={primaryGuest.full_name}
                    onChange={(e) => setPrimaryGuest({ ...primaryGuest, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Primary contact"
                    value={primaryGuest.phone}
                    onChange={(e) => setPrimaryGuest({ ...primaryGuest, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Optional"
                    value={primaryGuest.email || ""}
                    onChange={(e) => setPrimaryGuest({ ...primaryGuest, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: ID Details & Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    value={primaryGuest.id_type || ""}
                    onChange={(e) => setPrimaryGuest({ ...primaryGuest, id_type: e.target.value })}
                  >
                    <option value="">Select ID type</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="HEALTH_CARD">Health Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ID / Passport number"
                    value={primaryGuest.id_number || ""}
                    onChange={(e) => setPrimaryGuest({ ...primaryGuest, id_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Upload</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <span className="text-sm text-gray-600 truncate flex-1">
                      {primaryIdFile ? primaryIdFile.name : "Choose file (Img/PDF)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && setPrimaryIdFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              {/* Row 3: Address (Separated for clarity) */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Guest Address (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="123 Main Street, Apt 4B"
                      value={primaryGuest.street || ""}
                      onChange={(e) => setPrimaryGuest({ ...primaryGuest, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Toronto"
                      value={primaryGuest.city || ""}
                      onChange={(e) => setPrimaryGuest({ ...primaryGuest, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      value={primaryGuest.province || ""}
                      onChange={(e) => setPrimaryGuest({ ...primaryGuest, province: e.target.value })}
                    >
                      <option value="">Select Province</option>
                      <option value="AB">Alberta (AB)</option>
                      <option value="BC">British Columbia (BC)</option>
                      <option value="MB">Manitoba (MB)</option>
                      <option value="NB">New Brunswick (NB)</option>
                      <option value="NL">Newfoundland & Labrador (NL)</option>
                      <option value="NS">Nova Scotia (NS)</option>
                      <option value="ON">Ontario (ON)</option>
                      <option value="PE">Prince Edward Island (PE)</option>
                      <option value="QC">Quebec (QC)</option>
                      <option value="SK">Saskatchewan (SK)</option>
                      <option value="NT">Northwest Territories (NT)</option>
                      <option value="NU">Nunavut (NU)</option>
                      <option value="YT">Yukon (YT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Guests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Additional Guests</h3>
              <button
                type="button"
                onClick={addGuest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
              >
                <span className="text-lg leading-none">+</span> Add Guest
              </button>
            </div>

            <div className="p-6 space-y-4">
              {additionalGuests.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  No additional guests added yet. Click above to add companions.
                </p>
              ) : (
                additionalGuests.map((g, i) => (
                  <div
                    key={i}
                    className="relative p-4 bg-gray-50 rounded-lg border border-gray-200 transition hover:border-gray-300"
                  >
                    {/* Guest Header */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200/50">
                      <h4 className="text-sm font-semibold text-gray-700">Guest #{i + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeGuest(i)}
                        className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter guest name"
                          value={g.full_name || ""}
                          onChange={(e) => {
                            const updated = [...additionalGuests];
                            updated[i].full_name = e.target.value;
                            setAdditionalGuests(updated);
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Inherit from primary if blank"
                          value={g.phone || ""}
                          onChange={(e) => {
                            const updated = [...additionalGuests];
                            updated[i].phone = e.target.value;
                            setAdditionalGuests(updated);
                          }}
                        />
                      </div>

                      {/* ID Type */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">ID Type</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={g.id_type || ""}
                          onChange={(e) => {
                            const updated = [...additionalGuests];
                            updated[i].id_type = e.target.value;
                            setAdditionalGuests(updated);
                          }}
                        >
                          <option value="">Select ID type</option>
                          <option value="PASSPORT">Passport</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                          <option value="HEALTH_CARD">Health Card</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* ID Number */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">ID Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="ID or Passport number"
                          value={g.id_number || ""}
                          onChange={(e) => {
                            const updated = [...additionalGuests];
                            updated[i].id_number = e.target.value;
                            setAdditionalGuests(updated);
                          }}
                        />
                      </div>

                      {/* ID Proof Upload */}
                      <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">ID Proof (Image/PDF)</label>
                        <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                          <span className="text-sm text-gray-600 truncate max-w-48">
                            {additionalIdFiles[i]?.name || "Choose file"}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const updatedFiles = { ...additionalIdFiles };
                              updatedFiles[i] = e.target.files[0];
                              setAdditionalIdFiles(updatedFiles);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stay & Room Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Stay & Room</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={checkinDate}
                    onChange={e => setCheckinDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={checkoutDate}
                    onChange={e => setCheckoutDate(e.target.value)}
                  />
                </div>
                {!isReservationMode && (
                  <button
                    onClick={handleFetchRooms}
                    disabled={loading || !checkinDate || !checkoutDate}
                    className="self-end px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Find Rooms
                  </button>
                )}
              </div>

              {/* Smart Note for Reservation Mode */}
              {isReservationMode && (
                <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mt-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Dates pre-filled from reservation but can be adjusted. Pricing will update automatically.
                </p>
              )}

              {availableRooms.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Room</label>
                  {availableRooms.map(room => (
                    <label key={room.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedRoom?.id === room.id ? 'border-indigo-500 bg-indigo-50' : ''}`}>
                      <input type="radio" name="room" className="w-4 h-4 text-indigo-600"
                        checked={selectedRoom?.id === room.id} onChange={() => setSelectedRoom(room)} />
                      <div className="flex-1">
                        <div className="font-medium">Room {room.room_number} • Floor {room.floor}</div>
                        <div className="text-sm text-gray-600">${room.base_price}/night • Max {room.max_occupancy} guests</div>
                      </div>
                      <span className="font-semibold text-indigo-600">${room.base_price * nights}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary & Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal ({nights} nights)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <input type="number" min="0" max={subtotal} value={discountAmount} onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 border rounded text-right" />
              </div>
              <div className="flex justify-between font-semibold text-green-600 text-lg border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <input type="number" min="0" max={total} placeholder="Advance amount" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="flex-1 px-3 py-2 border rounded">
                <option value="">Payment mode</option>
                {paymentModes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Messages & Submit */}
          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          {message && <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

          <div className="mt-6 flex justify-end">
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
              {loading ? "Processing..." : "Confirm Check-In"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}