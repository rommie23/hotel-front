// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useParams, useNavigate } from "react-router-dom";

// export default function CheckOut() {
//   const { stayId } = useParams();
//   const navigate = useNavigate();

//   const [invoice, setInvoice] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [mode, setMode] = useState("CASH");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchInvoice();
//   }, []);

//   const fetchInvoice = async () => {
//     const res = await api.get(`/stays/${stayId}/invoice`);
//     setInvoice(res.data);
//   };

//   const dueAmount = invoice?.summary?.dueAmount || 0;

//   const handleAddPayment = async () => {
//     if (!amount || Number(amount) <= 0) return;

//     setLoading(true);
//     await api.post(`/stays/${stayId}/payments`, {
//       amount: Number(amount),
//       payment_mode: mode
//     });

//     setAmount("");
//     await fetchInvoice();
//     setLoading(false);
//   };

//   const handleCheckout = async () => {
//     setLoading(true);
//     await api.post(`/stays/${stayId}/checkout`);
//     setLoading(false);
//     navigate("/dashboard/reception/active-stays");
//   };

//   if (!invoice) return null;

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">

//       <h1 className="text-2xl font-semibold">
//         Checkout – Room {invoice.stay.room.number}
//       </h1>

//       {/* Guest Info */}
//       <div className="bg-white p-4 rounded border">
//         <p><strong>Guest:</strong> {invoice.stay.guest.name}</p>
//         <p><strong>Room Type:</strong> {invoice.stay.room.type}</p>
//       </div>

//       {/* Summary */}
//       <div className="bg-white p-4 rounded border space-y-2">
//         <div className="flex justify-between">
//           <span>Total Amount</span>
//           <span>$ {invoice.summary.totalCharges}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Paid</span>
//           <span>$ {invoice.summary.totalPaid}</span>
//         </div>
//         <div className="flex justify-between font-semibold text-red-600">
//           <span>Due</span>
//           <span>$ {invoice.summary.dueAmount}</span>
//         </div>
//       </div>

//       {/* Payment */}
//       {dueAmount > 0 && (
//         <div className="bg-white p-4 rounded border space-y-4">
//           <h2 className="font-semibold">Add Payment</h2>

//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Payment Amount"
//             className="w-full border px-3 py-2 rounded"
//             max={dueAmount}
//           />

//           <select
//             value={mode}
//             onChange={(e) => setMode(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="CASH">Cash</option>
//             <option value="CARD">Card</option>
//             <option value="UPI">UPI</option>
//           </select>

//           <button
//             onClick={handleAddPayment}
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Add Payment
//           </button>
//         </div>
//       )}

//       {/* Checkout */}
//       <button
//         onClick={handleCheckout}
//         disabled={dueAmount > 0 || loading}
//         className={`w-full py-3 rounded text-white ${
//           dueAmount > 0 ? "bg-gray-400" : "bg-green-600"
//         }`}
//       >
//         Checkout Guest
//       </button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import CheckoutConfirmDialog from "../../components/stay/CheckoutConfirmDialog";
import CheckoutSettlementDialog from "../../components/stay/CheckoutSettlementDialog";
import ExtendStayDialog from "../../components/ExtendStayDialog";
import { getPaymentMethods } from "../../api/rooms.api";

export default function CheckOut() {
  const { stayId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState(2);
  const [loading, setLoading] = useState(false);

  const [settlementOpen, setSettlementOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedStayId, setSelectedStayId] = useState(null);
  const [extendDialog, setExtendDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetchInvoice();
    fetchPaymentModes();
  }, []);

  const fetchPaymentModes = async () => {
    const res = await getPaymentMethods();
    setModes(res.filter(m => m.is_active));
  }

  const fetchInvoice = async () => {
    const res = await api.get(`/stays/${stayId}/invoice`);
    console.log(res.data.stay.status);
    setInvoice(res.data);
  };

  const dueAmount = invoice?.summary?.dueAmount || 0;

  const isActive = invoice?.stay?.status === "ACTIVE";
  const hasDue = dueAmount > 0;
  const isDisabled = loading || hasDue || !isActive;

  let buttonText = "Confirm Checkout";

  if (!isActive) {
    buttonText = "Guest Already Checked Out";
  } else if (hasDue) {
    buttonText = "Clear Due Amount First";
  }

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  // amount → %
  const handleDiscountAmount = (value) => {
    const amt = Math.max(0, value);
    setDiscountAmount(amt);

    if (dueAmount > 0) {
      const percent = (amt / dueAmount) * 100;
      setDiscountPercent(Number(percent.toFixed(2)));
    }
  };

  // % → amount
  const handleDiscountPercent = (value) => {
    const percent = Math.min(100, Math.max(0, value));
    setDiscountPercent(percent);

    const amt = (dueAmount * percent) / 100;
    setDiscountAmount(Number(amt.toFixed(2)));
  };


  const handleAddPayment = async () => {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    await api.post(`/stays/${stayId}/payments`, {
      amount: Number(amount),
      payment_mode: mode,
      discount_amount: Number(discountAmount)
    });

    setAmount("");
    await fetchInvoice();
    setLoading(false);
  };

  // const handleCheckout = async () => {
  //   // const res = await api.get(`/stays/${stayId}/checkout-preview`);
  //   const res = await api.post(`/stays/${stayId}/checkout-init`);
  //   console.log(res);

  //   setPreview(res.data);
  //   setSelectedStayId(stayId);
  //   setSettlementOpen(true);
  // };

  const handleCheckout = async () => {
    try {
      const res = await api.post(`/stays/${stayId}/checkout`);

      if (!res.data.success) {
        const { type, message, dueAmount } = res.data;

        switch (type) {
          case "PAYMENT_DUE":
            alert(`Please clear dues: $${dueAmount}`);
            return;

          case "OVERSTAY":
            // 🔥 trigger EXTEND dialog
            alert("Stay exceeded. Please extend stay first.");
            setActionType("extend");
            setExtendDialog(true);
            return;
          case "EARLY_CHECKOUT":
            alert("You're checking out early. Please reduce stay first.");
            // 🔥 trigger REDUCE dialog
            setActionType("reduce");
            setExtendDialog(true);
            return;
          default:
            alert(message || "Something went wrong");
            return;
        }
      }
      alert("Checked out successfully");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };


  // const confirmCheckout = async () => {
  //   await api.post(`/stays/${selectedStayId}/checkout`);
  //   alert("Checked out successfully");
  // };
  const reloadPreview = async () => {
    // const res = await api.get(`/stays/${selectedStayId}/checkout-preview`);
    setPreview(res.data);
  };

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Guest Checkout</h1>
        <p className="text-gray-600 mt-1">Complete the checkout process for this stay</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Room Info */}
        <div className="px-6 py-5 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stay #{stayId}</p>
              <h2 className="text-xl font-semibold text-gray-800">
                Room {invoice.stay.room.number} • {invoice.stay.room.type}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Guest Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Guest Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {invoice.stay.guest.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800 text-lg">{invoice.stay.guest.name}</p>
                <p className="text-sm text-gray-500">Phone: {invoice.stay.guest.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Bill Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Charges</span>
                <span className="font-medium text-gray-800">$ {invoice.summary.totalCharges}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-green-600">$ {invoice.summary.totalPaid}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-800 font-semibold">Due Amount</span>
                <span className={`font-bold text-xl ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  $ {invoice.summary.dueAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Add Payment Section - Only shown if due amount > 0 */}
          {
            // dueAmount > 0 && 
            // (
            //   <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            //     <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            //       <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            //       Add Payment
            //     </h3>

            //     <div className="space-y-4">
            //       <div>
            //         <label className="block text-sm font-medium text-gray-700 mb-1">
            //           Payment Amount <span className="text-red-500">*</span>
            //         </label>
            //         <div className="relative">
            //           <span className="absolute left-3 top-3 text-gray-500">$</span>
            //           <input
            //             type="number"
            //             value={amount}
            //             onChange={(e) => setAmount(e.target.value)}
            //             placeholder="Enter amount"
            //             max={dueAmount}
            //             className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            //           />
            //         </div>
            //         <p className="text-xs text-gray-500 mt-1">Maximum due: ${dueAmount}</p>
            //       </div>

            //       <div>
            //         <label className="block text-sm font-medium text-gray-700 mb-1">
            //           Payment Mode
            //         </label>
            //         <select
            //           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
            //           value={mode || 2}
            //           onChange={(e) => setMode(e.target.value)}
            //         >
            //           {Array.isArray(modes) && modes.map((m) => (
            //             <option key={m.id} value={m.id}>
            //               {m.name}
            //             </option>
            //           ))}
            //         </select>
            //       </div>

            //       <button
            //         onClick={handleAddPayment}
            //         disabled={loading || !amount || Number(amount) <= 0}
            //         className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            //       >
            //         {loading ? (
            //           <>
            //             <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            //             Processing...
            //           </>
            //         ) : (
            //           <>
            //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            //             </svg>
            //             Add Payment
            //           </>
            //         )}
            //       </button>

            //       {/* Quick amount suggestions */}
            //       <div className="flex flex-wrap gap-2">
            //         <p className="text-xs text-gray-500 w-full">Quick select:</p>
            //         <button
            //           onClick={() => setAmount(dueAmount)}
            //           className="px-3 py-1.5 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-gray-700"
            //         >
            //           Full due (${dueAmount})
            //         </button>
            //         <button
            //           onClick={() => setAmount(Math.min(50, dueAmount))}
            //           className="px-3 py-1.5 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-gray-700"
            //         >
            //           $50
            //         </button>
            //         <button
            //           onClick={() => setAmount(Math.min(100, dueAmount))}
            //           className="px-3 py-1.5 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-gray-700"
            //         >
            //           $100
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // )
          }

          {dueAmount > 0 && (
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Add Payment
              </h3>

              <div className="space-y-4">

                {/* 💰 Discount Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>

                  <div className="flex gap-2 items-center">

                    {/* Amount */}
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => handleDiscountAmount(Number(e.target.value))}
                        className="w-24 pl-8 pr-2 py-2 border border-gray-300 rounded text-right"
                        placeholder="0"
                      />
                    </div>

                    {/* Percent */}
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => handleDiscountPercent(Number(e.target.value))}
                      className="w-20 px-2 py-2 border border-gray-300 rounded text-right"
                      placeholder="%"
                    />
                    <span>%</span>
                  </div>
                </div>

                {/* 💵 Payment Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* 📊 Summary Preview */}
                <div className="bg-white p-3 rounded border text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Current Due:</span>
                    <span>${dueAmount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="text-red-500">-${discountAmount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>After Discount:</span>
                    <span>${Math.max(0, dueAmount - discountAmount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="text-blue-600">-${amount || 0}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-green-600 border-t pt-1">
                    <span>Remaining:</span>
                    <span>
                      ${Math.max(0, dueAmount - discountAmount - (Number(amount) || 0))}
                    </span>
                  </div>
                </div>

                {/* 💳 Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>

                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    value={mode || ""}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="">Select mode</option>
                    {Array.isArray(modes) &&
                      modes.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 🚀 Submit */}
                <button
                  onClick={handleAddPayment}
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Processing..." : "Add Payment"}
                </button>

                {/* ⚡ Quick Buttons */}
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-gray-500 w-full">Quick select:</p>

                  <button
                    onClick={() => setAmount(Math.max(0, dueAmount - discountAmount))}
                    className="px-3 py-1 text-xs border rounded"
                  >
                    Full (${Math.max(0, dueAmount - discountAmount)})
                  </button>

                  <button
                    onClick={() => setAmount(50)}
                    className="px-3 py-1 text-xs border rounded"
                  >
                    $50
                  </button>

                  <button
                    onClick={() => setAmount(100)}
                    className="px-3 py-1 text-xs border rounded"
                  >
                    $100
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <div className="pt-4 border-t border-gray-200">
            {/* <button
              onClick={handleCheckout}
              disabled={dueAmount > 0 || loading}
              className={`
                w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2
                ${dueAmount > 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200"
                }
              `}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {dueAmount > 0 && invoice.stay.status == 'ACTIVE' ? 'Clear Due Amount First' : invoice.stay.status !== 'ACTIVE' ? 'Guest Already Checked out' : 'Confirm Checkout'}
                </>
              )}
            </button> */}
            <button
              onClick={handleCheckout}
              disabled={isDisabled}
              className={`
                w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2
                ${isDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200"
                }
              `}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {buttonText}
                </>
              )}
            </button>

            {dueAmount > 0 && (
              <p className="text-xs text-red-500 text-center mt-2">
                ⚠️ Cannot checkout until due amount is cleared
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/dashboard/reception/active-stays")}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Active Stays
        </button>
      </div>
      {/* <CheckoutConfirmDialog
        open={checkoutDialogOpen}
        setOpen={setCheckoutDialogOpen}
        preview={checkoutPreview}
        onConfirm={confirmCheckout}
      /> */}
      {/* <CheckoutSettlementDialog
        open={settlementOpen}
        setOpen={setSettlementOpen}
        stayId={selectedStayId}
        preview={preview}
        onSuccess={reloadPreview}
      /> */}
      {extendDialog && (
        <ExtendStayDialog
          stay={invoice.stay}
          buttonType={actionType}
          close={() => setExtendDialog(false)}
          refresh={fetchInvoice}
        />
      )}
    </div>
  );
}
