const Product = require('../models/product');
const Review = require('../models/review');
const PDFDocument = require('pdfkit');

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('reviews');
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products' });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error getting product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product' });
  }
};

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push(review._id);
    await product.save();

    res.status(200).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Error creating review' });
  }
};

const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');
    res.status(200).json(product.reviews); // Added status code
  } catch (err) {
    res.status(400).json({ message: 'Error getting reviews' });
  }
};

const generatePdf = async (req, res) => {
  try {
    const products = await Product.find().populate('reviews');
    const pdf = new PDFDocument();
    pdf.fontSize(25).text('Product Review Report', 100, 100);

    products.forEach((product) => {
      pdf.moveDown().fontSize(18).text(`Product Name: ${product.name}`);
      pdf
        .moveDown()
        .fontSize(18)
        .text(`Product Description: ${product.description}`);
      pdf.moveDown().fontSize(18).text(`Product Price: ${product.price}`);
      pdf.moveDown().fontSize(18).text(`Reviews:`);
      product.reviews.forEach((review) => {
        pdf.moveDown().fontSize(18).text(`Rating: ${review.rating}`);
        pdf.moveDown().fontSize(18).text(`Comment: ${review.comment}`);
      });
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=product_review_report.pdf'
    );
    res.setHeader('Content-Type', 'application/pdf');

    pdf.pipe(res);
    pdf.end();
  } catch (err) {
    res.status(400).json({ message: 'Error generating PDF' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  generatePdf,
};
