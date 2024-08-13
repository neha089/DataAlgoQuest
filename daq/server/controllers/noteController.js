const DataStructure = require('../models/DataStructure');
const CodingChallenge = require('../models/CodingChallenge');
const { validationResult } = require('express-validator');

// Add a note to a data structure
exports.addNoteToDataStructure = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data_structure_id } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user

    const dataStructure = await DataStructure.findById(data_structure_id);
    if (!dataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }

    dataStructure.notes.push({ user_id: userId, content });
    await dataStructure.save();

    res.status(201).json({ message: 'Note added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a note to a coding challenge
exports.addNoteToCodingChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { coding_challenge_id } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user

    const codingChallenge = await CodingChallenge.findById(coding_challenge_id);
    if (!codingChallenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    codingChallenge.note.push({ user_id: userId, content });
    await codingChallenge.save();

    res.status(201).json({ message: 'Note added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notes for a data structure (only those created by the logged-in user)
exports.getNotesForDataStructure = async (req, res) => {
  const { data_structure_id } = req.params;
  const userId = req.user.id;

  try {
    const dataStructure = await DataStructure.findById(data_structure_id);
    if (!dataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }

    const userNotes = dataStructure.notes.filter(note => note.user_id.toString() === userId);
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notes for a coding challenge (only those created by the logged-in user)
exports.getNotesForCodingChallenge = async (req, res) => {
  const { coding_challenge_id } = req.params;
  const userId = req.user.id;

  try {
    const codingChallenge = await CodingChallenge.findById(coding_challenge_id);
    if (!codingChallenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    const userNotes = codingChallenge.note.filter(note => note.user_id.toString() === userId);
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all notes created by the logged-in user
exports.getAllUserNotes = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is attached to req.user
  
    try {
      // Fetch notes from DataStructures
      const dataStructures = await DataStructure.find({ 'notes.user_id': userId });
      const dataStructureNotes = dataStructures.flatMap(ds => ds.notes.filter(note => note.user_id.toString() === userId));
  
      // Fetch notes from CodingChallenges
      const codingChallenges = await CodingChallenge.find({ 'note.user_id': userId });
      const codingChallengeNotes = codingChallenges.flatMap(cc => cc.note.filter(note => note.user_id.toString() === userId));
  
      // Combine notes from both models
      const allNotes = [...dataStructureNotes, ...codingChallengeNotes];
  
      res.json(allNotes);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
