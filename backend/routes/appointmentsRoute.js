import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// @desc    Get all appointments with pagination
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { createdBy: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.startDate && req.query.endDate) {
      filter.appointmentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      clientName,
      phone,
      email,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      status = 'scheduled'
    } = req.body;

    if (!clientName || !phone || !appointmentDate || !appointmentTime || !serviceType) {
      return res.status(400).json({ 
        message: 'Client name, phone, date, time, and service type are required' 
      });
    }

    // Check for time slot conflict
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'completed'] },
      createdBy: req.user.id // Only check conflicts for same user
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'Time slot is already booked. Please choose a different time.' 
      });
    }

    const appointment = new Appointment({
      clientName,
      phone,
      email,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      serviceType,
      notes,
      status,
      createdBy: req.user.id
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check for time slot conflict (excluding current appointment)
    if (req.body.appointmentDate && req.body.appointmentTime) {
      const existingAppointment = await Appointment.findOne({
        appointmentDate: new Date(req.body.appointmentDate),
        appointmentTime: req.body.appointmentTime,
        status: { $in: ['scheduled', 'completed'] },
        createdBy: req.user.id,
        _id: { $ne: req.params.id }
      });

      if (existingAppointment) {
        return res.status(400).json({ 
          message: 'Time slot is already booked. Please choose a different time.' 
        });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ 
        message: 'Valid status is required: scheduled, completed, cancelled, or no-show' 
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      message: `Appointment status updated to ${status}`,
      appointment
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;