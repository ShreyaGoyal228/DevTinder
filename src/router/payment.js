const express = require("express");
const razorpayInstance = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constants");

paymentRouter.post("/create/order", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { type } = req.body;

    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[type] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType: type,
      },
    });

    //save the order in database
    const payment = new Payment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      userId: req.user._id,
      receipt: order.receipt,
      notes: order.notes,
    });

    await payment.save();

    //send the details to frontend
    res.send({payment, key: process.env.RAZORPAY_KEY_ID});
  } catch (err) {
    res.status(500).send("Error in creating order." + err.message);
  }
});

module.exports = paymentRouter;
