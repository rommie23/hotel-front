import { Dialog } from "@headlessui/react";
import { useState } from "react";
import api from "../../api/axios";

const CheckoutSettlementDialog = ({
  open,
  setOpen,
  stayId,
  preview,
  onSuccess
}) => {

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("CASH");

  if (!preview) return null;

  const { totalAmount, paidAmount, dueAmount, extraNights, extraAmount } = preview;

  const handlePayment = async () => {

    const pay = Number(amount);

    if (!pay || pay <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (pay > dueAmount) {
      alert("Cannot pay more than due");
      return;
    }

    await api.post(`/stays/${stayId}/payments`, {
      amount: pay,
      payment_mode: mode
    });

    onSuccess(); // reload preview
    setAmount("");
  };

  const handleCheckout = async () => {

    if (dueAmount > 0) {  
      alert("Please clear dues before checkout");
      return;
    }

    await api.post(`/stays/${stayId}/checkout`);

    alert("Checked out successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">

      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">

        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

          <Dialog.Title className="text-lg font-semibold">
            Checkout Settlement
          </Dialog.Title>

          {/* Extra Info */}
          {extraNights > 0 && (
            <div className="bg-yellow-50 p-3 rounded text-sm">
              Extra Nights: {extraNights} <br />
              Extra Charge: ${extraAmount}
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
            <p>Total: ${totalAmount}</p>
            <p>Paid: ${paidAmount}</p>
            <p className="font-semibold text-red-600">
              Due: ${dueAmount}
            </p>
          </div>

          {/* Add Payment */}
          <div className="flex gap-2">

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>

            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Add
            </button>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">

            <button
              onClick={() => setOpen(false)}
              className="border px-4 py-2 rounded"
            >
              Close
            </button>

            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Checkout
            </button>

          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CheckoutSettlementDialog;