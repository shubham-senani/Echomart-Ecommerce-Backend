import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { sendMail, invoiceTemplate } from "../utils/common.js";

export const fetchOrdersByUser = async (req, res, next) => {
  const { id } = req.user;
  const orders = await Order.find({ user: id });
  res.status(200).json(orders);

};

export const createOrder = async (req, res, next) => {
  const order = new Order({ ...req.body, user: req.user.id });


  for (let item of order.items) {
    let product = await Product.findOne({ _id: item.product._id });
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  const doc = await order.save();
  const user = await User.findById(order.user)

  // we can use await for this also 
  sendMail({ to: user.email, html: invoiceTemplate(order), subject: 'Order Received' })
  res.status(201).json(doc);

};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  res.status(200).json(order);
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(order);

};

export const fetchAllOrders = async (req, res) => {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });


  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
 
  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();
  res.set('X-Total-Count', totalDocs);
  res.status(200).json(docs);
};
