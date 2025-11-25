import React from "react";
import { Link } from "react-router-dom";

function SuperDashboard() {
  const { signUpUser, isLoading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await signUpUser(data);
    if (result.success) {
      reset();
    }
    if (!result.success) {
      setError("root", { message: result.message });
    }
  };

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

        <div className="min-h-screen bg-emerald-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Join DigiThali to digitize your restaurant operations
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              {isLoading ? (
                <Loader />
              ) : (
                <div>
                  {/* Global Error Message */}
                  {errors.root && (
                    <div className="mb-4 text-red-600 text-sm text-center bg-red-50 py-3 rounded-3 border-2 border-red-700">
                      {errors.root.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Restaurant Name */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FaStore className="w-4 h-4 mr-2 text-emerald-600" />
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        {...register("restaurantName")}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.restaurantName
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                        placeholder="Enter your restaurant name"
                      />
                      {errors.restaurantName && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.restaurantName.message}
                        </p>
                      )}
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FaUser className="w-4 h-4 mr-2 text-emerald-600" />
                        Owner Name
                      </label>
                      <input
                        type="text"
                        {...register("ownerName")}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.ownerName
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                        placeholder="Enter owner's name"
                      />
                      {errors.ownerName && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.ownerName.message}
                        </p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaEnvelope className="w-4 h-4 mr-2 text-emerald-600" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.email ? "border-red-500" : "border-gray-200"
                          } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaPhone className="w-4 h-4 mr-2 text-emerald-600" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register("phoneNumber", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Invalid phone number",
                            },
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-200"
                          } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaLock className="w-4 h-4 mr-2 text-emerald-600" />
                          Password
                        </label>
                        <input
                          type="password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-200"
                          } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                          placeholder="Enter your password"
                        />
                        {errors.password && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaLock className="w-4 h-4 mr-2 text-emerald-600" />
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === getValues("password") ||
                              "Passwords do not match",
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-200"
                          } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-emerald-600" />
                        Restaurant Address
                      </label>
                      <textarea
                        {...register("address")}
                        rows="3"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base"
                        placeholder="Enter restaurant address"
                      />
                    </div>

                    {/* Role Selector */}
                    {/* <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    {...register("role")}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.role ? "border-red-500" : "border-gray-200"
                    } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="customer">Customer</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.role.message}
                    </p>
                  )}
                </div> */}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 text-white py-3 rounded-3 hover:bg-emerald-700 transition-colors duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-md disabled:opacity-70"
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 mt-3">
                      Already have an account?
                      <Link
                        to="/"
                        className="ms-2 text-decoration-none rounded-md px-3 py-2 hover:text-emerald-700 text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 font-medium"
                      >
                        Log in here
                      </Link>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperDashboard;
