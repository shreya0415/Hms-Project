import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const renderRiskBadge = (risk, score) => {
    const percentage = Math.round((score || 0) * 100);
    switch (risk) {
      case 'HIGH':
        return (
          <span className='bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full border border-red-300'>
            High ({percentage}%)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className='bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full border border-yellow-300'>
            Medium ({percentage}%)
          </span>
        );
      default:
        return (
          <span className='bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-300'>
            Low ({percentage}%)
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll min-h-[50vh]">
        
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>No-Show Risk</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
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
            <div>
              <p className="text-sm inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            
            <div>
              {renderRiskBadge(item.noShowRisk, item.noShowScore)}
            </div>

            {item.cancelled ? (
              <p className="text-red-400 text-sm font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-sm font-medium">Completed</p>
            ) : (
              <div className="flex">
                <img
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                  onClick={() => cancelAppointment(item._id)}
                />
                <img
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                  onClick={() => completeAppointment(item._id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;