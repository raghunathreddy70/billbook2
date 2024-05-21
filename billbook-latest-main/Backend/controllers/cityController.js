// backend/controllers/cityController.js
const express = require('express');
const City = require('../models/City');
const State = require('../models/State');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { state } = req.query;

    let cities;
    if (state) {
      // Ensure 'state' is a valid ObjectId before querying the database
      if (!mongoose.Types.ObjectId.isValid(state)) {
        return res.status(400).json({ message: 'Invalid state ID' });
      }

      cities = await City.find({ state }).populate('state');
    } else {
      cities = await City.find().populate('state');
    }

    res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/', async (req, res) => {
  try {
    const { name, state } = req.body;

    // Create a new city
    const city = new City({ name, state });

    // Save the city
    await city.save();

    // Update the associated state's cities array
    await State.findByIdAndUpdate(state, { $push: { cities: city._id } });

    res.status(201).json(city);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// fetch cities based on the selected state 
router.get('/cities', async (req, res) => {
  try {
    const { state } = req.query;

    // Check if the state parameter is provided
    if (!state) {
      return res.status(400).json({ message: 'State parameter is required' });
    }

    // Ensure 'state' is a valid ObjectId before querying the database
    if (!mongoose.Types.ObjectId.isValid(state)) {
      return res.status(400).json({ message: 'Invalid state ID' });
    }

    // Fetch cities based on the selected state
    const cities = await City.find({ state }).select('name'); // Only select the 'name' field

    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:cityId', async (req, res) => {
  try {
    const city = await City.findById(req.params.cityId);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    console.error('Error fetching city by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/cities/:id - Update a specific city by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.status(200).json(updatedCity);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /api/cities/:id - Delete a specific city by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);

    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.status(200).json(deletedCity);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
