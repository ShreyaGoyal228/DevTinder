const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  receipt: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: Object, required: true },
  paymentId: { type: String },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
