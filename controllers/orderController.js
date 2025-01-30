
const Order = require('../models/order');
exports.createOrder = async (req, res) => {
  try {
    const { customerName, email, items = [], totalAmount = 1, status = 'pending' , price} = req.body; 
    if (!customerName || !email || !items) {
      return res.status(400).json({ success: false, message: 'Customer name, email and items are required.' });
    }

    const newOrder = new Order({
      customerName,
      email,
      items,
      price,
      totalAmount,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderProduct = async (req, res) => {
  try {
    const { action, items } = req.body;
    if (!["add", "delete"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'add' or 'delete'." });
    }
    const order = await Order.findById(req.params.id);
    console.log(order)
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (action === "add") {
      // Add items to the order
      for (const item of items) {
        order.items.push(item);
      }
  } 
    else if (action === "delete") {
     order.items.forEach( async (item)=>{
     order.items.remove(item)
     } )
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
