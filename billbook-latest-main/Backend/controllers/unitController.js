const express = require('express');
const router = express.Router();
const UnitModel = require("../models/unitModel");
require('dotenv').config();


router.post('/units', async (req, res) => {
  try {
    const formData = req.body;

    const Units = new UnitModel(formData);

    const savedUnit = await Units.save();

    res.status(201).json(savedUnit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/getunits/:bid', async (req, res) => {
  const bussinessid = req.params.bid;
  console.log("bussinessid", bussinessid)
  try {
    const Unit = await UnitModel.find( {businessId: bussinessid});
    console.log("Unit", Unit)
    res.status(200).json(Unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Unit' });
  }
});

router.put('/unitedit/:id', async (req, res) => {
  try {
    const  unitid  = req.params.id;
    const updatedData = req.body;
    
    const updatedUnit = await UnitModel.findByIdAndUpdate(unitid, updatedData, { new: true });

    if (!updatedUnit) {
      return res.status(404).json({ error: 'Unit record not found' });
    }

    res.status(200).json(updatedUnit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Unit record' });
  }
});



router.delete('/deleteunit/:id', async (req, res) => {
  try {
    const unitId = req.params.id;
    
    const deletedunit = await UnitModel.findByIdAndDelete(unitId);
   
    if (!deletedunit) {
      return res.status(404).json({ error: 'Unit record not found' });
    }
    res.status(200).json({ message: 'Unit record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unit to delete GST record' });
  }
});



module.exports = router;