const express = require('express');
const router = express.Router();
const Coding = require('../models/Coding');

// Get Coding details
router.get('/problem/:id', async (req, res) => {
  try {
    const Coding = await Coding.findById(req.params.id);
    res.json(Coding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new Coding
router.post('/problem', async (req, res) => {
  const Coding = new Coding({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const newProblem = await Coding.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update Coding details
router.put('/problem/:id', async (req, res) => {
  try {
    const updatedProblem = await Coding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Coding
router.delete('/problem/:id', async (req, res) => {
  try {
    await Coding.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coding deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
