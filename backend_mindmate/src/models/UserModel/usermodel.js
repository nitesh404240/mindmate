import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userschema = new mongoose.Schema(
{
Username: {
type: String,
required: true,
unique: true,
trim: true,
},


Email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

Avatar: {
  type: String,
},

password: {
  required: true,
  type: String,
},

refreshToken: {
  type: String,
},

address: {
  fullName: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  street: {
    type: String,
    default: ""
  },

  city: {
    type: String,
    default: ""
  },

  state: {
    type: String,
    default: ""
  },

  pincode: {
    type: String,
    default: ""
  },

  country: {
    type: String,
    default: "India"
  }
},

role: {
  type: String,
  enum: ["user", "admin", "seller"],
  default: "user",
},


},
{ timestamps: true }
);

userschema.pre("save", async function (next) {

if (!this.isModified("password")) {
return next();
}

this.password = await bcrypt.hash(this.password, 10);

next();

});

userschema.methods.isPasswordcorrect = async function (password) {
return await bcrypt.compare(password, this.password);
};

userschema.methods.refreshtokengenerate = async function () {

return jwt.sign(
{ _id: this._id },
process.env.REFRESH_TOKEN_SECRET,
{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
);

};

userschema.methods.generateAccessToken = async function () {

return jwt.sign(
{ _id: this._id },
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
);

};

export const User = mongoose.model("User", userschema);
