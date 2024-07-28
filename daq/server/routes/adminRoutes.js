const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Get Admin details
router.get('/admin/:id', async (req, res) => {
  try {
    const Admin = await Admin.findById(req.params.id);
    res.json(Admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new Admin
router.post('/admin', async (req, res) => {
  const Admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const newAdmin = await Admin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Admin details
router.put('/admin/:id', async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Admin
router.delete('/admin/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
