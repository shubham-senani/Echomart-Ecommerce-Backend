import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  addresses: {
    type: [Schema.Types.Mixed]
  },
  resetPasswordToken: {
    type: String,
    default: "",
  }

}, { timestamps: true });

//============= Encrypt password =============
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

//============= JSON WEBTOKEN =============
userSchema.methods.createJWT = function () {
  return jwt.sign(
      { id: this._id, email: this.email, role: this.role },
      process.env.JWT_SECRET_KEY
  );
}

const User = mongoose.model("User", userSchema);

export default User;
