import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const LoginPage = () => {
  const { loginUser, isLoading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await loginUser(data);
    if (result.success) {
      reset();
    }
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen px-3 bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo placeholder */}
        <div className="w-20 h-20 mx-auto mb-2 bg-emerald-600 rounded-full flex items-center justify-center">
          <span className="text-3xl text-white font-bold">DT</span>
        </div>

        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-800">
          Welcome Back!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your restaurant
        </p>
      </div>

      <div className="mt-sm-8 mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-3 py-sm-8 px-sm-4 shadow rounded-2xl sm:px-10">
          {/* Loader */}
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              {errors.root && (
                <div className="mb-4 text-red-600 text-sm text-center bg-red-50 py-3 rounded-3 border-2 border-red-700">
                  {errors.root.message}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="w-4 h-4 mr-2 text-emerald-600" />
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      autoComplete="email"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email is required",
                        },
                      })}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaLock className="w-4 h-4 mr-2 text-emerald-600" />
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is required",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full  flex justify-center py-2.5 px-4 border border-transparent rounded-3 shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
