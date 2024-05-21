// backend/controllers/countryController.js
const express = require('express');
const Country = require('../models/Country');

const router = express.Router();

// POST /api/countries - Create a new country
router.post('/', async (req, res) => {
  try {
    const countries = await Country.find().populate('states', 'name');
    const { name, population } = req.body;
    const country = new Country({ name, population });
    await country.save();
    res.status(201).json(country);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/countries - Get all countries
router.get('/', async (req, res) => {
    try {
      const countries = await Country.find().populate({
        path: 'states',
        select: '_id name', // Include both _id and name
      });
  
      // Extract state details from the populated states array
      const countriesWithStateDetails = countries.map(country => {
        const statesDetails = country.states.map(state => ({
          _id: state._id,
          name: state.name,
        }));
        return {
          ...country.toObject(),
          states: statesDetails,
        };
      });
  
      res.status(200).json(countriesWithStateDetails);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// GET /api/countries/:id - Get a specific country by ID
router.get('/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.status(200).json(country);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /api/countries/:id - Update a specific country by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, population } = req.body;
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { name, population },
      { new: true } // Returns the updated document
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.status(200).json(updatedCountry);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.delete('/:id', async (req, res) => {
    try {
      const deletedCountry = await Country.findByIdAndDelete(req.params.id);
  
      if (!deletedCountry) {
        return res.status(404).json({ message: 'Country not found' });
      }
  
      res.status(200).json(deletedCountry);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;
