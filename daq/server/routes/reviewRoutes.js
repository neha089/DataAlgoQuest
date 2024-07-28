const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get Review details
router.get('/reviews/:id', async (req, res) => {
  try {
    const Review = await Review.findById(req.params.id);
    res.json(Review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new Review
router.post('/reviews', async (req, res) => {
  const Review = new Review({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const newReview = await Review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Review details
router.put('/reviews/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Review
router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
