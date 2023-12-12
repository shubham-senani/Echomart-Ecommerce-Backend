import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendMail } from '../utils/common.js';

//=========================== create user ====================================
export const createUserController = async (req, res) => {

  const { name, email, password, role, address } = req.body;

  const user = await User.create({ name, email, password, role, address });

  // Generate JWT
  const token = user.createJWT();

  // Set cookie with JWT
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIR_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    secure: false,
  }
  res.cookie("token", token, cookieOptions);

  res.status(201).json({ user, token });

}

//============================ login user ===================================
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exist
  const user = await User.findOne({ email: email });

  // Check if user exist and password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = user.createJWT();

  // Set cookie with JWT
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIR_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  }
  res.cookie("token", token, cookieOptions);

  res.status(201)
    .json({ name: user.name, id: user.id, role: user.role, token: token });
};

//============================= logout user ==================================
export const logoutController = async (req, res) => {
  res
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

//============================= check auth ==================================
export const checkAuthController = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

//=============================== reset pass request ================================
export const resetPasswordRequestController = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    console.log(token);
    await user.save();

    // Also set token in email
    const resetPageLink =
      'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
    const subject = 'reset password for e-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link
    console.log("skip sending email for now");
    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

//================================ reset pass ===============================
export const resetPasswordController = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.salt = salt;

    await user.save();

    const subject = 'Password successfully reset for e-commerce';
    const html = `<p>Successfully able to Reset Password</p>`;

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};
