const DataStructure = require('../models/DataStructure');
const { validationResult } = require('express-validator');
const mongoose=require('mongoose');
const Note = require('../models/Note');
const CodingChallenge = require('../models/CodingChallenge');

// Add a note to a data structure
exports.addNoteToDataStructure = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data_structure_id } = req.params;
    const { user_id ,content } = req.body;
  
    const dataStructure = await DataStructure.findById(data_structure_id);
    if (!dataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }
    
   const newNote = new Note({
      user_id,
      content,
    });

    await newNote.save(); // Save the new note

    // Push the ObjectId of the new note into the dataStructure's note array
    dataStructure.note.push(newNote._id);
    await dataStructure.save();

    res.status(201).json({ message: 'Note added successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addNoteToCodingChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { coding_challenge_id } = req.params;
    const { user_id, content } = req.body;

    const codingChallenge = await CodingChallenge.findById(coding_challenge_id);
    if (!codingChallenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    const newNote = new Note({
      user_id,
      challenge_id: coding_challenge_id,
      content,
    });

    await newNote.save();
    // codingChallenge.note.push(newNote._id);
    // await codingChallenge.save();

    res.status(201).json({ message: 'Note added successfully' });
  } catch (error) {
    console.error('Server error:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message }); // Provide detailed error message
  }
};

exports.getNotesByChallengeAndUser = async (req, res) => {
  const { coding_challenge_id } = req.params; // Extract challenge ID from request parameters
  const { user_id } = req.query; // Extract user ID from query parameters
  try {
      // Validate input
      if (!coding_challenge_id || !user_id) {
          return res.status(400).json({ error: 'Challenge ID and User ID are required.' });
      }

      // Find notes by challenge ID and user ID
      const notes = await Note.find({
        challenge_id: coding_challenge_id, // Change to match your database field
        user_id: user_id
      });
      // Return the notes
      res.status(200).json(notes);
  } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'An error occurred while fetching notes.' });
  }
};


// Get notes for a data structure (only those created by the logged-in user)
exports.getNotesForDataStructure = async (req, res) => {
  const { data_structure_id } = req.params;
  const { user_id } = req.query;

  try {
    const dataStructure = await DataStructure.findById(data_structure_id).populate('note');
    if (!dataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }

    const userNotes = dataStructure.note.filter(note => note.user_id.toString() === user_id);
    if (userNotes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notes for a coding challenge (only those created by the logged-in user)
exports.getNotesForCodingChallenge = async (req, res) => {
  const { coding_challenge_id } = req.params;
  const {user_id} = req.body;

  try {
    const codingChallenge = await CodingChallenge.findById(coding_challenge_id).populate('note');
    if (!codingChallenge) {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    const userNotes = codingChallenge.note.filter(note => note.user_id.toString() === user_id);
    if (userNotes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all notes created by the logged-in user
exports.getAllUserNotes = async (req, res) => {
  const { user_id } = req.query;

  try {

    // Fetch notes from DataStructures
    const dataStructures = await DataStructure.find({}).populate('note');
    const dataStructureNotes = dataStructures.flatMap(ds => ds.note.filter(note => note.user_id.toString() === user_id.toString()));

    // Fetch notes from CodingChallenges (assuming CodingChallenge schema exists)
    const codingChallenges = await CodingChallenge.find({}).populate('note');
    const codingChallengeNotes = codingChallenges.flatMap(cc => cc.note.filter(note => note.user_id.toString() === user_id.toString()));

    // Combine notes from both models
    const allNotes = [...dataStructureNotes, ...codingChallengeNotes];

    res.json(allNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  // Update a note by note ID
exports.updateNoteById = async (req, res) => {
    const { note_id } = req.params;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
  
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        note_id,
        { content },
        { new: true }
      );
  
      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.json(updatedNote);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Delete a note by note ID
exports.deleteNoteById = async (req, res) => {
  const { note_id } = req.params;

  try {

    // Delete the note from the Note collection
    const note = await Note.findByIdAndDelete(note_id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }


    // Remove the note reference from the DataStructure collection
    let dataStructure = await DataStructure.findOneAndUpdate(
      { note: note_id },
      { $pull: { note: note_id } },
      { new: true }
    );

    // Remove the note reference from the CodingChallenge collection
    let codingChallenge = await CodingChallenge.findOneAndUpdate(
      { note: note_id },
      { $pull: { note: note_id } },
      { new: true }
    );

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
