// components/ErrorModal.jsx
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorModal({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-[9999]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-md text-center"
      >
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />

        <div className="text-xl font-semibold text-gray-800 mb-3">
          Something went wrong
        </div>

        <div className="text-gray-600 mb-5">{message}</div>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-red-600 text-white rounded-4 shadow hover:bg-red-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
