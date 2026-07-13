import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    styleName: { type: String, required: true },
    styleImage: { type: String },
    amount: { type: Number, required: true },
    item: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed"],
      default: "Pending",
    },
    measurement: { type: String },
    deliveryDate: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
