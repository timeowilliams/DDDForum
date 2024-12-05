import mongoose from 'mongoose';
import { randomBytes } from 'crypto';

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    autoIncrement: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: () => randomBytes(16).toString('hex')
  }
}, { 
  timestamps: true 
});

export const User = mongoose.model('User', userSchema);