import { useState } from "react";
import { getAvailableRooms } from "../../api/rooms.api";
import { useNavigate } from "react-router-dom";

export default function Availability() {
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const searchRooms = async () => {
    if (!checkinDate || !checkoutDate) {
      setError("Please select both dates");
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Room Availability</h2>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={checkinDate}
          onChange={(e) => setCheckinDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={checkoutDate}
          onChange={(e) => setCheckoutDate(e.target.value)}
        />

        <button
          onClick={searchRooms}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Results */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Checking availability...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Room</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Capacity</th>
                <th className="p-3 text-left">Price / Night</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No rooms available
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.roomId} className="border-t">
                    <td className="p-3 font-medium">
                      {room.roomNumber}
                    </td>
                    <td className="p-3">{room.roomType}</td>
                    <td className="p-3">{room.capacity}</td>
                    <td className="p-3">₹{room.pricePerNight}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate("/dashboard/reception/checkin", {
                            state: {
                              roomId: room.roomId,
                              checkinDate,
                              checkoutDate,
                            },
                          })
                        }
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                      >
                        Check-in
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
