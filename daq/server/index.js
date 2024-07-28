const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dataStructureRoutes = require('./routes/dataStructureRoutes');
const codingRoutes = require('./routes/codingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/datastructures', dataStructureRoutes);
app.use('/coding', codingRoutes);
app.use('/reviews', reviewRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/daq', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB connected...');

    // Ensure collections are created
    await ensureCollections();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));

// Function to ensure collections are created
async function ensureCollections() {
  try {
    await mongoose.connection.db.listCollections({ name: 'users' }).next(async (err, collinfo) => {
      if (!collinfo) {
        await mongoose.connection.createCollection('users');
      }
    });
    await mongoose.connection.db.listCollections({ name: 'admins' }).next(async (err, collinfo) => {
      if (!collinfo) {
        await mongoose.connection.createCollection('admins');
      }
    });
    await mongoose.connection.db.listCollections({ name: 'datastructures' }).next(async (err, collinfo) => {
      if (!collinfo) {
        await mongoose.connection.createCollection('datastructures');
      }
    });
    await mongoose.connection.db.listCollections({ name: 'codings' }).next(async (err, collinfo) => {
      if (!collinfo) {
        await mongoose.connection.createCollection('codings');
      }
    });
    await mongoose.connection.db.listCollections({ name: 'reviews' }).next(async (err, collinfo) => {
      if (!collinfo) {
        await mongoose.connection.createCollection('reviews');
      }
    });

    console.log('Collections ensured.');
  } catch (error) {
    console.error('Error ensuring collections:', error);
  }
}
