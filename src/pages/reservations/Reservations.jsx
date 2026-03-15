import React from "react";
import ReserveRoomForm from "../../components/reservations/ReserveRoomForm";
import ReservationsTable from "../../components/reservations/ReservationsTable";

const Reservations = () => {

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-semibold">
        Reservations
      </h1>

      {/* Reserve Room */}

      <ReserveRoomForm />

      {/* Reservations Table */}

      <ReservationsTable />

    </div>
  );
};

export default Reservations;