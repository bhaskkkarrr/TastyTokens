import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Page404() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* 404 Text and Illustration */}
      <div className="text-center">
        <h1 className="text-9xl font-bold text-emerald-600 animate-pulse">
          404
        </h1>
        <div className="relative">
          {/* Decorative plate illustration */}
          <div className="w-48 h-48 mx-auto my-8 relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full transform -rotate-12"></div>
            <div className="absolute inset-4 bg-emerald-50 rounded-full border-4 border-emerald-200"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Oops! Plate Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like the dish you're looking for is not on our menu. Let's get
          you back to something more delicious!
        </p>

        {/* Navigation Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-6 py-3 me-3 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            <span className="mr-2">🏠</span>
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg shadow-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center sm:ml-4"
          >
            <span className="mr-2">👈</span>
            Go Back
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-32 h-32 bg-emerald-100 rounded-br-full opacity-50"></div>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-100 rounded-tl-full opacity-50"></div>
      </div>
    </div>
  );
}

export default Page404;
