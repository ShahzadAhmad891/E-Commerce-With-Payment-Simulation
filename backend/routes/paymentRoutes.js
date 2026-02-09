// backend/routes/paymentRoutes.js

import express from "express";
// backend/routes/paymentRoutes.js
import {
  initiatePayment,
  confirmPayment,
  settlePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Endpoint for processing payment
// router.post("/pay", payNow);  
router.post("/initiate", initiatePayment);
router.post("/confirm", confirmPayment);
router.post("/settle", settlePayment);

export default router;




// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { isUser } from "../middleware/roleMiddleware.js";
// import {
//   stripePayment,
//   easypaisaPayment,
// } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/stripe", protect, isUser, stripePayment);
// router.post("/easypaisa", protect, isUser, easypaisaPayment);

// export default router;
