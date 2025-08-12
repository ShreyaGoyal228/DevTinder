const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type.",
      },
    },
  },
  { timestamps: true }
);

//compiund indexing (to make your apis execute faster)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//kind of middleware thats why we use next , runs every time before the await ConnectionRequest.save() runs
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if fromUserId equals toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can't send connection request to yourself.");
  }
  next();
});
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
