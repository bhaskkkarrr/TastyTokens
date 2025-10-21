import React, { useContext, useState } from "react";
import { FaEdit, FaTrash, FaUtensils } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Paneer Butter Masala",
      price: 299,
      category: "Main Course",
      description: "Creamy, rich paneer curry in aromatic butter tomato gravy",
      image: "./src/assets/paneer-butter.jpg",
      isAvailable: true,
      veg: true,
      bestSeller: true,
    },
    {
      id: 2,
      name: "Kadai Paneer",
      price: 279,
      category: "Main Course",
      description: "Spicy paneer dish with bell peppers and kadai masala",
      image: "./src/assets/paneer-butter.jpg",
      isAvailable: true,
      veg: true,
      bestSeller: false,
    },
    {
      id: 3,
      name: "Shahi Paneer",
      price: 289,
      category: "Main Course",
      description: "Rich and creamy paneer curry with royal spices",
      image: "./src/assets/paneer-butter.jpg",
      isAvailable: true,
      veg: false,
      bestSeller: true,
    },
    {
      id: 4,
      name: "Paneer Tikka Masala",
      price: 309,
      category: "Main Course",
      description: "Grilled paneer chunks in spicy tomato-based gravy",
      image: "./src/assets/paneer-butter.jpg",
      isAvailable: true,
      veg: true,
      bestSeller: false,
    },
    {
      id: 5,
      name: "Malai Paneer",
      price: 269,
      category: "Main Course",
      description: "Soft paneer cubes in mild creamy sauce",
      image: "./src/assets/paneer-butter.jpg",
      isAvailable: false,
      veg: false,
      bestSeller: false,
    },
  ]);

  return (
    <div className="container-fluid py-6 bg-emerald-50 ">
      <div className="d-flex justify-content-between items-center mb-6">
        {console.log(user)}
        {user ? (
          <img
            src={user.qrCodeUrl}
            alt="Restaurant QR Code"
            className="w-48 h-48"
          />
        ) : (
          ""
        )}

        {console.log(user._id)}
        {user ? (
          <a
            href={user._id}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 underline mt-3"
          >
            View Live Menu →
          </a>
        ) : (
          ""
        )}

        <p className="text-gray-500">Scan this QR to view your menu</p>
        <div className="flex items-center">
          <MdRestaurantMenu className="text-emerald-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Best Seller Menu Items
          </h2>
        </div>
      </div>
      <div className="row g-4">
        {menuItems.map(
          (item) =>
            item.bestSeller && (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 bg-white rounded-3 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={item.image}
                      className="card-img-top h-60 w-full object-cover"
                      alt={item.name}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
                      <h5 className="text-xl font-semibold text-white mb-0">
                        {item.name}
                      </h5>
                      <div className="flex gap-2 mt-2">
                        {item.bestSeller && (
                          <span className="badge bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
                            Best Seller
                          </span>
                        )}
                        <span
                          className={`badge px-3 py-1 rounded-full text-sm ${
                            item.veg
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.veg ? "Pure Veg" : "Non-Veg"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body bg-white p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">
                        {item.category}
                      </span>
                      <span className="text-xl font-bold text-emerald-600">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed min-h-[48px]">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={item.isAvailable}
                          onClick={() => {
                            // Handle availability toggle
                          }}
                          className={`form-checkbox h-5 w-5 rounded cursor-pointer
                              ${
                                item.isAvailable
                                  ? "text-emerald-600 border-emerald-600"
                                  : "text-gray-400 border-gray-400"
                              }`}
                        />
                        <span className="text-sm text-gray-600">
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-3 transition-colors duration-200">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-3 transition-colors duration-200">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
