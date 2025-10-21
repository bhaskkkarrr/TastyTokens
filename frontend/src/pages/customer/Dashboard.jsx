// import { useContext, useEffect, useState } from "react";
// import { FaUpload, FaCheck } from "react-icons/fa";
// import { FaEdit, FaTrash, FaUtensils } from "react-icons/fa";
// import { MdRestaurantMenu } from "react-icons/md";
// import { NavLink } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { MenuContext } from "../../context/MenuContext";
// import Loader from "../../components/Loader";
// import { AuthContext } from "../../context/AuthContext";
// import SkeletonLoader from "../../components/SkeletonLoader";

// function Dashboard() {
//   const { token } = useContext(AuthContext);
//   const {
//     getAllCategories,
//     categories,
//     isLoading,
//     getAllMenuItems,
//     menuItems,
//   } = useContext(MenuContext);

//   useEffect(() => {
//     if (token) {
//       // getAllCategories();
//       getAllMenuItems();
//     }
//   }, [token]);
//   return (
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_API from "../../utils/baseUrl";

export default function PublicMenu() {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_API}/api/menu/public/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data.menuItems || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [restaurantId]);

  if (isLoading) return <p className="text-center mt-5">Loading menu...</p>;

  if (!menuItems.length)
    return <p className="text-center mt-5">No menu items found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-600">
        Our Menu
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-2xl shadow-sm hover:shadow-lg transition"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="rounded-t-2xl h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-emerald-600 font-medium mt-1">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// <>
//   {console.log(menuItems)}
//   {/* Menu Cards */}
//   {isLoading ? (
//     <SkeletonLoader count={5} />
//   ) : menuItems.length > 0 ? (
//     <div className="row g-4">
//       {menuItems.map((item) => (
//         <div key={item._id} className="col-12 col-md-6 col-lg-4">
//           <NavLink className="card text-decoration-none h-100 border-0 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="relative">
//               <img
//                 src={item.imageUrl}
//                 className="card-img-top h-60 w-full object-cover"
//                 alt={item.name}
//               />
//               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
//                 <h5 className="text-xl font-semibold text-white mb-0">
//                   {item.name}
//                 </h5>
//                 <div className="flex gap-2 mt-2">
//                   {item.bestSeller && (
//                     <span className="badge bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
//                       Best Seller
//                     </span>
//                   )}
//                   <span
//                     className={`badge px-3 py-1 rounded-full text-sm ${
//                       item.foodType === "veg"
//                         ? "bg-green-500 text-white"
//                         : "bg-red-500 text-white"
//                     }`}
//                   >
//                     {item.foodType ? "Pure Veg" : "Non-Veg"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="card-body bg-white p-4">
//               <div className="flex justify-between items-center mb-3">
//                 <div className="flex flex-wrap gap-2">
//                   {(Array.isArray(item.category)
//                     ? item.category
//                     : [item.category]
//                   ).map((c, i) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium"
//                     >
//                       {c}
//                     </span>
//                   ))}
//                 </div>

//                 <span className="text-xl font-bold text-emerald-600">
//                   ₹{item.price}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
//                 {/* ✅ Checkbox with state update */}
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={item.isAvailable}
//                     onChange={() => handleAvailabilityToggle(item.id)}
//                     className={`form-checkbox h-5 w-5 rounded cursor-pointer ${
//                       item.isAvailable
//                         ? "text-emerald-600 border-emerald-600"
//                         : "text-gray-400 border-gray-400"
//                     }`}
//                   />
//                   <span className="text-sm text-gray-600">
//                     {item.isAvailable ? "Available" : "Unavailable"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </NavLink>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-center text-gray-500">No menu items found.</p>
//   )}
// </>
//   );
// }

// export default Dashboard;
