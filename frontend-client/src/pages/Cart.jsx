import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);

  // 🔹 Contact Info State
  const [showContact, setShowContact] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // 🔹 Order / Payment UI State
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Fetch cart from backend session
   */
  const fetchCart = async () => {
    const res = await API.get("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * 🔹 Update item quantity
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const res = await API.put("/cart/update", {
      productId,
      quantity,
    });

    setCart(res.data);
  };

  /**
   * 🔹 Remove item from cart
   */
  const removeFromCart = async (productId) => {
    const res = await API.delete(`/cart/remove/${productId}`);
    setCart(res.data);
  };

  /**
   * 🔥 MAIN PAYMENT FLOW (SIMULATOR)
   *
   * 1. Create Order
   * 2. Initiate Payment (JazzCash simulation)
   * 3. Confirm Payment (deduct JazzCash wallet)
   * 4. Settle Payment (credit Easypaisa wallet)
   */
  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Order
      const orderRes = await API.post("/orders", userInfo);
      const order = orderRes.data;

      // 2️⃣ Initiate Payment
      const initRes = await API.post("payments/initiate", {
        orderId: order._id,
      });

      const paymentId = initRes.data.paymentId;

      // 3️⃣ Simulate JazzCash confirmation
      await API.post("payments/confirm", { paymentId });

      // 4️⃣ Simulate Easypaisa settlement
      await API.post("payments/settle", { paymentId });

      alert("Payment Successful 🎉");

      setShowSummary(false);
      setShowContact(false);
      fetchCart();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Empty cart guard
  if (!cart || cart.items.length === 0) {
    return <h3>Your cart is empty</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Your Cart</h2>

      {cart.items.map((item) => (
        <div key={item.product._id} style={{ marginBottom: "10px" }}>
          <strong>{item.product.name}</strong>
          <p>Price: Rs {item.price}</p>

          <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
            -
          </button>

          <span style={{ margin: "0 10px" }}>{item.quantity}</span>

          <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
            +
          </button>

          <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
        </div>
      ))}

      <h3>Total: Rs {cart.totalPrice}</h3>

      {/* 🔹 Step 1: Collect contact info */}
      <button onClick={() => setShowContact(true)}>
        To order, give Contact Info
      </button>

      {/* 🔹 Step 2: Proceed to order summary */}
      <button
        disabled={!userInfo.name}
        onClick={() => setShowSummary(true)}
        style={{ marginLeft: "10px" }}
      >
        Order Now
      </button>

      {/* 🔹 CONTACT INFO MODAL */}
      {showContact && (
        <div style={modalStyle}>
          <h3>Contact Information</h3>

          <input
            placeholder="Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          />
          <textarea
            placeholder="Address"
            value={userInfo.address}
            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
          />

          <div>
            <button onClick={() => setShowContact(false)}>OK</button>
          </div>
        </div>
      )}

      {/* 🔹 ORDER SUMMARY MODAL */}
      {showSummary && (
        <div style={modalStyle}>
          <h3>Order Summary</h3>

          {cart.items.map((item) => (
            <p key={item.product._id}>
              {item.product.name} × {item.quantity}
            </p>
          ))}

          <h4>Total: Rs {cart.totalPrice}</h4>

          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <button onClick={() => setShowSummary(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

/**
 * 🔹 Simple Modal Styling
 */
const modalStyle = {
  position: "fixed",
  top: "20%",
  left: "35%",
  background: "#fff",
  padding: "20px",
  border: "1px solid #ccc",
  zIndex: 1000,
};






// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function Cart() {
//   const [cart, setCart] = useState(null);

//   const fetchCart = async () => {
//     // const res = await API.get("/api/cart");
//     const res = await API.get("/cart");
//     setCart(res.data);
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;

//     // const res = await API.put("/api/cart/update", {
//     // const res = await API.put("/cart/update", {
//     API.put("/cart/update", { productId, quantity });

//     setCart(res.data);
//   };

//   const removeFromCart = async (productId) => {
//     // const res = await API.delete(`/api/cart/remove/${productId}`);
//     // const res = await API.delete(`/cart/remove/${productId}`);
//     API.delete(`/cart/remove/${productId}`);
//     setCart(res.data);
//   };

//   if (!cart || cart.items.length === 0)
//     return <h3>Your cart is empty</h3>;

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>Your Cart</h2>

//       {cart.items.map((item) => (
//         <div key={item.product._id}>
//           <strong>{item.product.name}</strong>
//           <p>Price: Rs {item.price}</p>

//           <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
//           <span>{item.quantity}</span>
//           <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>

//           <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
//         </div>
//       ))}

//       <h3>Total: Rs {cart.totalPrice}</h3>

//       <button onClick={() => alert("OPEN ORDER MODAL")}>
//         Order Now
//       </button>
//     </div>
//   );
// }

