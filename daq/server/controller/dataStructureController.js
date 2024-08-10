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
exports.findDataStructureByName = async (req, res) => {
    const { name } = req.params;
  
    try {
      const dataStructure = await DataStructure.findOne({ name: name });
      if (!dataStructure) {
        return res.status(404).json({ message: 'Data structure not found' });
      }
      res.json(dataStructure);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };