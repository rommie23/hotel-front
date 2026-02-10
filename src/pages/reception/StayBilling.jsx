import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function StayBilling() {
  const { stayId } = useParams();
  
  const [invoice, setInvoice] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchInvoice = async () => {
    // console.log(`/stays/${stayId}/invoice`);
    
    const res = await api.get(`/stays/${stayId}/invoice`);
    setInvoice(res.data);
    console.log("invoice::", res.data);
    
  };

  const fetchServices = async () => {
    const res = await api.get("/services/hotel-services");
    setServices(res.data.services);
    // console.log(res.data.services);
    
  };

  useEffect(() => {
    fetchInvoice();
    fetchServices();
  }, []);

  const addCharge = async () => {
    if (!serviceId) return;

    setLoading(true);
    await api.post(`/stays/${stayId}/charges`, {
      serviceId,
      quantity: qty,
    });

    setQty(1);
    setServiceId("");
    fetchInvoice();
    setLoading(false);
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stay Billing</h2>

      {/* Guest Info */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between">
            <p><b>Guest Name:</b> {invoice.stay.guest.name}</p>
            <p><b>Phone:</b> {invoice.stay.guest.phone}</p>
        </div>
        <p><b>Room No:</b> {invoice.stay.room.number}</p>
      </div>

      {/* Charges */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Charges</h3>

        <table className="w-full text-sm">
          <tbody>
            {/* <tr>
              <td>Room Charges</td>
              <td className="text-right">{invoice.stay.room.total_nights} x ${invoice.stay.room.price_per_night}</td>
              <td className="text-right">{invoice.stay.room.total_nights} x ${invoice.stay.room.price_per_night}</td>
            </tr> */}

            {invoice.charges.map((c) => (
              <tr key={c.id}>
                <td>{c.description}</td>
                <td className="text-right">{c.quantity}@{c.unit_price}CAD$</td>
                <td className="text-right">${c.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-2" />

        <p className="text-right font-bold">
          Total: ${invoice.summary.totalCharges}
        </p>
      </div>

      {/* Add Item */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Add Item</h3>

        <div className="flex gap-3">
          <select
            className="border p-2 rounded"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.unit_price})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            className="border p-2 w-20 rounded"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button
            onClick={addCharge}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded shadow font-semibold">
        <p className="font-semibold">
          Total Amount: ${invoice.summary.totalCharges}
        </p>
        <p className="font-semibold text-green-600">Paid Amount: ${invoice.summary.totalPaid}</p>
        <p className="font-semibold text-red-600">
          Due Amount: ${invoice.summary.dueAmount}
        </p>
      </div>
    </div>
  );
}
