// pages/CustomerMenu.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
const BASE_API = import.meta.env.VITE_BASE_API;
// import { CartContext } from "../context/CartContext";

export default function CustomerMenu() {
  const { restaurantId, tableId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // // const { addItem } = useContext(CartContext);
  // // const navigate = useNavigate();
  const getResMenu = async () => {
    try {
      setIsLoading(true);
      const r = await fetch(
        `${BASE_API}/api/public/r/${restaurantId}/t/${tableId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await r.json();
      console.log("Menu data", res);
      setData(res);
    } catch (error) {
      setError("roots", { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResMenu();
  }, [restaurantId]);

  if (isLoading)
    return (
      <div>
        <Loader></Loader>
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;

  const { restaurant, table, menu } = data;

  return (
    <div className="bg-emerald-50 p-4">
      <div className="mb-4 flex justify-center">
        <h2 className="text-xl font-semibold">
          {restaurant.restaurantName} — {table.name}
        </h2>
      </div>
      <div className="grid gap-4 p-2">
        {menu.map((category) => (
          <section key={category._id}>
            <h3 className="text-lg font-medium">{category.name}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {category.items.map((item) => (
                <div key={item._id} className="p-3 bg-white rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="mt-1 font-medium">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <button
                        onClick={() =>
                          addItem({
                            itemId: item._id,
                            name: item.name,
                            price: item.price,
                            qty: 1,
                          })
                        }
                        className="bg-emerald-600 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          // onClick={() => navigate(`/${restaurantId}/cart`)}
          className="bg-emerald-600 text-white px-5 py-2 rounded-full shadow"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}
