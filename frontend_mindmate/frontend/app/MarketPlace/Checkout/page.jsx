"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { axiosinstance } from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const { authUser, checkAuth } = useAuthStore();
  const { items: cartItems, totalAmount: subtotal, fetchCart } = useCartStore();

  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchCart();
    };

    init();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    if (authUser.address) {
      setAddress(authUser.address);
      setForm(authUser.address);
    } else {
      setEditingAddress(true);
    }

    setLoading(false);
  }, [authUser]);

  /* ---------------- INPUT CHANGE ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- UPDATE ADDRESS ---------------- */

  const updateAddress = async () => {
    try {
      const res = await axiosinstance.patch("/users/change-address", form, {
        withCredentials: true,
      });

      if (res.data) {
        setAddress(form);
        setEditingAddress(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = async () => {
    if (!address) {
      alert("Please add address before placing order");
      return;
    }

    const res = await axiosinstance.post(
      "/orders/create",
      { address, paymentMethod },
      { withCredentials: true }
    );

    const orderData = res.data.data;

    /* ---------- COD ---------- */

    if (paymentMethod === "cod") {
      alert("Order placed successfully");
      await fetchCart();
      return;
    }

    /* ---------- MOCK PAYMENT ---------- */

    if (orderData.keyId === "mock_key") {
      await axiosinstance.post("/orders/verify-mock-payment", {
        mongoOrderId: orderData.mongoOrderId,
      });

      await fetchCart();
      alert("Mock payment successful");
      return;
    }

    /* ---------- RAZORPAY ---------- */

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      order_id: orderData.razorpayOrderId,

      handler: async function (response) {
        await axiosinstance.post("/orders/verify-payment", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        await fetchCart();
        alert("Payment successful");
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  if (loading) {
    return <div className="p-10 text-white">Loading Checkout...</div>;
  }


// //.l[[;]]
//  const handelgetorder = async() =>{
//     const res = await axiosinstance.get("/orders/my-orders")

//     console.log(res);
// }
 
  return (
    <div className="min-h-screen bg-black text-white p-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}

        <div className="lg:col-span-2 space-y-8">

          {/* ADDRESS */}

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shipping Address</h2>

              {!editingAddress && address && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Edit
                </button>
              )}
            </div>

            {/* ADDRESS DISPLAY */}

            {!editingAddress && address ? (
              <div className="border border-zinc-700 rounded-xl p-4 text-gray-300 space-y-1">
                <p className="font-semibold text-white">{address.fullName}</p>
                <p>{address.phone}</p>
                <p>{address.street}</p>

                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>

                <p>{address.country}</p>
              </div>
            ) : (
              /* ADDRESS FORM */
              <div className="grid md:grid-cols-2 gap-4">

                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <input
                  name="street"
                  placeholder="Street Address"
                  value={form.street || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded md:col-span-2"
                />

                <input
                  name="city"
                  placeholder="City"
                  value={form.city || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <input
                  name="state"
                  placeholder="State"
                  value={form.state || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <input
                  name="country"
                  placeholder="Country"
                  value={form.country || ""}
                  onChange={handleChange}
                  className="p-3 bg-zinc-800 rounded"
                />

                <div className="md:col-span-2 flex gap-3">
                  <button
                    onClick={updateAddress}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl w-full"
                  >
                    Save Address
                  </button>

                  {address && (
                    <button
                      onClick={() => setEditingAddress(false)}
                      className="bg-zinc-700 px-4 py-3 rounded-xl w-full"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* PAYMENT */}

          <div className="bg-zinc-900 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">

              <label className="flex gap-3 items-center">
                <input
                  type="radio"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                Razorpay / UPI / Card
              </label>

              <label className="flex gap-3 items-center">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-zinc-900 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-400">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId._id}
                className="flex justify-between items-center mb-3"
              >
                <span>
                  {item.productId.title} × {item.quantity}
                </span>

                <span>₹{item.productId.price * item.quantity}</span>
              </div>
            ))
          )}

          <hr className="border-zinc-700 my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          {cartItems.length === 0 ? (
            <button
              onClick={() => router.push("/MarketPlace/AllProduct")}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-xl"
            >
              Browse Products
            </button>
          ) : (
            <button
              onClick={placeOrder}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-xl"
            >
              Place Order
            </button>
          )}

           <button
              onClick={()=>router.push("/MarketPlace/CartActions/view")}
              className="mt-6 w-full bg-gray-600 hover:bg-purple-700 p-3 rounded-xl"
            >
              back to cart
            </button>
        </div>
      </div>
    </div>
  );
}