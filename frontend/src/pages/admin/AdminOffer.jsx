import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { DiscountContext } from "../../context/DiscountContext";
import AddDiscountModal from "../../components/admin/AddDiscountModal";
import CircleLoader from "../../components/Loader";
import DiscountCardSkeleton from "../../components/DiscountCardSkeleton";
import ConfirmModal from "../../components/ConfirmationModal";
export default function AdminDiscounts() {
  const { discounts, getDiscounts, deleteDiscount, toggleDiscount, isLoading } =
    useContext(DiscountContext);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const handleToggleActive = async (id) => {
    try {
      const res = await toggleDiscount(id);
      return res;
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteDiscount(id);
    console.log("res", result);
    if (result.res.success) {
      getDiscounts();
    } else if (result.res.success === false) {
      setError(result.res.message);
      setShowErrorModal(true);
    }
  };
  return (
    <div className="py-4 px-2 ">
      <div className="flex  justify-between">
        <div className="text-4xl font-bold text-gray-800 ">Discounts</div>
        <div
          className="text-xl px-3 py-2 bg-emerald-600 text-white rounded-4 "
          onClick={() => setShowAddModal(true)}
        >
          Create Discount
        </div>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-3xl bg-white p-4 rounded-3xl shadow-lg overflow-y-auto max-h-[92vh">
            <div className="flex justify-center items-center">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowErrorModal(false);
                }}
                className="absolute z-50 top-4 left-4 text-gray-900 hover:text-black text-3xl"
              >
                &times;
              </button>
              <span className="bg-white text-red-600 text-xl rounded-5 p-3">
                {error}
              </span>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        message={confirmMessage}
        onCancel={() => {
          setConfirmMessage("");
          setConfirmAction(null);
        }}
        onConfirm={() => {
          confirmAction();
          setConfirmMessage("");
          setConfirmAction(null);
        }}
      />
      {/* ALL DISCOUNTS LIST */}
      <div className="text-2xl font-bold text-gray-800 my-4">All Discounts</div>

      {isLoading ? (
        <DiscountCardSkeleton />
      ) : discounts?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No discounts created yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((d) => (
            <div
              key={d._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md px-3 py-3 flex flex-col justify-between hover:shadow-lg transition cursor-pointer gap-3"
            >
              {/* Top Section */}
              <div>
                {/* Title */}
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-gray-800 ">
                    {d.type === "percentage" ? `${d.amount}%` : `₹${d.amount}`}
                  </div>

                  <span
                    className={`px-2 py-1 text-xs rounded-pill capitalize ${
                      d.type === "percentage"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {d.type}
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  {/* Applies To */}
                  <span className="text-sm text-gray-600">
                    {d.appliesTo === "all"
                      ? "Entire Menu"
                      : d.appliesTo === "category"
                      ? `Category: ${d.category?.name || "N/A"}`
                      : `Item: ${d.item?.name || "N/A"}`}
                  </span>
                  {/* Dates */}
                  <span className="text-xs text-gray-500 ">
                    {d.startDate
                      ? `Starts: ${new Date(d.startDate).toLocaleDateString()}`
                      : "No start date"}{" "}
                    •{" "}
                    {d.endDate
                      ? `Ends: ${new Date(d.endDate).toLocaleDateString()}`
                      : "No end date"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(d._id)}
                  className={`px-3 py-1 rounded-4 text-sm font-medium ${
                    d.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {d.active ? "Active" : "Inactive"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    setConfirmMessage(
                      "Are you sure you want to delete this offer?"
                    );
                    setConfirmAction(() => () => handleDelete(d._id));
                  }}
                  className="p-1  rounded-5 bg-red-100 text-red-700 hover:bg-red-200"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAddModal && <AddDiscountModal setShowAddModal={setShowAddModal} />}
    </div>
  );
}
