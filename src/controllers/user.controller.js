import User  from '../models/user.model.js';

export const fetchUserById = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.status(200).json({ id: user._id, addresses: user.addresses, email: user.email, role: user.role });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(user);
};
