// Connect to MongoDB

import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://localhost:27017'; // Update with your database name

export const connectToDb = async () => {
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
}
