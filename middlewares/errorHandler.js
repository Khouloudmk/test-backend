const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Error:', err)
    res.status(500).json({
      message: 'Something went wrong. Please try again later.',
      error: err.message || err,
    })
  }
  
module.exports = errorHandler
  