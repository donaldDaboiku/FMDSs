// import Order from "../models/Order.js";

// export const createOrder = async (req, res) => {
//   try {
//     const { clientName, item, status, measurement, deliveryDate } = req.body;

//     const order = await Order.create({
//       clientName,
//       clientPhone,
//       styleName,
//       styleImage,
//       amount,
//       item,
//       status,
//       measurement,
//       deliveryDate,
//       createdBy: req.user.id
//     });

//     res.status(201).json({
//       message: "Order created successfully",
//       order});
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
