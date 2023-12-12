import Category from '../models/category.model.js';

export const fetchCategories = async (req, res) => {
  const categories = await Category.find({}).exec();
  res.status(200).json(categories);
};

export const createCategory = async (req, res) => {
  const category = new Category(req.body);
  const doc = await category.save();
  res.status(201).json(doc);
};



