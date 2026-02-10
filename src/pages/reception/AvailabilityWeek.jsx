import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AvailabilityWeek() {
    const [weekStart, setWeekStart] = useState("2026-02-10");
    const [data, setData] = useState([]);

    const getWeekDays = (startDate) => {
        const days = [];
        const date = new Date(startDate);

        for (let i = 0; i < 7; i++) {
            const d = new Date(date);
            d.setDate(date.getDate() + i);
            days.push(d.toISOString().split("T")[0]);
        }
        return days;
    };

    const isOccupied = (day, booking) => {
        return day >= booking.from && day < booking.to;
    };


    const weekDays = getWeekDays(weekStart);

    const fetchData = async () => {
        const res = await api.post("/rooms/weekly-occupancy", {
            weekStart,
            weekEnd: weekDays[6],
        });
        console.log(res);
        

        const grouped = {};

        res.data.forEach((row) => {
            if (!grouped[row.roomId]) {
                grouped[row.roomId] = {
                    roomNumber: row.roomNumber,
                    bookings: [],
                };
            }

            if (row.stayId) {
                grouped[row.roomId].bookings.push({
                    guestName: row.guestName,
                    from: row.checkinDate,
                    to: row.checkoutDate,
                });
            }
        });

        setData(Object.values(grouped));
    };

    useEffect(() => {
        fetchData();
    }, [weekStart]);

    const changeWeek = (offset) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + offset * 7);
        setWeekStart(d.toISOString().split("T")[0]);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Weekly Availability</h2>

            {/* Controls */}
            <div className="flex gap-4 mb-4">
                <button onClick={() => changeWeek(-1)}>⬅️ Prev</button>
                <button onClick={() => changeWeek(1)}>Next ➡️</button>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="border p-2">Room</th>
                            {weekDays.map((day) => (
                                <th key={day} className="border p-2 text-sm">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((room) => (
                            <tr key={room.roomNumber}>
                                <td className="border p-2 font-medium">
                                    {room.roomNumber}
                                </td>

                                {weekDays.map((day) => {
                                    const booking = room.bookings.find((b) =>
                                        isOccupied(day, b)
                                    );

                                    return (
                                        <td
                                            key={day}
                                            className={`border p-2 text-xs text-center ${booking
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-50"
                                                }`}
                                        >
                                            {booking ? booking.guestName : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
