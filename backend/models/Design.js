import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    category: { 
      type: String, 
      required: true 
    },
    fabric: { 
      type: String, 
      required: true 
    },
    color: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    image: { 
      type: String 
    } // Optional: for design images
  },
  { timestamps: true }
);

export default mongoose.model("Design", designSchema);