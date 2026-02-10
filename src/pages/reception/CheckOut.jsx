import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CheckOut() {
  const { stayId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("CASH");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    const res = await api.get(`/stays/${stayId}/invoice`);
    setInvoice(res.data);
  };

  const dueAmount = invoice?.summary?.dueAmount || 0;

  const handleAddPayment = async () => {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    await api.post(`/stays/${stayId}/payments`, {
      amount: Number(amount),
      payment_mode: mode
    });

    setAmount("");
    await fetchInvoice();
    setLoading(false);
  };

  const handleCheckout = async () => {
    setLoading(true);
    await api.post(`/stays/${stayId}/checkout`);
    setLoading(false);
    navigate("/dashboard/reception/active-stays");
  };

  if (!invoice) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-semibold">
        Checkout – Room {invoice.stay.room.number}
      </h1>

      {/* Guest Info */}
      <div className="bg-white p-4 rounded border">
        <p><strong>Guest:</strong> {invoice.stay.guest.name}</p>
        <p><strong>Room Type:</strong> {invoice.stay.room.type}</p>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded border space-y-2">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span>₹ {invoice.summary.totalCharges}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid</span>
          <span>₹ {invoice.summary.totalPaid}</span>
        </div>
        <div className="flex justify-between font-semibold text-red-600">
          <span>Due</span>
          <span>₹ {invoice.summary.dueAmount}</span>
        </div>
      </div>

      {/* Payment */}
      {dueAmount > 0 && (
        <div className="bg-white p-4 rounded border space-y-4">
          <h2 className="font-semibold">Add Payment</h2>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Payment Amount"
            className="w-full border px-3 py-2 rounded"
            max={dueAmount}
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
          </select>

          <button
            onClick={handleAddPayment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Payment
          </button>
        </div>
      )}

      {/* Checkout */}
      <button
        onClick={handleCheckout}
        disabled={dueAmount > 0 || loading}
        className={`w-full py-3 rounded text-white ${
          dueAmount > 0 ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        Checkout Guest
      </button>
    </div>
  );
}
