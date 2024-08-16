const express = require('express');
const dataStructureController = require('../controllers/dataStructureController');
const router = express.Router();

// Routes
router.get('/', dataStructureController.getDataStructures);
router.get('/find/:name', dataStructureController.findDataStructureByName);
router.post('/', (req, res, next) => {
    console.log('POST /api/datastructures/ called');
    next();
}, dataStructureController.createDataStructure);
router.put('/:id', dataStructureController.updateDataStructure); // Update route
router.delete('/:id',(req,res,next)=>{
    console.log('POST /api/datastructures/ called');
    next();
}, dataStructureController.deleteDataStructure); // Delete route

module.exports = router;
