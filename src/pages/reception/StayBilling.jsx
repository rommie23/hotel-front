import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import ExtendStayDialog from "../../components/ExtendStayDialog";
import { getPaymentMethods } from "../../api/rooms.api";
import ServiceChargeSection from "../../components/stay/ServiceChargesSection";

export default function StayBilling() {
  const { stayId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  // const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [modes, setModes] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [extendDialog, setExtendDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  // const [items, setItems] = useState([
  //   { serviceId: "", qty: 1 }
  // ]);

  // dates for comparisons
  const today = new Date().toISOString().split("T")[0];
  const checkoutDate = invoice?.stay?.expected_checkout_date?.split("T")[0];
  const checkinDate = invoice?.stay?.checkin_at?.split("T")[0];

  // comparing dates 
  const canExtend = today <= checkoutDate;
  const canReduce = today >= checkinDate;

  const fetchInvoice = async () => {
    const res = await api.get(`/stays/${stayId}/invoice`);
    setInvoice(res.data);
    // console.log("invoice::", res.data);
  };

  const fetchServices = async () => {
    const res = await api.get("/services/hotel-services");
    setServices(res.data.services);
  };

  const fetchPaymentModes = async () => {
    const res = await getPaymentMethods();
    setModes(res.filter(m => m.is_active));
  }

  useEffect(() => {
    fetchInvoice();
    fetchServices();
    fetchPaymentModes();
  }, [stayId]);

  // const addRow = () => {
  //   setItems([...items, { serviceId: "", qty: 1 }]);
  // };
  // const removeRow = (index) => {
  //   const updated = items.filter((_, i) => i !== index);
  //   setItems(updated);
  // };

  // const updateItem = (index, key, value) => {
  //   const updated = [...items];
  //   updated[index][key] = value;
  //   setItems(updated);
  // };

  // // 💰 Calculate subtotal
  // const subtotal = items.reduce((sum, item) => {
  //   const service = services.find(s => s.id == item.serviceId);
  //   if (!service) return sum;
  //   return sum + service.default_price * item.qty;
  // }, 0);

  // const finalTotal = subtotal - discountAmount;

  // 🚀 Submit
  // const submitOrder = async () => {
  //   try {
  //     setLoading(true);

  //     await api.post("/stays/charges", {
  //       stayId,
  //       items,
  //       discount_amount: discountAmount
  //     });

  //     alert("Charges added successfully");

  //     // reset
  //     setItems([{ serviceId: "", qty: 1 }]);
  //     setDiscountAmount(0);

  //   } catch (err) {
  //     alert(err.response?.data?.message || "Error adding charges");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addCharge = async () => {
  //   if (!serviceId) return;

  //   setLoading(true);
  //   await api.post(`/stays/${stayId}/charges`, {
  //     serviceId,
  //     quantity: qty,
  //   });

  //   setQty(1);
  //   setServiceId("");
  //   fetchInvoice();
  //   setLoading(false);
  // };

  const processPayment = async () => {
    if (!paymentAmount || !paymentMode) return;

    setLoading(true);
    try {
      await api.post(`/stays/${stayId}/payments`, {
        amount: paymentAmount,
        mode: paymentMode,
      });
      setPaymentAmount("");
      setPaymentMode("");
      fetchInvoice();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const extendReduceButton = (buttonType) => {
    setExtendDialog(true)
  }



  if (!invoice) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Stay Billing</h2>
        <p className="text-gray-600 mt-1">Manage charges and payments for stay #{stayId}</p>
      </div>

      {/* Guest Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Guest Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {invoice.stay.guest.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guest Name</p>
                <p className="font-medium text-gray-800">{invoice.stay.guest.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{invoice.stay.guest.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Room Number</p>
                <p className="font-medium text-gray-800">Room {invoice.stay.room.number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charges Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Charges Breakdown
          </h3>
        </div>

        <div className="p-6">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wider">
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left font-medium">Description</th>
                <th className="pb-3 text-right font-medium">Quantity</th>
                <th className="pb-3 text-right font-medium">Unit Price</th>
                <th className="pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.charges.map((c, index) => (
                <tr key={c.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="py-3 text-gray-800">{c.description}</td>
                  <td className="py-3 text-right text-gray-600">{c.quantity}</td>
                  <td className="py-3 text-right text-gray-600">${c.unit_price}</td>
                  <td className="py-3 text-right font-medium text-gray-800">${c.total_amount}</td>
                </tr>
              ))}

              {invoice.charges.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 italic">
                    No charges added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Item */}
      <ServiceChargeSection
        stayId={stayId}
        services={services}
        api={api}
        onSuccess={fetchInvoice}
      />


      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Add Service Charge
          </h3>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${s.default_price}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-32">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">Qty</span>
                <input
                  type="number"
                  min="1"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={addCharge}
              disabled={loading || !serviceId}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-25"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div> */}



      {/* Payment Section - Enhanced to match checkout screen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            Payment
          </h3>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-48">
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
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

            <button
              onClick={processPayment}
              disabled={loading || !paymentAmount || !paymentMode}
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-30"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Process Payment
                </>
              )}
            </button>
          </div>

          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">${invoice.summary.totalCharges}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Paid Amount</p>
              <p className="text-2xl font-bold text-green-700">${invoice.summary.totalPaid}</p>
              {invoice.summary.totalPaid > 0 && (
                <p className="text-xs text-green-600 mt-1">Received</p>
              )}
            </div>

            <div className={`p-4 rounded-lg border ${invoice.summary.dueAmount > 0
              ? "bg-red-50 border-red-200"
              : "bg-emerald-50 border-emerald-200"
              }`}>
              <p className={`text-xs uppercase tracking-wider mb-1 ${invoice.summary.dueAmount > 0
                ? "text-red-600"
                : "text-emerald-600"
                }`}>
                {invoice.summary.dueAmount > 0 ? "Due Amount" : "Settled"}
              </p>
              <p className={`text-2xl font-bold ${invoice.summary.dueAmount > 0
                ? "text-red-700"
                : "text-emerald-700"
                }`}>
                ${invoice.summary.dueAmount}
              </p>
              {invoice.summary.dueAmount === 0 && (
                <p className="text-xs text-emerald-600 mt-1">Fully paid ✓</p>
              )}
            </div>
          </div>

          {/* Quick payment suggestions */}
          {invoice.summary.dueAmount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <p className="text-xs text-gray-500 w-full">Quick pay:</p>
              <button
                onClick={() => setPaymentAmount(invoice.summary.dueAmount)}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
              >
                Full due (${invoice.summary.dueAmount})
              </button>
              <button
                onClick={() => setPaymentAmount(Math.min(50, invoice.summary.dueAmount))}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
              >
                $50
              </button>
              <button
                onClick={() => setPaymentAmount(Math.min(100, invoice.summary.dueAmount))}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
              >
                $100
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <div className="flex justify-start gap-3">
          <button
            disabled={!canExtend}
            onClick={() => {
              setActionType("extend");
              setExtendDialog(true);
            }}
            className={`px-4 py-2 rounded
            ${canExtend
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Extend Stay
          </button>
          <button
            disabled={!canReduce}
            onClick={() => {
              setActionType("reduce");
              setExtendDialog(true);
            }}
            className={`px-4 py-2 rounded
            ${canReduce
                ? "bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Reduce Stay
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={() => {
              // Print or download invoice
              window.print();
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>

        {/* <button
          onClick={() => setExtendDialog(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Extend Stay
        </button> */}
      </div>
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