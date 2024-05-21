
const express = require('express');
const State = require('../models/State');
const Country = require('../models/Country');
const City = require('../models/City');
const router = express.Router();

// GET /api/states - Get all states with associated country information
router.get('/', async (req, res) => {
  try {
    const states = await State.find().populate({
      path: 'country',
      select: 'name _id', // Include only name and _id of the country
    }).populate({
      path: 'cities',
      model: 'City', // Specify the model for population
    });

    res.status(200).json(states);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, country } = req.body;

    // Create a new state
    const state = new State({ name, country });

    // Save the state
    await state.save();

    // Update the associated country's states array
    await Country.findByIdAndUpdate(country, { $push: { states: state._id } });

    res.status(201).json(state);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /api/states/:id - Update a specific state by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedState = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedState) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.status(200).json(updatedState);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:stateId', async (req, res) => {
  try {
    const stateId = req.params.stateId;
    const state = await State.findById(stateId);

    if (state) {
      res.json(state);
    } else {
      res.status(404).json({ error: 'State not found' });
    }
  } catch (error) {
    console.error('Error fetching state:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE /api/states/:id - Delete a specific state by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedState = await State.findByIdAndDelete(req.params.id);

    if (!deletedState) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.status(200).json(deletedState);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
