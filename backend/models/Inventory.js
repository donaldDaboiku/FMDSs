import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", InventorySchema);
