import mongoose, { Schema } from 'mongoose';

const brandSchema = new Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  }
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
