import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  serviceType: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "no-show"],
    default: "scheduled"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

// Utility: Check time-slot conflicts
AppointmentSchema.statics.checkTimeSlotConflict = async function(date, time, excludeId = null) {
  const filter = {
    appointmentDate: date,
    appointmentTime: time,
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  const conflict = await this.findOne(filter);
  return !!conflict;
};

export default mongoose.model("Appointment", AppointmentSchema);
