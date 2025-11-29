// components/ConfirmModal.jsx
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-[9999]">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-md text-center"
      >
        <FaQuestionCircle className="text-emerald-600 text-5xl mx-auto mb-4" />

        <div className="text-xl font-semibold text-gray-800 mb-3">
          Are you sure?
        </div>

        <div className="text-gray-600 mb-6">{message}</div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-4 hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-4 hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
