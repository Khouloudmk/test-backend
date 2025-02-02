const Order = require('../models/order'); 

exports.createOrder = async (req, res) => {
  try {
    console.log("Received JSON body:", req.body);

    const { customerName, email, items = [], status = 'pending' } = req.body;

    if (!customerName || !email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name, email, and at least one item are required.' });
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = new Order({
      customerName,
      email,
      items,
      totalAmount,
      status,
    });

    const savedOrder = await newOrder.save();
    console.log("Saved Order:", savedOrder);
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    console.error("Error:", error);
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
    if (!order) return res.status(404).json({ message: "Order not found" });

    let newTotalAmount = order.totalAmount || 0;

    if (action === "add") {
      for (const item of items) {
        if (!item._id || !item.price || !item.quantity) {
          return res.status(400).json({ message: "Each item must have _id, price, and quantity." });
        }
        order.items.push(item);
        newTotalAmount += item.price * item.quantity;
      }
    } else if (action === "delete") {
      for (const item of items) {
        const index = order.items.findIndex(orderItem => 
          orderItem._id?.toString() === item._id?.toString()
        );

        if (index !== -1) {
          const deletedItem = order.items.splice(index, 1)[0];
          if (deletedItem && deletedItem.price && deletedItem.quantity) {
            newTotalAmount -= deletedItem.price * deletedItem.quantity;
          }
        }
      }
    }

    order.totalAmount = Math.max(newTotalAmount, 0);

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

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path')

exports.generateOrderPDF = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const doc = new PDFDocument();
    const fileName = `order_${order._id}.pdf`;
    const filePath = path.join(__dirname, `../orderPDF${fileName}`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(20).text('Order Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order._id}`);
    doc.text(`Customer Name: ${order.customerName}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    doc.fontSize(16).text('Items:', { underline: true });
    order.items.forEach((item, index) => {
      doc.fontSize(12).text(`${index + 1}. ${item.name} - ${item.quantity} x $${item.price}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { bold: true });
    doc.end();

    stream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          res.status(500).json({ message: 'Error generating PDF' });
        }
        setTimeout(() => fs.unlinkSync(filePath), 30000);
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
