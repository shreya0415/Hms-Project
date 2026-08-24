import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const renderRiskBadge = (risk, score) => {
    const percentage = Math.round((score || 0) * 100);
    switch (risk) {
      case 'HIGH':
        return (
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full border border-red-300">
            High ({percentage}%)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full border border-yellow-300">
            Medium ({percentage}%)
          </span>
        );
      default:
        return (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-300">
            Low ({percentage}%)
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1.5fr_1fr] grid-flow-col py-3 px-6 border-b hover:bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fee</p>
          <p>No-Show Risk</p>
          <p>Action</p>
        </div>
        {appointments &&
          appointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1.5fr_1fr] items-center text-gray-500 py-3 px-6 border-b"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full"
                  src={item.userData.image}
                  alt=""
                />
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full bg-gray-200"
                  src={item.docData.image}
                  alt=""
                />
                <p>{item.docData.name}</p>
              </div>
              <p>{currency + " " + item.docData.fee}</p>
              <div>
                {renderRiskBadge(item.noShowRisk, item.noShowScore)}
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-sm font-medium">Cancelled</p>
              ) : !item.isCompleted ? (
                <img
                  src={assets.cancel_icon}
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  alt=""
                />
              ) : (
                <p className="text-green-400 text-sm font-medium">Completed</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllAppointments;