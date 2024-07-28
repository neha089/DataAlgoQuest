const express = require('express');
const router = express.Router();
const DataStructure = require('../models/DataStructure');

// Get DataStructure details
router.get('/dss/:id', async (req, res) => {
  try {
    const DataStructure = await DataStructure.findById(req.params.id);
    res.json(DataStructure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new DataStructure
router.post('/dss', async (req, res) => {
  const DataStructure = new DataStructure({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const newDS = await DataStructure.save();
    res.status(201).json(newDS);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update DataStructure details
router.put('/dss/:id', async (req, res) => {
  try {
    const updatedDS = await DataStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDS);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete DataStructure
router.delete('/dss/:id', async (req, res) => {
  try {
    await DataStructure.findByIdAndDelete(req.params.id);
    res.json({ message: 'DataStructure deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
