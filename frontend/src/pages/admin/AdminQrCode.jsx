import React, { useContext, useEffect, useState } from "react";
import { FaQrcode, FaDownload, FaPrint, FaTrash } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";
import { useForm } from "react-hook-form";
import { TableContext } from "../../context/TableAndQrContext";
import Loader from "../../components/Loader";
import SkeletonLoader from "../../components/SkeletonLoader";

function AdminQrCode() {
  const [showAddModel, setShowAddModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const {
    createTableAndQr,
    getAllTables,
    handleDownload,
    handleDelete,
    tables,
    isLoading,
  } = useContext(TableContext);

  const onSubmit = async (data) => {
    const result = await createTableAndQr(data);
    if (result.success) {
      setShowAddModal(false);
      reset();
    }
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };

  const onDelete = async (qr) => {
    await handleDelete(qr);
  };

  const onDownload = async (qr) => {
    const result = await handleDownload(qr);
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };

  return (
    <div className="container-fluid py-6 bg-emerald-50 min-h-screen">
      <div className="d-flex justify-content-between items-center mb-6">
        <div className="flex items-center">
          <MdQrCodeScanner className="text-emerald-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            QR Code Management
          </h2>
        </div>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-3 shadow-md transition-all duration-300"
          onClick={() => setShowAddModal(true)}
        >
          <FaQrcode />
          Generate New QR Code
        </button>
      </div>

      {showAddModel && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 animate-fadeIn"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-emerald-700 font-poppins">
              Generate New Table QR Code
            </h2>

            {/* Error Message */}
            {errors.root && (
              <div className="text-red-700 bg-red-50 border border-red-400 px-4 py-2 rounded-lg text-sm text-center">
                {errors.root.message}
              </div>
            )}

            {/* Input Field */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-1">
                Table Name
              </label>
              <input
                {...register("tableName", {
                  required: {
                    value: true,
                    message: "Table name is required",
                  },
                })}
                type="text"
                placeholder="e.g. Table 1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              />
              {errors.tableName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tableName.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 text-white font-medium py-2.5 rounded-3 hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? "Generating..." : "Generate QR"}
            </button>
          </form>
        </div>
      )}
      {/* Stats Section */}
      <div className="row mb-6">
        <div className="col-12 col-md-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total QR Codes</p>
                <h3 className="text-2xl font-bold text-emerald-600">
                  {isLoading ? <Loader /> : tables.length}
                </h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <FaQrcode className="text-emerald-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Codes Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : tables.length > 0 ? (
        <div className="row g-4">
          {tables.map((qr) => (
            <div key={qr._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Error Message */}
                {errors.root && (
                  <div className="text-red-700 bg-red-50 border border-red-400 px-4 py-2 rounded-lg text-sm text-center">
                    {errors.root.message}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {qr.name}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {new Date(qr.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="p-2 rounded-2xl">
                      <img
                        src={qr.qrImage}
                        alt={qr.tableName}
                        className="w-56 h-56 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => onDownload(qr)}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-3 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                    <button
                      className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-5 transition-colors duration-200"
                      onClick={() => onDelete(qr._id)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No menu items found.</p>
      )}
    </div>
  );
}

export default AdminQrCode;
