import React, { useState } from "react";

const ServiceChargeSection = ({ services, stayId, api, onSuccess}) => {
  const [items, setItems] = useState([
    { serviceId: "", qty: 1 }
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ➕ Add new row
  const addRow = () => {
    setItems([...items, { serviceId: "", qty: 1 }]);
  };

  // ❌ Remove row
  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // ✏️ Update row
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  // 💰 Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const service = services.find(s => s.id == item.serviceId);
    if (!service) return sum;
    return sum + service.default_price * item.qty;
  }, 0);

  const finalTotal = subtotal - discountAmount;

  // 🚀 Submit
  const submitOrder = async () => {
    try {
      setLoading(true);

      await api.post("/stays/add-multiple-charges", {
        stayId,
        items,
        discount_amount: discountAmount
      });

      alert("Charges added successfully");
      // console.log("calling onSuccess");

      await onSuccess?.();
      // reset
      setItems([{ serviceId: "", qty: 1 }]);
      setDiscountAmount(0);

    } catch (err) {
      alert(err.response?.data?.message || "Error adding charges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          Add Service Charges
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">

        {/* Rows */}
        {items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-3 items-center">

            {/* Service */}
            <select
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
              value={item.serviceId}
              onChange={(e) =>
                updateItem(index, "serviceId", e.target.value)
              }
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.default_price}
                </option>
              ))}
            </select>

            {/* Qty */}
            <input
              type="number"
              min="1"
              className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg"
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", Number(e.target.value))
              }
            />

            {/* Remove */}
            {items.length > 1 && (
              <button
                onClick={() => removeRow(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add Row */}
        <button
          onClick={addRow}
          className="text-indigo-600 text-sm font-medium"
        >
          + Add another item
        </button>

        {/* Discount */}
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-gray-600">Discount:</span>

          <input
            type="number"
            min="0"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded text-right"
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-green-600 text-lg">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submitOrder}
          disabled={loading || items.some(i => !i.serviceId)}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Charges"}
        </button>
      </div>
    </div>
  );
};

export default ServiceChargeSection;