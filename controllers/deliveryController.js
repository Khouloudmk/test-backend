const Delivery = require('../models/Delivery') 
const PDFDocument = require('pdfkit')
const fs = require('fs')



const generateDeliveryPDF = async (req, res) => {
  try {
    const { id } = req.params
    const delivery = await Delivery.findById(id)

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' })
    }
    const doc = new PDFDocument()


    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=delivery-${id}.pdf`)

    // création du PDF
    doc.pipe(res);

    // ajout du contenu au PDF
    doc.fontSize(20).text('Delivery Details', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Delivery ID: ${delivery._id}`)
    doc.text(`Order ID: ${delivery.orderId}`)
    doc.text(`Address: ${delivery.address}`)
    doc.text(`Delivery Date: ${new Date(delivery.deliveryDate).toDateString()}`)
    doc.text(`Status: ${delivery.status}`)
    doc.text(`Customer Name: ${delivery.costumerName}`)
    doc.end()
  } catch (error) {
    console.error('Error generating delivery PDF:', error)
    res.status(500).json({ message: 'Error generating PDF.', error })
  }
}

// créer une livraison
const createDelivery = async (req, res) => {
  try {
    const {orderId, address, costumerName, status} = req.body
    const newDelivery = new Delivery({
      address,
      deliveryDate:new Date(),
      costumerName,
      status,
      orderId,
    })
    
    // sauvegarder dans db
    await newDelivery.save()
    res.status(201).json(newDelivery)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Error creating delivery', error })
  }
}

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
    res.status(200).json(deliveries)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Error fetching deliveries', error })
  }
}

// get by id
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' })
    }

    res.status(200).json(delivery) 
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Error fetching delivery', error })
  }
}

const updateDelivery = async (req, res) => {
  try {
    const { orderId, address, deliveryDate, status } = req.body

    // update with id
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { orderId,address, deliveryDate, status },
      { new: true }  
    )

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' })
    }

    res.status(200).json(updatedDelivery)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Error updating delivery', error })
  }
}

// supprimer
const deleteDelivery = async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id)

    if (!deletedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' })
    }

    res.status(200).json({ message: 'Delivery deleted successfully' })
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error deleting delivery', error })
  }
}
// recherche by adresse
const getDeliveriesByAddress = async (req, res) => {
  try {
    const { address } = req.body

    if (!address) {
      return res.status(400).json({ message: 'Address query parameter is required.' })
    }

    const deliveries = await Delivery.find({ address: { $regex: address, $options: 'i' } })
    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by address:', error);
    res.status(500).json({ message: 'Error fetching deliveries by address.', error })
  }
}

// recherche by date
const getDeliveriesByDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required.' })
    }

    const deliveries = await Delivery.find({ deliveryDate: date })
    res.status(200).json(deliveries)
  } catch (error) {
    console.error('Error fetching deliveries by date:', error)
    res.status(500).json({ message: 'Error fetching deliveries by date.', error })
  }
}
// recherche by status
const getDeliveriesByStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required.' })
    }

    const deliveries = await Delivery.find({ status: { $regex: status, $options: 'i' } })
    res.status(200).json(deliveries)
  } catch (error) {
    console.error('Error fetching deliveries by status:', error)
    res.status(500).json({ message: 'Error fetching deliveries by status.', error })
  }
}

const getDeliveriesByOrderId = async (req, res) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ message: 'OrderId query parameter is required.' })
    }

    const deliveries = await Delivery.find({ orderId: { $regex: orderId, $options: 'i' } })
    res.status(200).json(deliveries)
  } catch (error) {
    console.error('Error fetching deliveries by orderId:', error)
    res.status(500).json({ message: 'Error fetching deliveries by orderId.', error })
  }
}


module.exports = {createDelivery,getAllDeliveries,updateDelivery,deleteDelivery,getDeliveryById,
  getDeliveriesByAddress,getDeliveriesByDate,getDeliveriesByStatus,getDeliveriesByOrderId,generateDeliveryPDF,}
