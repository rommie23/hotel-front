import React, { useState } from "react";
import axios from "../api/axios";
import { simpleFormatDate } from "../utils/dateTime";
import { CalendarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const ExtendStayDialog = ({ stay, close, refresh, buttonType }) => {   
  // buttonType 1 extend, 2 reduce 
  const [date, setDate] = useState(stay.expected_checkout_date);
  const [loading, setLoading] = useState(false);


  // date to fix calendar select
  const today = new Date().toISOString().split("T")[0];
  const checkoutDate = stay?.expected_checkout_date?.split("T")[0];
  const checkinDate = stay?.checkin_at?.split("T")[0];
  const minDate = buttonType === "extend" ? checkoutDate : checkinDate;

  const maxDate = buttonType === "reduce" ? checkoutDate : null;

  const extendStay = async () => {
    try {
      setLoading(true);
      await axios.post(`/stays/${stay.stayId}/update-checkout`, {
        new_checkout_date: date
      });
      alert("Stay extended successfully");
      refresh();
      close();
    } catch (error) {
      alert(error.response?.data?.message || "Error extending stay");
    } finally {
      setLoading(false);
    }
  };

  // Calculate if the new date is valid (not in the past)
  const isValidDate = date >= today;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-50 to-orange-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{buttonType === "extend" ? "Extend Stay" : "Reduce Stay"}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Stay ID: #{stay.stayId}
              </p>
            </div>
          </div>
        </div>

        {/* Guest Info Preview (if available) */}
        {stay.guestName && (
          <div className="px-6 pt-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-700">
                  {stay.guestName?.charAt(0) || 'G'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{stay.guestName}</p>
                <p className="text-xs text-gray-500">Room {stay.roomNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Current Checkout Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Checkout Date
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <CalendarIcon className="w-4 h-4" />
              </span>
              <div className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {simpleFormatDate(stay.expected_checkout_date)}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Original checkout date
            </p>
          </div>

          {/* New Checkout Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Checkout Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <CalendarIcon className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate || undefined}
                className={`
                  w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition
                  ${!isValidDate && date < today 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                  }
                `}
              />
            </div>
            
            {/* Date Validation Message */}
            {date < today && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                Checkout date cannot be in the past
              </p>
            )}
            
            {date > stay.expected_checkout_date && (
              <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
                Stay will be extended by {Math.ceil((new Date(date) - new Date(stay.expected_checkout_date)) / (1000 * 60 * 60 * 24))} days
              </p>
            )}

            {date === stay.expected_checkout_date && (
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                No change in checkout date
              </p>
            )}
          </div>

          {/* Quick Select Options */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-2">{buttonType === 'extend' ? 'Quick extend by:' : 'Quick reduce by:'}</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 5, 7].map(days => {
                const newDate = new Date(stay.expected_checkout_date);
                buttonType === 'extend' ?
                newDate.setDate(newDate.getDate() + days) : newDate.setDate(newDate.getDate() - days);
                const dateStr = newDate.toISOString().split('T')[0];
                
                return (
                  <button
                    key={days}
                    onClick={() => setDate(dateStr)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded-md text-xs hover:bg-amber-50 hover:border-amber-300 transition"
                  >
                    +{days} {days === 1 ? 'day' : 'days'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={close}
            className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={extendStay}
            disabled={loading || !date || date < today}
            className="px-5 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-25"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {buttonType === "extend" ? "Extending..." : "Reducing..."}
              </>
            ) : (
              <>
                <CalendarIcon className="w-4 h-4" />
                {buttonType === "extend" ? "Extend Stay" : "Reduce Stay"}
              </>
            )}
          </button>
        </div>

        {/* Warning for past dates */}
        {date && date < today && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Please select a valid future date</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtendStayDialog;