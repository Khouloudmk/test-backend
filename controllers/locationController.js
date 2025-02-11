const axios = require('axios');

const getLocationByAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    })

    if (response.data.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const { lat, lon } = response.data[0];

    res.status(200).json({ latitude: lat, longitude: lon });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Error fetching location', error });
  }
}

module.exports = { getLocationByAddress }
