import React, { useEffect, useState } from "react";
import ReserveRoomForm from "../../components/reservations/ReserveRoomForm";
import ReservationsTable from "../../components/reservations/ReservationsTable";
import { allReservations } from "../../api/reservations.api";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const res = await allReservations();
    console.log("fetchReservations:::", res);
    
    setReservations(res);
  };
  useEffect(()=>{fetchReservations();},[])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">
        Reservations
      </h1>
      {/* Reserve Room */}
      <ReserveRoomForm onSuccess={fetchReservations}/>

      {/* Reservations Table */}
      <ReservationsTable data={reservations}/>
    </div>
  );
};

export default Reservations;