// backend/controllers/orderController.js

import User from "../models/User.js";
import Order from "../models/Order.js";
import Wallet from "../models/Wallet.js";

/**
 * 🔹 Utility: Ensure user has both wallets
 */
const ensureWallets = async (userId) => {
  const providers = ["JAZZCASH", "EASYPAISA"];

  for (let provider of providers) {
    const exists = await Wallet.findOne({ user: userId, provider });
    if (!exists) {
      await Wallet.create({
        user: userId,
        provider,
        balance: 10000, // test balance
      });
    }
  }
};

/**
 * 🔹 Create Order
 */
export const createOrder = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone || !email || !address) {
      return res.status(400).json({ message: "All contact fields are required" });
    }

    const cart = req.session.cart;
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 👤 Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, phone, email, address });
    } else {
      user.name = name;
      user.phone = phone;
      user.address = address;
      await user.save();
    }

    // 🔑 Ensure wallets BEFORE payment
    await ensureWallets(user._id);

    // 🧾 Create order
    const order = await Order.create({
      user: user._id,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalPrice,
      status: "PENDING",
    });

    req.session.cart = null;

    res.status(201).json(order);
  } catch (err) {
    console.error("🔥 Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};



// import Order from "../models/Order.js";
// import Cart from "../models/Cart.js";

// /* ================= CREATE ORDER SUMMARY ================= */
// export const createOrder = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id });

//   if (!cart || cart.items.length === 0)
//     return res.status(400).json({ message: "Cart is empty" });

//   const order = await Order.create({
//     user: req.user._id,
//     products: cart.items,
//     totalAmount: cart.totalPrice,
//   });

//   res.status(201).json(order);
// };
