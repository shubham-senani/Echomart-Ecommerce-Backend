import Cart from "../models/cart.model.js";

export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  const cartItems = await Cart.find({ user: id }).populate('product');
  res.status(200).json(cartItems);
};

export const addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  const doc = await cart.save();
  const result = await doc.populate('product');
  res.status(201).json(result);
};

export const deleteFromCart = async (req, res) => {
  const { id } = req.params;
  const doc = await Cart.findByIdAndDelete(id);
  res.status(200).json(doc);
};

export const updateCart = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  const result = await cart.populate('product');
  res.status(200).json(result);
};
