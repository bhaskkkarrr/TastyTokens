import React from "react";
import { Link } from "react-router-dom";

function SuperDashboard() {
  return (
    <div>
      {/* Sign Up Link */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/signup"
            className="w-full text-decoration-none block text-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuperDashboard;
