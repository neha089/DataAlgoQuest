const DataStructure = require('../models/DataStructure');

// Get a list of all data structures
exports.getDataStructures = async (req, res) => {
  try {
    const dataStructures = await DataStructure.find();
    res.json(dataStructures);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Find a data structure by name
exports.findDataStructureByName = async (req, res) => {
  const { name } = req.params;

  try {
    const dataStructure = await DataStructure.findOne({ name });
    if (!dataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }
    res.json(dataStructure);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new data structure
exports.createDataStructure = async (req, res) => {
  const { name, description, note } = req.body;

  try {
    const existingDataStructure = await DataStructure.findOne({ name });
    if (existingDataStructure) {
      return res.status(400).json({ message: 'Data structure already exists' });
    }

    const newDataStructure = new DataStructure({
      name,
      description,
      note,
    });

    await newDataStructure.save();
    res.status(201).json(newDataStructure);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing data structure
exports.updateDataStructure = async (req, res) => {
  const { id } = req.params;
  const { name, description, note } = req.body;

  try {
    const updatedDataStructure = await DataStructure.findByIdAndUpdate(
      id,
      { name, description, note, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedDataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }

    res.json(updatedDataStructure);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a data structure
exports.deleteDataStructure = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDataStructure = await DataStructure.findByIdAndDelete(id);

    if (!deletedDataStructure) {
      return res.status(404).json({ message: 'Data structure not found' });
    }

    res.json({ message: 'Data structure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
