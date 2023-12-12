import Brand from '../models/brand.model.js';

export const fetchBrandsController = async (req, res) => {
  const brands = await Brand.find({}).exec();
  res.status(200).json(brands);
};

export const createBrandController = async (req, res) => {
  const brand = new Brand(req.body);
  const doc = await brand.save();
  res.status(201).json(doc);
};
