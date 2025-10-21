import React, { useState } from "react";
import { FaQrcode, FaDownload, FaPrint, FaTrash } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";

function AdminQrCode() {
  // Sample QR code data
  const [qrCodes, setQrCodes] = useState([
    {
      id: 1,
      tableName: "Table 1",
      qrImage:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Table1",
      createdAt: "2025-10-10",
      downloads: 15,
      scans: 45,
    },
    {
      id: 2,
      tableName: "Table 2",
      qrImage:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Table2",
      createdAt: "2025-10-10",
      downloads: 12,
      scans: 38,
    },
    {
      id: 3,
      tableName: "Table 3",
      qrImage:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Table3",
      createdAt: "2025-10-10",
      downloads: 8,
      scans: 25,
    },
  ]);

  return (
    <div className="container-fluid py-6 bg-emerald-50 min-h-screen">
      <div className="d-flex justify-content-between items-center mb-6">
        <div className="flex items-center">
          <MdQrCodeScanner className="text-emerald-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            QR Code Management
          </h2>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300">
          <FaQrcode />
          Generate New QR Code
        </button>
      </div>

      {/* Stats Section */}
      <div className="row mb-6">
        <div className="col-12 col-md-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total QR Codes</p>
                <h3 className="text-2xl font-bold text-emerald-600">
                  {qrCodes.length}
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
      <div className="row g-4">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {qr.tableName}
                  </h5>
                  <span className="text-sm text-gray-500">{qr.createdAt}</span>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <img
                      src={qr.qrImage}
                      alt={qr.tableName}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600 mb-1">Downloads</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {qr.downloads}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600 mb-1">Scans</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {qr.scans}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                      <FaDownload className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                    <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                      <FaPrint className="w-4 h-4" />
                      <span className="text-sm">Print</span>
                    </button>
                  </div>
                  <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminQrCode;
